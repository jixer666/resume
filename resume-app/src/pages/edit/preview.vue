<script lang="ts" setup>
import { exportResumePdf } from '@/api/resume'
import ResumeRender from '@/components/ResumeRender/ResumeRender.vue'
import { coverBackdrop, templateSideColor, templateTheme } from '@/schema/templates'
import { useResumeStore } from '@/store/resume'
import { useTemplateStore } from '@/store/template'

/**
 * 简历预览：全屏只读，同一份 JSON + 同一套物料，用 ResumeRender 以 HTML/CSS 渲染 —— 所见即所得，
 * 不需要为预览另写一套渲染代码（导出的 PDF 同理，后端复用同一套物料样式）。
 *
 * A4 纸宽 794px 是物料层字号 / 间距的同一坐标系，手机上放不下，所以整体 `scale`。
 *
 * 分页：先量出未缩放的内容总高，按 A4 高（1123px）算出页数；
 * 每页渲染一份 ResumeRender 并用 `margin-top: -(页序 * 1123)` 上移，外层 `overflow: hidden`
 * 裁掉多余部分 —— 即「真实分页」，内容跨页续接、不丢数据（允许切断半行文字）。
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

const store = useResumeStore()
const templateStore = useTemplateStore()
const resume = computed(() => store.current)
const templates = computed(() => templateStore.list)

const paperScale = ref(1)
/** 未缩放的内容总高，用来算页数 */
const contentHeight = ref(PAPER_HEIGHT)
/** 页数：至少 1 页，超出按 A4 高向上取整 */
const pageCount = computed(() => Math.max(1, Math.ceil(contentHeight.value / PAPER_HEIGHT)))

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
/** 本次会话内换过的模板编码，用来在列表里标出当前项（后端不返回该字段） */
const activeTemplateCode = ref('')
/** 导出中：生成 PDF 有耗时，按钮连点会重复请求 */
const exporting = ref(false)
/** 一键整理中：逐档压缩要反复测量，期间锁住按钮 */
const fitting = ref(false)

/**
 * 一键整理的压缩档位：从「几乎不动」逐档收紧，取第一个能装进一页的档位。
 *
 * 每档对基准值乘一次比例（不是叠乘），所以档位之间互不影响、也不会越压越离谱。
 */
const FIT_RATIOS = [0.94, 0.88, 0.82, 0.76, 0.7, 0.64, 0.58]
/** 内容恰好等于纸高也算装得下，留 2px 给亚像素误差 */
const FIT_TOLERANCE = 2

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

/** 量未缩放的内容高度，据此算页数 */
async function measurePaper(): Promise<void> {
  await waitRender(60)
  const height = await measureHeight()
  if (height)
    contentHeight.value = Math.max(PAPER_HEIGHT, height)
}

/**
 * 一键整理成一页 A4：逐档压缩字号与模块纵向间距，直到内容量出来不超过一张 A4。
 *
 * 压缩写的是真实样式数据（模块各自的 pTop / pBottom / mTop / mBottom 与字号，全局字号同步），
 * 所以预览与导出的 PDF 都是一页。每档都在**整理前的基准值**上乘比例（见 store.captureFitBase），
 * 而不是在上一档的结果上继续乘 —— 档位之间互不影响，也不会把皮肤自带的留白抹平。
 *
 * 一路压到底还装不下就还原基准：既然挤不进一页，就别把版式改坏。
 */
async function fitToOnePage() {
  if (fitting.value || !resume.value)
    return
  fitting.value = true
  uni.showLoading({ title: '正在整理', mask: true })
  let message = ''
  try {
    const height = await measureHeight()
    if (!height) {
      message = '暂时量不到简历高度，请稍后重试'
    }
    else if (height <= PAPER_HEIGHT + FIT_TOLERANCE) {
      message = '当前已经是一页啦'
    }
    else {
      const base = store.captureFitBase()
      let fitted = false
      for (const ratio of FIT_RATIOS) {
        store.applyFitScale(base, ratio)
        await waitRender()
        const next = await measureHeight()
        if (next > 0 && next <= PAPER_HEIGHT + FIT_TOLERANCE) {
          fitted = true
          break
        }
      }
      if (!fitted)
        store.applyFitScale(base, 1)
      await measurePaper()
      store.saveCurrent().catch((error) => {
        console.error('保存简历失败:', error)
      })
      message = fitted ? '已整理成一页 A4' : '内容较多，压不进一页，样式已还原'
    }
  }
  catch (error) {
    console.error('整理成一页失败:', error)
    message = '整理失败，请重试'
  }
  finally {
    fitting.value = false
  }
  uni.hideLoading()
  if (message)
    uni.showToast({ title: message, icon: 'none' })
}

/** 样式 / 模块改动会改变内容高度，关闭弹层时落库并重新分页 */
function closeSheet() {
  showModuleSheet.value = false
  showStyleSheet.value = false
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
    uni.showToast({ title: '该模板暂不可用', icon: 'none' })
    return
  }
  activeTemplateCode.value = code
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
  uni.showLoading({ title: '正在生成 PDF', mask: true })
  try {
    await store.saveCurrent()
    const id = Number(store.current?.ID)
    if (!Number.isFinite(id) || id <= 0)
      throw new Error('简历尚未保存，无法导出')
    const filePath = await exportResumePdf(id)
    uni.hideLoading()
    uni.openDocument({
      filePath,
      fileType: 'pdf',
      showMenu: true,
      fail: () => uni.showToast({ title: '打开 PDF 失败', icon: 'none' }),
    })
  }
  catch (error) {
    uni.hideLoading()
    uni.showToast({ title: (error as Error).message || '导出失败', icon: 'none' })
  }
  finally {
    exporting.value = false
  }
}
</script>

<template>
  <view class="page">
    <scroll-view v-if="resume" scroll-y class="page__scroll">
      <view class="stack">
        <view v-for="index in pageCount" :key="index" class="slot" :style="slotStyle">
          <view class="paper" :style="paperStyle">
            <view
              :id="index === 1 ? 'resumePaper' : undefined"
              class="paper__inner"
              :style="{ marginTop: `${-(index - 1) * PAPER_HEIGHT}px` }"
            >
              <ResumeRender :json="resume" />
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view v-else class="empty">
      <text class="empty-text">暂无可预览内容</text>
    </view>

    <view v-if="resume" class="actions">
      <view class="action" hover-class="action--press" @click="exportPdf">
        <mp-icon name="ui-download" color="#ffffff" size="24px" />
        <text class="action-text">导出</text>
      </view>
      <view class="action" hover-class="action--press" @click="fitToOnePage">
        <mp-icon name="ui-compress" color="#ffffff" size="24px" />
        <text class="action-text">{{ fitting ? '整理中' : '整理成一页' }}</text>
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

    <module-manager-sheet :visible="showModuleSheet" @close="closeSheet" @change="closeSheet" />

    <style-sheet :visible="showStyleSheet" @close="closeSheet" />

    <view v-if="showTemplateSheet" class="mask" @click="showTemplateSheet = false">
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
    border-color: var(--wot-color-theme, #0957de);
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
  padding-top: 240rpx;
  text-align: center;
}

.empty-text {
  color: #909399;
  font-size: 28rpx;
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
