<script lang="ts" setup>
import { lightenColor, templateSideColor, templateTheme } from '@/schema/templates'
import { useTemplateStore } from '@/store/template'
import { useTokenStore } from '@/store/token'
import { toLoginPage } from '@/utils/toLoginPage'

/**
 * 模板详情：先看版式再决定用不用。
 *
 * 首页卡片直接生成简历的话，用户挨个点一遍就会攒出一堆空简历，所以中间加一层确认页。
 * 排版对标 resume-app-temp 的同名页面：主题色渐变头部 + 白色相框预览 + 信息卡/参数卡 +
 * 底栏「使用模板」。整页按一屏设计：`height: 100vh` 的 flex 列，主体吃掉剩余高度，
 * 底栏在文档流末尾常驻，页面恒等于一屏，不出现滚动条。
 */
defineOptions({ name: 'TemplateDetail' })
definePage({})

const tokenStore = useTokenStore()
const templateStore = useTemplateStore()
/** 当前模板，id 非法时为 null（据此渲染兜底态） */
const tpl = computed(() => templateStore.current)

const theme = computed(() => (tpl.value ? templateTheme(tpl.value) : '#2563eb'))
const side = computed(() => (tpl.value ? templateSideColor(tpl.value) : '#eef4ff'))
/** 提亮一档：做渐变的收尾色，比纯主题色更有层次 */
const themeLight = computed(() => lightenColor(theme.value, 0.35))
/** 主题色兑到极浅：角标与提示卡的衬底 */
const themeSoft = computed(() => lightenColor(theme.value, 0.9))
const heroBg = computed(() => `linear-gradient(160deg, ${theme.value} 0%, ${themeLight.value} 100%)`)
const buttonBg = computed(() => `linear-gradient(135deg, ${theme.value} 0%, ${themeLight.value} 100%)`)

/** 参数卡：固定四项，窄屏也不会换行错位 */
const metaList = computed(() => {
  const style = tpl.value?.style || {}
  return [
    { label: '版式', value: tpl.value?.layout === 'leftRight' ? '左右双栏' : '单栏通排' },
    { label: '一级标题', value: style.firstTitleFontSize || '20px' },
    { label: '正文字号', value: style.textFontSize || '14px' },
    { label: '模块间距', value: style.modelMarginBottom || '40px' },
  ]
})

onLoad(async (query) => {
  const id = query?.id ? String(query.id) : ''
  await templateStore.fetchDetail(id)
  syncNavigationBar()
})

/** 导航栏跟着模板主题色走，滚到顶部时和 hero 连成一片 */
onReady(() => {
  syncNavigationBar()
})

/** 详情拿到后同步导航栏；fetch 与 onReady 谁先谁后都由它兜住 */
function syncNavigationBar() {
  if (!tpl.value)
    return
  uni.setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: theme.value,
  })
  uni.setNavigationBarTitle({ title: tpl.value.name })
}

/** 套用该模板：未登录先去登录，回来后仍停在详情页，再点一次即可 */
function useTemplate() {
  if (!tpl.value)
    return
  if (!tokenStore.updateNowTime().hasLogin) {
    toLoginPage()
    return
  }
  uni.navigateTo({ url: `/pages/edit/index?new=1&template=${tpl.value.code}` })
}
</script>

