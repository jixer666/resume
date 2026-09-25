<script lang="ts" setup>
import type IGlobalStyle from '@/interface/globalStyle'
import { useResumeStore } from '@/store/resume'
import { pxTonumber } from '@/utils/common'

/**
 * 全局样式面板：主题色 / 标题与正文颜色 / 字号 / 字重 / 间距。
 *
 * 每一项改动都立刻经 store.updateGlobalStyle 扇出到所有模块（无「保存」按钮，与编辑页一致），
 * 面板只改样式，不碰业务数据。
 *
 * 刻意不提供的项：
 * - `fontFamily`：小程序端没有可用的 webfont，写了也白写；
 * - `leftWidth / leftThemeColor / rightThemeColor`：左右分栏布局当前只有经典单栏，先留空；
 * - `themeColor` 只给固定色板，不做取色器（mp 无 input type=color）。
 * 以上均已在任务文档登记为偏差。
 */
defineOptions({ name: 'GlobalStyleSheet' })

defineProps<{
  /** 是否展示 */
  visible: boolean
}>()
const emit = defineEmits<{ close: [] }>()

const store = useResumeStore()
/** 当前简历的全局样式（`GLOBAL_STYLE` 在 schema 里是宽松类型，这里收紧成 IGlobalStyle 的部分字段） */
const globalStyle = computed<Partial<IGlobalStyle>>(() => (store.current?.GLOBAL_STYLE || {}) as Partial<IGlobalStyle>)

/** 主题色色板：覆盖物料里出现过的主题色，保证换肤后仍能点回接近的色 */
const THEME_COLORS = ['#079cfa', '#0b70bd', '#254665', '#333333', '#da180f', '#000000']
/** 文字色板：标题与正文共用 */
const TEXT_COLORS = ['#121c26', '#333333', '#666666', '#757575', '#8c8c8c', '#b0b0b0']
/** 字号档位：与 resume-design 的 useFontSizeList 对齐（10px 起、步长 2px、到 60px） */
const FONT_SIZES = Array.from({ length: 26 }, (_, index) => `${10 + index * 2}px`)
/** 字重档位：font-weight 标准 9 档；picker 的 range 只吃字符串，故另存一份 */
const FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900]
const WEIGHT_RANGE = FONT_WEIGHTS.map(String)

type TFontSizeKey = 'firstTitleFontSize' | 'secondTitleFontSize' | 'textFontSize'
type TWeightKey = 'secondTitleWeight' | 'textFontWeight'
type TSpacingKey = 'pTop' | 'pBottom' | 'pLeftRight' | 'modelMarginTop' | 'modelMarginBottom'

const FONT_SIZE_ITEMS: { key: TFontSizeKey, label: string }[] = [
  { key: 'firstTitleFontSize', label: '一级标题' },
  { key: 'secondTitleFontSize', label: '二级标题' },
  { key: 'textFontSize', label: '正文' },
]

const WEIGHT_ITEMS: { key: TWeightKey, label: string }[] = [
  { key: 'secondTitleWeight', label: '标题字重' },
  { key: 'textFontWeight', label: '正文字重' },
]

/**
 * 间距档位。
 * 内边距最小值取 0 —— 负的 padding 是无效 CSS，写了不会生效，不如不给；
 * 外边距允许负值，用来把模块之间压紧（resume-design 的滑块是 -300 ~ 300，这里收敛到实用区间）。
 */
const SPACING_ITEMS: { key: TSpacingKey, label: string, min: number, max: number }[] = [
  { key: 'pTop', label: '模块上内边距', min: 0, max: 60 },
  { key: 'pBottom', label: '模块下内边距', min: 0, max: 60 },
  { key: 'pLeftRight', label: '模块左右内边距', min: 0, max: 60 },
  { key: 'modelMarginTop', label: '模块上间距', min: -40, max: 80 },
  { key: 'modelMarginBottom', label: '模块下间距', min: -40, max: 120 },
]

function fontSizeIndex(value?: string): number {
  const index = FONT_SIZES.indexOf(String(value || ''))
  return index >= 0 ? index : 0
}

function weightIndex(value?: number): number {
  const index = FONT_WEIGHTS.indexOf(Number(value))
  return index >= 0 ? index : 4
}

function pickTheme(color: string) {
  store.updateGlobalStyle({ themeColor: color })
}

function pickTitleColor(color: string) {
  store.updateGlobalStyle({ secondTitleColor: color })
}

function pickTextColor(color: string) {
  store.updateGlobalStyle({ textFontColor: color })
}

function onFontSizeChange(key: TFontSizeKey, e: { detail: { value: number | string } }) {
  const patch: Partial<IGlobalStyle> = {}
  patch[key] = FONT_SIZES[Number(e.detail.value)] || FONT_SIZES[0]
  store.updateGlobalStyle(patch)
}

