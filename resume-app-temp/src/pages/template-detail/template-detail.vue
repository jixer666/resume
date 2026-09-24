<script setup lang="ts">
import { DEFAULT_GLOBAL_STYLE, entryStyleOptions, softenColor, titleStyleOptions } from '@/schema/style'
import { getComposition } from '@/schema/compositions'
import { getTemplate } from '@/schema/templates'
import { useResumeStore } from '@/store/resume'

const store = useResumeStore()
const id = ref('classic')
const item = computed(() => getTemplate(id.value))

/** 模板主题色：模板未配置时回退到全局默认色 */
const themeColor = computed(() => item.value.style?.themeColor || DEFAULT_GLOBAL_STYLE.themeColor)
/** 主题色提亮一档，用于渐变收尾与浅色衬底 */
const themeLight = computed(() => softenColor(themeColor.value, 0.35))
/** 极浅衬底，用于标签与提示卡 */
const themeSoft = computed(() => softenColor(themeColor.value, 0.9))
const heroBg = computed(() => `linear-gradient(160deg, ${themeColor.value} 0%, ${themeLight.value} 100%)`)
const buttonBg = computed(() => `linear-gradient(135deg, ${themeColor.value} 0%, ${themeLight.value} 100%)`)

const composition = computed(() => getComposition(item.value.composition))
const moduleCount = computed(() => composition.value.modules.length)

/** 版式文案：两栏布局与单栏布局的阅读节奏不同，直接标出来 */
const layoutLabel = computed(() => (composition.value.layout === 'leftRight' ? '双栏排版' : '单栏排版'))

/** 标题样式文案：取模板覆盖值，未覆盖时跟随全局默认 */
const titleStyleLabel = computed(() => {
  const key = item.value.style?.titleStyle || DEFAULT_GLOBAL_STYLE.titleStyle
  return titleStyleOptions.find(opt => opt.value === key)?.label || '色条'
})

/** 条目外观文案：模块内每条经历呈现的形态 */
const entryStyleLabel = computed(() => {
  const key = item.value.style?.entryStyle || DEFAULT_GLOBAL_STYLE.entryStyle
  return entryStyleOptions.find(opt => opt.value === key)?.label || '无框'
})

const metaList = computed(() => [
  { label: '版式', value: layoutLabel.value },
  { label: '内容模块', value: `${moduleCount.value} 个` },
  { label: '标题样式', value: titleStyleLabel.value },
  { label: '条目外观', value: entryStyleLabel.value },
])

/** 导航栏跟随模板主题色，否则蓝底导航栏压在异色头图上会断层 */
function syncNavColor() {
  uni.setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: themeColor.value,
  })
  uni.setNavigationBarTitle({ title: item.value.name })
}

onLoad((q) => {
  if (q?.id)
    id.value = String(q.id)
})

onReady(syncNavColor)

function useTemplate() {
  const json = store.createResume(item.value.id)
  uni.navigateTo({ url: `/pages/resume-edit/resume-edit?id=${json.ID}` })
}
</script>

<template>
  <view class="page">
    <view class="hero" :style="{ background: heroBg }">
      <view class="glow glow-lg" />
      <view class="glow glow-sm" />
      <view class="preview-frame">
        <image :src="item.cover" mode="aspectFit" class="preview" />
      </view>
    </view>

    <view class="body">
      <view class="info-card">
        <view class="head-row">
          <text class="tag" :style="{ background: themeSoft, color: themeColor }">精选模板</text>
          <view class="theme-chip">
            <view class="theme-dot" :style="{ background: themeColor }" />
            <text class="theme-text">主题配色</text>
          </view>
        </view>
        <text class="title">{{ item.name }}</text>
        <text class="desc">{{ item.description }}</text>
      </view>

      <view class="meta-card">
        <view v-for="meta in metaList" :key="meta.label" class="meta-item">
          <text class="meta-value">{{ meta.value }}</text>
          <text class="meta-label">{{ meta.label }}</text>
        </view>
      </view>

      <view class="section">
        <view class="section-head">
          <view class="section-bar" :style="{ background: themeColor }" />
          <text class="section-name">使用建议</text>
        </view>
        <view class="tip-card" :style="{ background: themeSoft }">
          <text class="tip-text">清晰的内容结构、舒适的阅读节奏，帮助招聘者快速了解你的优势。选用模板后仍可在预览页随时更换样式与配色。</text>
        </view>
      </view>
    </view>

    <view class="bottom">
      <button class="primary" :style="{ background: buttonBg }" hover-class="primary-press" @click="useTemplate">
        使用模板
      </button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: rgb(244, 244, 244);
  padding-bottom: 104px;
}
.hero {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding: 26px 0 78px;
  border-radius: 0 0 28px 28px;
}
.glow {
  position: absolute;
  border-radius: 50%;
  background: rgb(255 255 255 / 16%);
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
  width: 204px;
  padding: 8px;
  border-radius: 16px;
  background: rgb(255 255 255 / 94%);
  box-shadow: 0 16px 34px rgb(23 43 77 / 22%);
}
.preview {
  display: block;
  width: 100%;
  height: 272px;
  border-radius: 9px;
  background: #f4f8ff;
}
.body {
  margin-top: -50px;
  padding: 0 16px;
}
.info-card {
  position: relative;
  padding: 20px;
  border-radius: 8px;
  background: #fff;
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
  background: #fff;
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
  margin: 0 2px 10px;
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
  padding: 16px;
  border-radius: 8px;
}
.tip-text {
  color: #4b5563;
  font-size: 13px;
  line-height: 22px;
}
.bottom {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -6px 18px rgb(23 43 77 / 8%);
}
.primary {
  height: 48px;
  border-radius: 24px;
  box-shadow: 0 6px 16px rgb(37 99 235 / 26%);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  line-height: 48px;
}
.primary::after {
  border: none;
}
.primary-press {
  opacity: 0.86;
}
</style>
