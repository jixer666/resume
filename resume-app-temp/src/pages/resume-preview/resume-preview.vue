<script setup lang="ts">
import type { IGlobalStyle, TitleStyle } from '@/schema/types'
import { DEFAULT_GLOBAL_STYLE, fontFamilyOptions, fontScaleOptions, lineScaleOptions, scaleGlobalStyle, scaleLineHeight, styleThemeColors, titleStyleOptions } from '@/schema/style'
import { getTemplate, TEMPLATES } from '@/schema/templates'
import { useResumeStore } from '@/store/resume'
import ResumeRenderer from '@/material/shared/ResumeRenderer.vue'

/**
 * 简历预览：同一份 JSON + 同一套物料，用 ResumeRenderer 以 HTML/CSS 渲染。
 *
 * 导出走浏览器打印（H5），不再有 canvas 绘制代码 —— 屏幕所见即打印所得。
 */
/** A4 纸宽（px），与物料层的字号/间距体系同一坐标系 */
const PAPER_WIDTH = 794
/** A4 纸高（px）：内容不足时也保持整页高度，模板要完整展示出来 */
const PAPER_HEIGHT = 1123

const store = useResumeStore()
const resume = computed(() => store.current)

const paperScale = ref(1)
const contentHeight = ref(PAPER_HEIGHT)
const showTemplatePicker = ref(false)
const showStyleEditor = ref(false)

/** 样式编辑器的本地调整：'' / null 表示跟随模板默认 */
const themeColor = ref('')
const fontFamilyOverride = ref<string | null>(null)
const titleStyleOverride = ref<TitleStyle | null>(null)
const fontScale = ref(1)
const lineScale = ref(1)
const bold = ref(false)

const activeThemeColor = computed(() => resume.value?.GLOBAL_STYLE.themeColor || '')
const activeFontFamily = computed(() => resume.value?.GLOBAL_STYLE.fontFamily || '')
const activeTitleStyle = computed(() => resume.value?.GLOBAL_STYLE.titleStyle)
const activeBold = computed(() => (resume.value?.GLOBAL_STYLE.textFontWeight || 400) > 400)
/** 缩放后的纸张高度，用来撑开外层占位，避免缩放留下大片空白 */
const frameHeight = computed(() => contentHeight.value * paperScale.value)
const paperVars = computed(() => ({ transform: `scale(${paperScale.value})` }))

/** 模板基线样式：DEFAULT_GLOBAL_STYLE 叠加模板的覆盖值 */
const templateBase = computed<IGlobalStyle>(() => ({
  ...DEFAULT_GLOBAL_STYLE,
  ...getTemplate(resume.value?.templateId || '').style,
}))

onLoad((query) => {
  const id = query?.id ? String(query.id) : ''
  if (id)
    store.loadResume(id)
})

onShow(() => {
  syncPaperScale()
  nextTick(() => setTimeout(measurePaper, 60))
})

/** 按窗口宽度算纸张缩放比，保证 A4 整页横向放得下 */
function syncPaperScale() {
  const width = uni.getSystemInfoSync().windowWidth || PAPER_WIDTH
  paperScale.value = Math.min(1, Math.max(0.35, (width - 28) / PAPER_WIDTH))
}

/** 量一次未缩放的内容高度，内容不足 A4 时仍按 A4 撑高 */
function measurePaper() {
  uni.createSelectorQuery()
    .select('#resumePaper')
    .boundingClientRect((rect) => {
      const info = Array.isArray(rect) ? rect[0] : rect
      if (info && info.height)
        contentHeight.value = Math.max(PAPER_HEIGHT, info.height / paperScale.value)
    })
    .exec()
}

function refresh() {
  nextTick(() => setTimeout(measurePaper, 60))
}

/** 由模板基线 + 编辑器调整拼出一份 GLOBAL_STYLE */
function buildStyle(): IGlobalStyle {
  const next: IGlobalStyle = { ...templateBase.value }
  if (themeColor.value)
    next.themeColor = themeColor.value
  if (fontFamilyOverride.value !== null)
    next.fontFamily = fontFamilyOverride.value
  if (titleStyleOverride.value)
    next.titleStyle = titleStyleOverride.value
  if (bold.value) {
    next.titleFontWeight = 700
    next.textFontWeight = 500
  }
  return scaleLineHeight(scaleGlobalStyle(next, fontScale.value), lineScale.value)
}

