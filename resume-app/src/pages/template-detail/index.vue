<script lang="ts" setup>
import type { IResumeTemplate } from '@/schema/templates'
import { getTemplate, lightenColor, templateSideColor, templateTheme } from '@/schema/templates'
import { useTokenStore } from '@/store/token'
import { toLoginPage } from '@/utils/toLoginPage'

/**
 * 模板详情：先看版式再决定用不用。
 *
 * 首页卡片直接生成简历的话，用户挨个点一遍就会攒出一堆空简历，所以中间加一层确认页。
 * 排版对标 resume-app-temp 的同名页面：主题色渐变头部 + 白色相框预览 + 信息卡/参数卡 +
 * 使用建议 + 固定底栏「使用模板」。
 */
defineOptions({ name: 'TemplateDetail' })
definePage({
  style: {
    navigationBarTitleText: '模板详情',
  },
})

const tokenStore = useTokenStore()
/** 当前模板，id 非法时为 null（据此渲染兜底态） */
const tpl = ref<IResumeTemplate | null>(null)

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

onLoad((query) => {
  const id = query?.id ? String(query.id) : ''
  const found = getTemplate(id)
  if (!found)
    return
  tpl.value = found
})

/** 导航栏跟着模板主题色走，滚到顶部时和 hero 连成一片 */
onReady(() => {
  if (!tpl.value)
    return
  uni.setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: theme.value,
  })
  uni.setNavigationBarTitle({ title: tpl.value.name })
})

/** 套用该模板：未登录先去登录，回来后仍停在详情页，再点一次即可 */
function useTemplate() {
  if (!tpl.value)
    return
  if (!tokenStore.updateNowTime().hasLogin) {
    toLoginPage()
    return
  }
  uni.navigateTo({ url: `/pages/edit/index?new=1&template=${tpl.value.id}` })
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
          <text class="tag">精选模板</text>
          <view class="theme-chip" :style="{ backgroundColor: themeSoft }">
            <view class="theme-dot" :style="{ backgroundColor: theme }" />
            <text class="theme-text">主题配色</text>
          </view>
        </view>
        <text class="title">{{ tpl.name }}</text>
        <text class="desc">{{ tpl.desc }}</text>
      </view>

      <view class="meta-card">
        <view v-for="meta in metaList" :key="meta.label" class="meta-item">
          <text class="meta-value">{{ meta.value }}</text>
          <text class="meta-label">{{ meta.label }}</text>
        </view>
      </view>

      <view class="section">
        <view class="section-head">
          <view class="section-bar" :style="{ backgroundColor: theme }" />
          <text class="section-name">使用建议</text>
        </view>
        <view class="tip-card" :style="{ backgroundColor: themeSoft }">
          <text class="tip-text">
            使用后会按这套配色与字号新建一份简历，你只需要逐段填进自己的信息。
            之后想换配色，回模板库另选一个即可，已填内容不会丢。
          </text>
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
  min-height: 100vh;
  /* 固定底栏 48px + 上下留白，非 tab 页可以安全用 fixed */
  padding-bottom: 104px;
  background-color: #f4f4f4;
}

.hero {
  position: relative;
  display: flex;
  overflow: hidden;
  justify-content: center;
  padding: 26px 0 78px;
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
  width: 180px;
  height: 180px;
}
.glow-sm {
  bottom: -56px;
  left: -36px;
  width: 140px;
  height: 140px;
}

.preview-frame {
  position: relative;
  width: 204px;
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
  margin-top: -50px;
  padding: 0 16px;
}

.info-card {
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
  padding: 3px 10px;
  border-radius: 10px;
  background-color: #eff6ff;
  color: #2563eb;
  font-size: 11px;
  font-weight: 600;
}

.theme-chip {
  display: flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 12px;
}

.theme-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.theme-text {
  margin-left: 6px;
  color: #64748b;
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

.section {
  margin-top: 22px;
}

.section-head {
  display: flex;
  align-items: center;
}

.section-bar {
  width: 4px;
  height: 15px;
  margin-right: 8px;
  border-radius: 2px;
}

.section-name {
  color: #172b4d;
  font-size: 16px;
  font-weight: 700;
}

.tip-card {
  margin-top: 12px;
  padding: 16px;
  border-radius: 8px;
}

.tip-text {
  color: #4b5563;
  font-size: 13px;
  line-height: 22px;
}

.empty {
  display: flex;
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
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background-color: #fff;
  box-shadow: 0 -6px 18px rgb(23 43 77 / 8%);
}

.primary {
  height: 48px;
  border: none;
  border-radius: 24px;
  box-shadow: 0 6px 16px rgb(37 99 235 / 26%);
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
