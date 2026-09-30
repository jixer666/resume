<script lang="ts" setup>
import { exportResumePdf } from '@/api/resume'
import ResumeRender from '@/components/ResumeRender/ResumeRender.vue'
import { coverBackdrop, templateSideColor, templateTheme } from '@/schema/templates'
import type { IFitBase } from '@/store/resume'
import { useResumeStore } from '@/store/resume'
import { useTemplateStore } from '@/store/template'
import { findFitRatio, FIT_TOLERANCE } from '@/utils/fit'
import { countPages } from '@/utils/pagination'
import { hideLoading, showLoading, showToast } from '@/utils/toast'

/**
 * 简历预览：全屏只读，同一份 JSON + 同一套物料，用 ResumeRender 以 HTML/CSS 渲染 —— 所见即所得，
 * 不需要为预览另写一套渲染代码（导出的 PDF 同理，后端复用同一套物料样式）。
 *
 * A4 纸宽 794px 是物料层字号 / 间距的同一坐标系，手机上放不下，所以整体 `scale`。
 *
 * 分页：先量出未缩放的内容总高，按 A4 高（1123px）算出页数；
 * 每页渲染一份 ResumeRender 并用 `margin-top: -(页序 * 1123)` 上移，外层 `overflow: hidden`
 * 裁掉多余部分 —— 即「真实分页」，内容跨页续接、不丢数据（允许切断半行文字）。
 *
 * 量高要等重渲染落地（见 measureSettledHeight）、取整要扣亚像素容差（见 utils/pagination），
 * 否则真机上量到的是上一轮的 min-height，空白页会一页页往上叠。
 */
defineOptions({ name: 'ResumeEditPreview' })
definePage({
  style: {
    navigationBarTitleText: '简历预览',
  },
})

/** A4 纸宽（px） */
const PAPER_WIDTH = 794
/** A4 纸高（px）：分页的裁切高度，内容不足一页时也保持整页 */
const PAPER_HEIGHT = 1123
/** 页与页之间的间距（px），与 `.slot` 的 margin-bottom 保持一致，算可视页要用 */
const SLOT_GAP = 12

const store = useResumeStore()
const templateStore = useTemplateStore()
const resume = computed(() => store.current)
const templates = computed(() => templateStore.list)

const paperScale = ref(1)
/** 未缩放的内容总高，用来算页数 */
const contentHeight = ref(PAPER_HEIGHT)
/**
 * 页数：至少 1 页，超出按 A4 高向上取整。
 *
 * 取整交给 countPages：它会先扣掉亚像素容差（量到的高度是缩放后除回来的，误差 1px 上下），
 * 内容刚好一张纸时不会再被顶成两页。
 */
const pageCount = computed(() => countPages(contentHeight.value, PAPER_HEIGHT))

/** 每页在页面上的占位尺寸（缩放后） */
const slotStyle = computed(() => ({
  width: `${PAPER_WIDTH * paperScale.value}px`,
  height: `${PAPER_HEIGHT * paperScale.value}px`,
}))
const paperStyle = computed(() => ({ transform: `scale(${paperScale.value})` }))

const showModuleSheet = ref(false)
/** 样式弹层：内含「全局样式 / 组件样式」两栏 */
const showStyleSheet = ref(false)
const showTemplateSheet = ref(false)
/** 当前模板编码：载入详情与换模板都会同步进 store，列表据此高亮当前项 */
const activeTemplateCode = computed(() => store.currentTemplateCode)
/** 导出中：生成 PDF 有耗时，按钮连点会重复请求 */
const exporting = ref(false)
/** 一键整理中：逐档压缩要反复测量，期间锁住按钮 */
const fitting = ref(false)
/** 「整理成一页」前的样式基准：有值说明已整理过，再点一次是还原（见 restoreFit） */
const fitBase = ref<IFitBase | null>(null)
/** 当前可视页：页码胶囊显示用（滚动位置只存在普通变量里，不回写 scroll-top） */
const visiblePage = ref(1)
/** 回到顶部的目标 id：用 scroll-into-view 而不是受控 scroll-top，避免与滚动事件互相打架 */
const scrollTarget = ref('')
/** 正在量内容高度：量的时候不传 min-height，否则量到的是「页数 × A4 高」，整理永远判成装不下 */
const measuring = ref(false)
/** 传给 ResumeRender 的最小高度：撑满已算出的页数，双列模板第 2 页起左栏底色才不会断 */
const renderMinHeight = computed(() => (measuring.value ? undefined : pageCount.value * PAPER_HEIGHT))