/** 写回 store：GLOBAL_STYLE 一变，所有模块的样式 token 跟着重算 */
function commitStyle() {
  store.setGlobalStyle(buildStyle())
  refresh()
}

function resetOverrides() {
  themeColor.value = ''
  fontFamilyOverride.value = null
  titleStyleOverride.value = null
  fontScale.value = 1
  lineScale.value = 1
  bold.value = false
}

function switchTemplate(id: string) {
  store.applyTemplate(id)
  showTemplatePicker.value = false
  resetOverrides()
  refresh()
}

function setThemeColor(color: string) {
  themeColor.value = color
  commitStyle()
}

function setFontScale(value: number) {
  fontScale.value = value
  commitStyle()
}

function applyLineScale(value: number) {
  lineScale.value = value
  commitStyle()
}

function setFontFamily(value: string) {
  fontFamilyOverride.value = value
  commitStyle()
}

function setTitleStyle(value: TitleStyle) {
  titleStyleOverride.value = value
  commitStyle()
}

function setBold(value: boolean) {
  bold.value = value
  commitStyle()
}

function resetStyle() {
  resetOverrides()
  commitStyle()
}

function exportPdf() {
  // #ifdef H5
  window.print()
  // #endif
  // #ifndef H5
  uni.showToast({ title: '请在浏览器中打开后打印导出', icon: 'none' })
  // #endif
}
</script>

<template>
  <view class="page">
    <view v-if="resume" class="scroll">
      <view class="paper-frame" :style="{ height: `${frameHeight}px` }">
        <view id="resumePaper" class="paper" :style="paperVars">
          <ResumeRenderer :json="resume" />
        </view>
      </view>
    </view>
    <view v-else class="empty">
      暂无可预览内容
    </view>
    <view v-if="resume" class="actions">
      <button class="export secondary" @click="showTemplatePicker = true">
        更换模板
      </button>
      <button class="export secondary" @click="showStyleEditor = true">
        编辑样式
      </button>
      <button class="export" @click="exportPdf">
        导出 PDF
      </button>
    </view>
    <view v-if="showStyleEditor" class="mask" @click="showStyleEditor = false">
      <view class="picker style-picker" @click.stop>
        <text class="picker-title">编辑样式</text>
        <text class="style-label">主题颜色</text>
        <view class="color-row">
          <view class="color-dot color-default" :class="{ active: !themeColor }" @click="setThemeColor('')" />
          <view
            v-for="c in styleThemeColors"
            :key="c"
            class="color-dot"
            :class="{ active: activeThemeColor === c }"
            :style="{ background: c }"
            @click="setThemeColor(c)"
          />
        </view>
        <text class="style-hint">默认色跟随当前模板的主题配色</text>
        <text class="style-label">字体大小</text>
        <view class="font-row">
          <view
            v-for="opt in fontScaleOptions"
            :key="opt.value"
            class="font-item"
            :class="{ active: fontScale === opt.value }"
            @click="setFontScale(opt.value)"
          >
            {{ opt.label }}
          </view>
        </view>
        <text class="style-label">行距</text>
        <view class="font-row">
          <view
            v-for="opt in lineScaleOptions"
            :key="opt.value"
            class="font-item"
            :class="{ active: lineScale === opt.value }"
            @click="applyLineScale(opt.value)"
          >
            {{ opt.label }}
          </view>
        </view>
        <text class="style-label">字体</text>
        <view class="font-row">
          <view
            v-for="opt in fontFamilyOptions"
            :key="opt.label"
            class="font-item"
            :class="{ active: activeFontFamily === opt.value }"
            @click="setFontFamily(opt.value)"
          >
            {{ opt.label }}
          </view>
        </view>
        <text class="style-label">字重</text>
        <view class="font-row">
          <view class="font-item" :class="{ active: !activeBold }" @click="setBold(false)">
            常规
          </view>
          <view class="font-item" :class="{ active: activeBold }" @click="setBold(true)">
            加粗
          </view>
        </view>
        <text class="style-label">标题样式</text>
        <view class="font-row wrap">
          <view
            v-for="opt in titleStyleOptions"
            :key="opt.value"
            class="font-item"
            :class="{ active: activeTitleStyle === opt.value }"
            @click="setTitleStyle(opt.value)"
          >
            {{ opt.label }}
          </view>
        </view>
        <text class="style-hint">衬线/等宽与加粗在部分设备上可能跟随系统字体回退</text>
        <button class="reset-btn" @click="resetStyle">
          恢复默认样式
        </button>
      </view>
    </view>
    <view v-if="showTemplatePicker" class="mask" @click="showTemplatePicker = false">
      <view class="picker" @click.stop>
        <text class="picker-title">选择模板</text>
        <view class="picker-grid">
          <view
            v-for="t in TEMPLATES"
            :key="t.id"
            class="picker-item"
            :class="{ active: t.id === resume?.templateId }"
            @click="switchTemplate(t.id)"
          >
            <image :src="t.cover" mode="aspectFit" class="picker-cover" />
            <text class="picker-name">{{ t.name }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 16px 14px 82px;
  background: #000;
  box-sizing: border-box;
}
.paper-frame {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.paper {
  position: absolute;
  top: 0;
  left: 50%;
  width: 794px;
  min-height: 1123px;
  box-sizing: border-box;
  margin-left: -397px;
  transform-origin: top center;
  background: #fff;
}
/* 内容不足一页时，让渲染容器也撑满 A4，两栏底色才能铺到纸张底边 */
.paper :deep(.rs-page) {
  display: flex;
  flex-direction: column;
  min-height: 1123px;
}
.paper :deep(.rs-page__main),
.paper :deep(.rs-page__columns) {
  flex: 1;
}
.export {
  flex: 1;
  height: 46px;
  border-radius: 23px;
  background: #2563eb;
  color: #fff;
  line-height: 46px;
  font-size: 15px;
}
.actions {
  position: fixed;
  right: 20px;
  bottom: 18px;
  left: 20px;
  display: flex;
  gap: 12px;
}
.export.secondary {
  background: #fff;
  color: #2563eb;
  border: 1px solid #2563eb;
}
.mask {
  position: fixed;
  inset: 0;
  z-index: 10;
  background: rgb(15 23 42 / 45%);
}
.picker {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px 16px 32px;
  background: #fff;
  border-radius: 20px 20px 0 0;
}
.picker-title {
  display: block;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 700;
  color: #172033;
}
.picker-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  max-height: 52vh;
  overflow-y: auto;
}
.picker-item {
  width: calc(50% - 7px);
  padding: 10px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  box-sizing: border-box;
  background: #f8fafc;
}
.picker-item.active {
  border-color: #2563eb;
}
.picker-cover {
  width: 100%;
  height: 150px;
  background: #e8f0ff;
  border-radius: 8px;
}
.picker-name {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  color: #334155;
  text-align: center;
}
.empty {
  padding-top: 120px;
  color: #94a3b8;
  text-align: center;
}
.style-label {
  display: block;
  margin: 18px 2px 10px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}