function onWeightChange(key: TWeightKey, e: { detail: { value: number | string } }) {
  const patch: Partial<IGlobalStyle> = {}
  patch[key] = FONT_WEIGHTS[Number(e.detail.value)] || FONT_WEIGHTS[4]
  store.updateGlobalStyle(patch)
}

/** 滑块只监听 `@change`（松手触发）：`@changing` 每个 tick 都会写一次 store 与本地存储，没必要 */
function onSpacingChange(key: TSpacingKey, e: { detail: { value: number | string } }) {
  const patch: Partial<IGlobalStyle> = {}
  patch[key] = `${Number(e.detail.value)}px`
  store.updateGlobalStyle(patch)
}

function close() {
  emit('close')
}
</script>

<template>
  <view v-if="visible" class="mask" @click="close">
    <view class="sheet sheet--tall" @click.stop>
      <text class="sheet-title">全局样式</text>
      <text class="sheet-sub">改动立即作用于全部模块</text>

      <scroll-view scroll-y class="sheet-scroll sheet-scroll--tall">
        <text class="sheet-label">主题色</text>
        <view class="swatches">
          <view
            v-for="color in THEME_COLORS"
            :key="color"
            class="swatch"
            :class="{ 'swatch--on': globalStyle.themeColor === color }"
            :style="{ backgroundColor: color }"
            @click="pickTheme(color)"
          />
        </view>

        <text class="sheet-label">标题颜色</text>
        <view class="swatches">
          <view
            v-for="color in TEXT_COLORS"
            :key="color"
            class="swatch"
            :class="{ 'swatch--on': globalStyle.secondTitleColor === color }"
            :style="{ backgroundColor: color }"
            @click="pickTitleColor(color)"
          />
        </view>

        <text class="sheet-label">正文颜色</text>
        <view class="swatches">
          <view
            v-for="color in TEXT_COLORS"
            :key="color"
            class="swatch"
            :class="{ 'swatch--on': globalStyle.textFontColor === color }"
            :style="{ backgroundColor: color }"
            @click="pickTextColor(color)"
          />
        </view>

        <text class="sheet-label">字号</text>
        <view v-for="one in FONT_SIZE_ITEMS" :key="one.key" class="opt-row">
          <text class="opt-name">{{ one.label }}</text>
          <picker
            :range="FONT_SIZES"
            :value="fontSizeIndex(globalStyle[one.key])"
            @change="onFontSizeChange(one.key, $event)"
          >
            <view class="opt-value">
              <text>{{ globalStyle[one.key] || '默认' }}</text>
              <text class="opt-arrow">›</text>
            </view>
          </picker>
        </view>

        <text class="sheet-label">字重</text>
        <view v-for="one in WEIGHT_ITEMS" :key="one.key" class="opt-row">
          <text class="opt-name">{{ one.label }}</text>
          <picker
            :range="WEIGHT_RANGE"
            :value="weightIndex(globalStyle[one.key])"
            @change="onWeightChange(one.key, $event)"
          >
            <view class="opt-value">
              <text>{{ globalStyle[one.key] || '默认' }}</text>
              <text class="opt-arrow">›</text>
            </view>
          </picker>
        </view>

        <text class="sheet-label">间距</text>
        <view v-for="one in SPACING_ITEMS" :key="one.key" class="slider-row">
          <view class="slider-head">
            <text class="opt-name">{{ one.label }}</text>
            <text class="slider-value">{{ pxTonumber(globalStyle[one.key]) }}px</text>
          </view>
          <slider
            class="slider"
            :min="one.min"
            :max="one.max"
            :step="1"
            :value="pxTonumber(globalStyle[one.key])"
            active-color="#0957de"
            :block-size="18"
            @change="onSpacingChange(one.key, $event)"
          />
        </view>
      </scroll-view>

      <view class="sheet-cancel" hover-class="sheet-cancel--press" @click="close">
        完成
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import '../style/editor-sheet.scss';

.swatches {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.swatch {
  box-sizing: border-box;
  width: 34px;
  height: 34px;
  margin: 0 10px 10px 0;
  border: 1px solid #e2e8f0;
  border-radius: 17px;
}

.swatch--on {
  box-shadow: 0 0 0 2px var(--wot-color-theme, #0957de);
}

.opt-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 46px;
  margin-top: 10px;
  padding: 0 14px;
  border-radius: 12px;
  background-color: #f8fafc;
}

.opt-name {
  color: #596273;
  font-size: 13px;
}

.opt-value {
  display: flex;
  align-items: center;
  color: #172b4d;
  font-size: 13px;
}

.opt-arrow {
  margin-left: 6px;
  color: #c0c9d6;
  font-size: 16px;
}

.slider-row {
  margin-top: 12px;
}

.slider-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.slider-value {
  color: #172b4d;
  font-size: 12px;
}

.slider {
  margin: 4px 0 0;
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