/** 内容恰好等于纸高也算装得下，留 2px 给亚像素误差（见 utils/fit） */
const FIT_LIMIT = PAPER_HEIGHT + FIT_TOLERANCE

/** 量高的最大尝试次数：真机上重渲染落到视图层不止一帧，量不稳就再等一帧重来 */
const MEASURE_ATTEMPTS = 4

onShow(() => {
  syncPaperScale()
  measurePaper()
})

/** 按窗口宽度算缩放比，保证 A4 整页横向放得下 */
function syncPaperScale() {
  const width = uni.getSystemInfoSync().windowWidth || PAPER_WIDTH
  paperScale.value = Math.min(1, Math.max(0.35, (width - 24) / PAPER_WIDTH))
}

/** 等一次渲染 + 布局完成（小程序没有布局就绪事件，给一帧多一点的时间） */
function waitRender(ms = 90): Promise<void> {
  return new Promise((resolve) => {
    nextTick(() => setTimeout(resolve, ms))
  })
}

/** 量未缩放的内容高度（px）；量不到返回 0 */
function measureHeight(): Promise<number> {
  return new Promise((resolve) => {
    uni.createSelectorQuery()
      .select('#resumePaper')
      .boundingClientRect((rect) => {
        const info = Array.isArray(rect) ? rect[0] : rect
        const height = info && 'height' in info ? Number(info.height) : 0
        resolve(height ? height / paperScale.value : 0)
      })
      .exec()
  })
}

/**
 * 量「内容自然高度」（未缩放，px）：量之前先摘掉 min-height。
 *
 * 不摘的话量到的是 min-height（页数 × A4 高），页数越多量出来越高 ——
 * 「整理成一页」会永远判定为装不下，整理也就永远完不成。
 *
 * 摘掉 min-height 要等一次重渲染，真机上 setData 落到视图层往往不止一帧：
 * 量早了量到的还是上一轮的 min-height，页数就会一页页往上叠（换一次模板多一张空白纸）。
 * 所以这里量「稳定高度」—— 连续两次量到同一个值才算数。
 */
async function measureContentHeight(): Promise<number> {
  measuring.value = true
  await waitRender(60)
  const height = await measureSettledHeight()
  measuring.value = false
  return height
}

/**
 * 量稳定下来的高度（未缩放，px）：连续两次量到同一个高度（±2px）才认为渲染已经落地。
 *
 * 单次测量拿到的是「视图层此刻的高度」，刚改过样式 / 刚摘掉 min-height 时可能还是旧值；
 * 同一个布局连着量两次结果必然一致，不一致说明上一帧的改动还没落地，再等一帧重来。
 */
async function measureSettledHeight(): Promise<number> {
  let height = 0
  for (let attempt = 0; attempt < MEASURE_ATTEMPTS; attempt++) {
    const next = await measureHeight()
    if (height && next && Math.abs(next - height) <= FIT_TOLERANCE) {
      height = next
      break
    }
    height = next
    await waitRender(60)
  }
  return height
}

/** 量内容高度，据此算页数 */
async function measurePaper(): Promise<void> {
  const height = await measureContentHeight()
  if (height)
    contentHeight.value = Math.max(PAPER_HEIGHT, height)
}

/**
 * 一键整理成一页 A4：把字号与纵向留白按比例收紧，直到内容量出来不超过一张 A4。
 *
 * 收的是整页所有纵向节奏 —— 模块的 pTop / pBottom / mTop / mBottom、条目间距、字号（全局同步），
 * 以及整页统一的条目间距 / 小标题条高度 / 姓名大小与头像尺寸，所以预览与导出的 PDF 都是一页。
 * 每档都在**整理前的基准值**上乘比例（见 store.captureFitBase），而不是在上一档的结果上继续乘 ——
 * 档位之间互不影响，也不会把皮肤自带的留白抹平。
 *
 * 压到最低档还装不下就还原基准：既然挤不进一页，就别把版式改坏。
 *
 * 整理成功后按钮变成「还原样式」：把整理前的基准值原样套回（见 restoreFit）；
 * 整理之后用户又调过的样式会先并入基准（见 store.rebaseFitBase），还原时不会被抹掉。
 */