.style-picker {
  max-height: 74vh;
  overflow-y: auto;
}
.color-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
}
.color-dot {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid transparent;
  box-sizing: border-box;
}
.color-dot.active {
  border-color: #172033;
  box-shadow: inset 0 0 0 2px #fff;
}
.color-default {
  background: linear-gradient(135deg, #e2e8f0 50%, #64748b 50%);
}
.style-hint {
  display: block;
  margin: 10px 2px 0;
  font-size: 12px;
  color: #94a3b8;
}
.font-row {
  display: flex;
  gap: 10px;
}
.font-row.wrap {
  flex-wrap: wrap;
}
.font-item {
  flex: 1;
  height: 38px;
  line-height: 34px;
  text-align: center;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  color: #334155;
  background: #f8fafc;
  box-sizing: border-box;
}
.font-row.wrap .font-item {
  flex: none;
  min-width: calc(25% - 8px);
  padding: 0 8px;
  box-sizing: border-box;
}
.font-item.active {
  border-color: #2563eb;
  color: #2563eb;
  background: #eff6ff;
}
.reset-btn {
  margin-top: 24px;
  height: 42px;
  line-height: 42px;
  border-radius: 21px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 14px;
}

/* 打印：只留纸张本体，去掉缩放与操作栏，一页 A4 直接输出 */
@media print {
  .page {
    padding: 0;
    background: #fff;
  }
  .paper-frame {
    height: auto !important;
    overflow: visible;
  }
  .paper {
    position: static;
    width: 100%;
    margin: 0;
    box-shadow: none;
    transform: none !important;
  }
  .actions,
  .mask {
    display: none !important;
  }
}
@page {
  size: A4;
  margin: 0;
}
</style>