<template>
  <view class="page">
    <view class="hero" :style="{ background: heroBg }">
      <view class="glow glow-lg" />
      <view class="glow glow-sm" />
      <view class="preview-frame">
        <view class="preview" :style="{ backgroundColor: themeSoft }">
          <resume-cover
            v-if="tpl"
            :layout="tpl.layout"
            :theme-color="theme"
            :side-color="side"
            size="md"
          />
        </view>
      </view>
    </view>

    <view v-if="tpl" class="body">
      <view class="info-card">
        <view class="head-row">
          <text class="tag" :style="{ backgroundColor: themeSoft, color: theme }">精选模板</text>
          <view class="theme-chip">
            <view class="theme-dot" :style="{ backgroundColor: theme }" />
            <text class="theme-text">主题配色</text>
          </view>
        </view>
        <text class="title">{{ tpl.name }}</text>
        <text class="desc">{{ tpl.description }}</text>
      </view>

      <view class="meta-card">
        <view v-for="meta in metaList" :key="meta.label" class="meta-item">
          <text class="meta-value">{{ meta.value }}</text>
          <text class="meta-label">{{ meta.label }}</text>
        </view>
      </view>
    </view>

    <view v-else class="empty">
      <text class="empty-title">模板不存在</text>
      <text class="empty-desc">链接可能已失效，回模板库重新选一个吧</text>
    </view>

    <view v-if="tpl" class="bottom">
      <button
        class="primary"
        :style="{ background: buttonBg }"
        hover-class="primary-press"
        @click="useTemplate"
      >
        使用模板
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  /* 一屏定高：hero + 自适应主体 + 文档流底栏，三块加起来恒等于视口高度，页面不产生滚动条 */
  display: flex;
  height: 100vh;
  flex-direction: column;
  overflow: hidden;
  background-color: #f4f4f4;
}

.hero {
  /* glow 是绝对定位，hero 必须定位，否则会以页面为参照溢出到屏幕外（横向滚动条的来源） */
  position: relative;
  display: flex;
  flex: none;
  overflow: hidden;
  justify-content: center;
  /* 20 + 60 收紧上下留白，配 190px 相框保证小屏（iPhone 8 级别）也一屏放下 */
  padding: 20px 0 60px;
  border-radius: 0 0 28px 28px;
}

.glow {
  position: absolute;
  border-radius: 50%;
  background-color: rgb(255 255 255 / 14%);
}

.glow-lg {
  top: -70px;
  right: -50px;
  width: 190px;
  height: 190px;
}
.glow-sm {
  bottom: -56px;
  left: -36px;
  width: 140px;
  height: 140px;
}

.preview-frame {
  position: relative;
  width: 190px;
  padding: 8px;
  border-radius: 16px;
  background-color: rgb(255 255 255 / 94%);
  box-shadow: 0 16px 34px rgb(23 43 77 / 22%);
}

.preview {
  overflow: hidden;
  width: 100%;
  border-radius: 9px;
}

.body {
  /* 撑满 hero 与底栏之间的剩余高度：屏幕富余时补足空白，屏幕不够时先压缩自身 */
  min-height: 0;
  flex: 1;
  margin-top: -50px;
  padding: 0 16px;
}

.info-card {
  /* hero 是定位元素、层级更高，卡片必须同为定位元素才能压在渐变头部之上（-50px 叠压关系） */
  position: relative;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
}

.head-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tag {
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

.theme-chip {
  display: flex;
  align-items: center;
}

.theme-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.theme-text {
  margin-left: 7px;
  color: #8290a5;
  font-size: 11px;
}

.title {
  display: block;
  margin-top: 14px;
  color: #172b4d;
  font-size: 24px;
  font-weight: 700;
}

.desc {
  display: block;
  margin-top: 8px;
  color: #64748b;
  font-size: 13px;
  line-height: 21px;
}

.meta-card {
  display: flex;
  margin-top: 12px;
  padding: 16px 4px;
  border-radius: 8px;
  background-color: #fff;
}

.meta-item {
  flex: 1;
  text-align: center;
}

.meta-item + .meta-item {
  border-left: 1px solid #eef2f8;
}

.meta-value {
  display: block;
  color: #172b4d;
  font-size: 15px;
  font-weight: 700;
}

.meta-label {
  display: block;
  margin-top: 5px;
  color: #94a3b8;
  font-size: 11px;
}

.empty {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 96px;
}

.empty-title {
  color: #172b4d;
  font-size: 17px;
  font-weight: 600;
}

.empty-desc {
  margin-top: 10px;
  color: #94a3b8;
  font-size: 13px;
}

.bottom {
  /* 参与文档流的底栏（不再 fixed）：高度由 flex 布局直接算进 100vh，不会与页面高度重复累加 */
  box-sizing: border-box;
  flex: none;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background-color: #fff;
  box-shadow: 0 -6px 18px rgb(23 43 77 / 8%);
}

.primary {
  height: 48px;
  border: none;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  line-height: 48px;

  &::after {
    border: none;
  }
}

.primary-press {
  opacity: 0.86;
}
</style>