async function fitToOnePage() {
  if (fitting.value || !resume.value)
    return
  // 已经整理过：这次点击是「还原」，把整理前的基准值原样套回去
  if (fitBase.value) {
    await restoreFit()
    return
  }
  fitting.value = true
  showLoading({ title: '正在整理', mask: true })
  let message = ''
  try {
    // 整个测量过程都摘掉 min-height（见 measureContentHeight），量到的才是内容真实高度
    measuring.value = true
    await waitRender(60)
    const height = await measureSettledHeight()
    if (!height) {
      message = '暂时量不到简历高度，请稍后重试'
    }
    else if (height <= PAPER_HEIGHT + FIT_TOLERANCE) {
      message = '当前已经是一页啦'
    }
    else {
      const base = store.captureFitBase()
      // 每档都在**整理前的基准值**上乘比例（不是叠乘），档位之间互不影响；
      // 测量前先摘掉 min-height（见 measureContentHeight），量到的才是内容真实高度
      const ratio = await findFitRatio(
        r => store.applyFitScale(base, r),
        () => waitRender().then(() => measureSettledHeight()),
        FIT_LIMIT,
      )
      if (ratio !== null) {
        // 收尾再套一次最终比例：屏幕上留下的样式与记录的比例必须一致
        store.applyFitScale(base, ratio)
        await waitRender()
        fitBase.value = base
        message = `已整理成一页 A4（样式收到 ${Math.round(ratio * 100)}%）`
      }
      else {
        store.applyFitScale(base, 1)
        message = '内容较多，压不进一页，样式已还原'
      }
      await measurePaper()
      store.saveCurrent().catch((error) => {
        console.error('保存简历失败:', error)
      })
    }
  }
  catch (error) {
    console.error('整理成一页失败:', error)
    message = '整理失败，请重试'
  }
  finally {
    measuring.value = false
    fitting.value = false
  }
  hideLoading()
  if (message)
    showToast({ title: message })
}

/** 还原「整理成一页」：基准值乘 1 即无损还原（见 store.applyFitScale），再重新分页并落库 */
async function restoreFit() {
  const base = fitBase.value
  if (!base)
    return
  fitting.value = true
  showLoading({ title: '正在还原', mask: true })
  try {
    store.applyFitScale(base, 1)
    fitBase.value = null
    await measurePaper()
    store.saveCurrent().catch((error) => {
      console.error('保存简历失败:', error)
    })
    hideLoading()
    showToast({ title: '已还原整理前的样式' })
  }
  catch (error) {
    console.error('还原整理样式失败:', error)
    hideLoading()
    showToast({ title: '还原失败，请重试' })
  }
  finally {
    measuring.value = false
    fitting.value = false
  }
}

/**
 * 滚动时只更新「当前第几页」。
 *
 * 位置刻意存在普通变量里、绝不回写 `scroll-top` —— 受控 scroll-top 与滚动事件互相打架，
 * 小程序上会表现为页面疯狂抖动（每一帧都被拉回上一次的值）。
 */
function onScroll(event: { detail: { scrollTop: number } }) {
  const top = event.detail.scrollTop || 0
  const paperHeight = PAPER_HEIGHT * paperScale.value
  const unit = paperHeight + SLOT_GAP
  const page = Math.floor((top + paperHeight / 2) / unit) + 1
  visiblePage.value = Math.min(pageCount.value, Math.max(1, page))
}

/** 回到顶部：用 scroll-into-view 指到第一页，用完清空，下一次点击才能再次触发 */
function scrollToTop() {
  scrollTarget.value = 'pageTop'
  setTimeout(() => {
    scrollTarget.value = ''
  }, 500)
}

/** 样式 / 模块改动会改变内容高度，关闭弹层时落库并重新分页 */
function closeSheet() {
  const styleChanged = showStyleSheet.value
  showModuleSheet.value = false
  showStyleSheet.value = false
  // 样式面板改过样式后，把「整理成一页」的基准里刚被改过的字段换成新值（见 store.rebaseFitBase）：
  // 「还原样式」还原的是整理前的外观 + 用户整理后的改动，两边都不会被抹掉
  if (styleChanged && fitBase.value)
    fitBase.value = store.rebaseFitBase(fitBase.value)
  store.saveCurrent().catch((error) => {
    console.error('保存简历失败:', error)
  })
  measurePaper()
}

/** 打开换模板面板：首次进入顺带拉一遍模板列表 */
function openTemplateSheet() {
  showTemplateSheet.value = true
  if (!templateStore.loaded)
    templateStore.fetchList()
}

/**
 * 换模板：只换版式与样式，已填内容与模块顺序保留。
 *
 * 换完要重新分页（LAYOUT 变了，内容高度也跟着变），并落库。
 */
function chooseTemplate(code: string) {
  showTemplateSheet.value = false
  if (code === activeTemplateCode.value)
    return
  if (!store.applyTemplate(code)) {
    showToast({ title: '该模板暂不可用' })
    return
  }
  // 换模板后模块样式整体重来，整理前的基准值失效
  fitBase.value = null
  store.saveCurrent().catch((error) => {
    console.error('保存简历失败:', error)
  })
  measurePaper()
}

/**
 * 导出 PDF：后端按库里的简历 JSON 生成，所以先落库拿主键，再下载并打开。
 *
 * `uni.downloadFile` 不写文件，拿到临时路径直接 `openDocument`，用户可在打开后的
 * 右上角菜单里转发 / 保存 —— 这是小程序端唯一能落地 PDF 的路径。
 */
async function exportPdf() {
  if (exporting.value)
    return
  exporting.value = true
  showLoading({ title: '正在生成 PDF', mask: true })
  try {
    await store.saveCurrent()
    const id = Number(store.current?.ID)
    if (!Number.isFinite(id) || id <= 0)
      throw new Error('简历尚未保存，无法导出')
    let lastPercent = 0
    const filePath = await exportResumePdf(id, (percent) => {
      // 后端渲染 PDF 期间进度一直是 0，只有真正开始下载才会动，所以 0 不覆盖「正在生成」文案
      if (percent <= 0 || percent === lastPercent)
        return
      lastPercent = percent
      showLoading({ title: `正在下载 ${percent}%`, mask: true })
    })
    hideLoading()
    uni.openDocument({
      filePath,
      fileType: 'pdf',
      showMenu: true,
      fail: () => showToast({ title: '打开 PDF 失败' }),
    })
  }
  catch (error) {
    hideLoading()
    showToast({ title: (error as Error).message || '导出失败' })
  }
  finally {
    exporting.value = false
  }
}
</script>

<template>
  <view class="page">
    <scroll-view
      v-if="resume"
      scroll-y
      class="page__scroll"
      :scroll-into-view="scrollTarget"
      :scroll-with-animation="true"
      @scroll="onScroll"
    >
      <view class="stack">
        <view
          v-for="index in pageCount"
          :id="index === 1 ? 'pageTop' : undefined"
          :key="index"
          class="slot"
          :style="slotStyle"
        >
          <view class="paper" :style="paperStyle">
            <view
              :id="index === 1 ? 'resumePaper' : undefined"
              class="paper__inner"
              :style="{ marginTop: `${-(index - 1) * PAPER_HEIGHT}px` }"
            >
              <ResumeRender :json="resume" :min-height="renderMinHeight" />
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view v-else class="empty">
      <text class="empty-text">暂无可预览内容</text>
    </view>

    <view v-if="resume" class="actions">
      <view
        class="action"
        :class="{ 'action--disabled': exporting }"
        :hover-class="exporting ? 'none' : 'action--press'"
        @click="exportPdf"
      >
        <mp-icon name="ui-download" color="#ffffff" size="24px" />
        <text class="action-text">{{ exporting ? '导出中' : '导出' }}</text>
      </view>
      <view
        class="action"
        :class="{ 'action--disabled': fitting }"
        :hover-class="fitting ? 'none' : 'action--press'"
        @click="fitToOnePage"
      >
        <mp-icon :name="fitBase ? 'ui-renew' : 'ui-compress'" color="#ffffff" size="24px" />
        <text class="action-text">{{ fitting ? '处理中' : fitBase ? '还原样式' : '整理成一页' }}</text>
      </view>
      <view class="action" hover-class="action--press" @click="showStyleSheet = true">
        <mp-icon name="ui-palette" color="#ffffff" size="24px" />
        <text class="action-text">样式</text>
      </view>
      <view class="action" hover-class="action--press" @click="showModuleSheet = true">
        <mp-icon name="ui-list" color="#ffffff" size="24px" />
        <text class="action-text">模块</text>
      </view>
      <view class="action" hover-class="action--press" @click="openTemplateSheet">
        <mp-icon name="ui-renew" color="#ffffff" size="24px" />
        <text class="action-text">更换模板</text>
      </view>
    </view>

    <!-- 页码胶囊：右下悬浮，点一下回到顶部；放在底栏之上，避免遮挡操作 -->
    <view v-if="resume" class="pager" hover-class="pager--press" @click="scrollToTop">
      <mp-icon name="ui-up" color="#ffffff" size="12px" />
      <text class="pager-text">{{ visiblePage }} / {{ pageCount }}</text>
    </view>

    <module-manager-sheet :visible="showModuleSheet" @close="closeSheet" @change="closeSheet" />

    <style-sheet :visible="showStyleSheet" @close="closeSheet" />

    <view v-if="showTemplateSheet" class="mask">
      <view class="mask__backdrop" @click="showTemplateSheet = false" />
      <view class="sheet sheet--tall" @click.stop>
        <text class="sheet-title">更换模板</text>
        <text class="sheet-sub">只换版式与样式，已填内容会保留</text>
        <scroll-view scroll-y class="sheet-scroll sheet-scroll--tall">
          <view v-if="templateStore.loading && !templates.length" class="tpl-hint">
            模板加载中...
          </view>
          <view v-else-if="!templates.length" class="tpl-hint">
            暂无可选模板
          </view>
          <view v-else class="tpl-grid">
            <view
              v-for="item in templates"
              :key="item.code"
              class="tpl-card"
              :class="{ 'tpl-card--active': item.code === activeTemplateCode }"
              hover-class="tpl-card--press"
              @click="chooseTemplate(item.code)"
            >
              <view class="tpl-cover" :style="{ background: coverBackdrop(templateTheme(item)) }">
                <view class="tpl-cover-box">
                  <resume-cover
                    :layout="item.layout"
                    :theme-color="templateTheme(item)"
                    :side-color="templateSideColor(item)"
                  />
                </view>
              </view>
              <text class="tpl-name">{{ item.name }}</text>
            </view>
          </view>
        </scroll-view>
        <view class="sheet-cancel" hover-class="sheet-cancel--press" @click="showTemplateSheet = false">
          关闭
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import '../../style/editor-sheet.scss';

.page {
  height: 100vh;
  background-color: #000;
}

.page__scroll {
  height: 100%;
}

.stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 12px 0 20px;
  /* 底栏约 76px，再加 iPhone 底部安全区，避免最后一页被盖住 */
  padding-bottom: calc(96px + env(safe-area-inset-bottom));
}

/* 单页占位：尺寸 = A4 * 缩放比，纸张在内按原始尺寸绘制后再整体 scale */
.slot {
  position: relative;
  margin-bottom: 12px;
  overflow: hidden;
  /* 虚拟渲染只画可视页附近，未渲染的页保持白纸底色，快速滚动时不会闪出黑底 */
  background-color: #fff;
}

.paper {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 794px;
  height: 1123px;
  transform-origin: top left;
  overflow: hidden;
  background-color: #fff;
}

/* 每页内部都是同一份完整内容，靠负 margin 上移到本页对应的区间 */
.paper__inner {
  box-sizing: border-box;
  width: 794px;
}

.actions {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  padding: 6px 8px;
  padding-bottom: calc(6px + env(safe-area-inset-bottom));
  background-color: #16181d;
  box-shadow: 0 -6px 18px rgb(0 0 0 / 45%);
}

.action {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;

  &--press {
    background-color: rgb(255 255 255 / 12%);
  }
}

.action-text {
  margin-top: 3px;
  color: #fff;
  font-size: 10px;
}

/* 进行中 / 不可用：整块压暗，配合 hover-class 关闭按压反馈 */
.action--disabled {
  opacity: 0.4;
}

/* 页码胶囊：右下悬浮，点一下回到顶部；高度避开底栏，不挡操作 */
.pager {
  position: fixed;
  right: 12px;
  bottom: calc(88px + env(safe-area-inset-bottom));
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 15px;
  background-color: rgb(22 24 29 / 82%);
}

.pager--press {
  background-color: rgb(22 24 29 / 96%);
}

.pager-text {
  margin-left: 4px;
  color: #fff;
  font-size: 12px;
}

/* 换模板卡片：三列铺开，封面复用首页的 ResumeCover 缩略图 */
.tpl-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  padding: 4px 0 2px;
}

.tpl-card {
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 10px;
  background-color: #fff;

  &--active {
    border-color: var(--wot-color-theme, #2563eb);
  }

  &--press {
    opacity: 0.88;
  }
}

.tpl-cover {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 118px;
  padding: 8px;
}

.tpl-cover-box {
  width: 74px;
}

.tpl-name {
  display: block;
  overflow: hidden;
  padding: 6px 4px 8px;
  color: #172b4d;
  font-size: 11px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tpl-hint {
  display: block;
  padding: 28px 0;
  color: #94a3b8;
  font-size: 13px;
  text-align: center;
}

.empty {
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
}

.empty-text {
  color: #8f959e;
  font-size: 14px;
}
</style>

<style lang="scss">
/* 与 index.vue 一致：关键帧必须写在非 scoped 块里，scoped 块内的 @keyframes 会被编译改名而引用不会同步 */
@keyframes sheet-up {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}
</style>
