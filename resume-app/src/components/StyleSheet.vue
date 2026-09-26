<script lang="ts" setup>
import type IGlobalStyle from '@/interface/globalStyle'
import type { IMATERIALITEM } from '@/interface/material'
import type IMODELSTYLE from '@/interface/modelStyle'
import MODEL_DATA_JSON from '@/schema/modelData'
import { useResumeStore } from '@/store/resume'
import { pxTonumber } from '@/utils/common'
import { FONT_SIZES, FONT_WEIGHTS, fontSizeIndex, TEXT_COLORS, THEME_COLORS, WEIGHT_RANGE, weightIndex } from '@/utils/styleOptions'

/**
 * 样式面板：一个弹层里分两栏 —— 「全局样式」与「组件样式」。
 *
 * - 全局样式：改动经 store.updateGlobalStyle 无条件扇出到所有模块（原 GlobalStyleSheet）；
 * - 组件样式：先选模块，改动只经 store.updateModuleStyle 落到该模块的 style（原 ModuleStyleSheet），
 *   并额外提供两个模块专属项：头像尺寸（仅基本资料）、正文左缩进（含富文本正文的模块）。
 *
 * `showModuleTab=false` 时只有全局样式一栏（编辑页的「全局样式」入口用它）。
 * 两栏共用同一套控件外观，样式在 style/editor-sheet.scss 里。
 */
defineOptions({ name: 'StyleSheet' })

const props = withDefaults(defineProps<{
  /** 是否展示 */
  visible: boolean
  /** 是否提供「组件样式」分栏 */
  showModuleTab?: boolean
  /** 打开时直接定位到某个模块（传了就默认落在组件样式栏） */
  moduleKeyId?: string
}>(), {
  showModuleTab: true,
  moduleKeyId: '',
})
const emit = defineEmits<{ close: [] }>()

const store = useResumeStore()

/** 当前分栏 */
const tab = ref<'global' | 'module'>('global')
/** 组件样式栏当前改的是哪个模块 */
const activeKeyId = ref('')

/** 可选模块：预览里没渲染的（模块管理里关掉的）不列出来，避免改了看不到效果 */
const modules = computed<IMATERIALITEM[]>(() => (store.current?.COMPONENTS || []).filter(item => item.show !== false))
const activeItem = computed(() => modules.value.find(item => item.keyId === activeKeyId.value))
/** 当前模块编码，用来决定展示哪些模块专属字段 */
const model = computed(() => activeItem.value?.model || '')
/** 当前模块的样式覆盖值（模块 style 就是全局扇出后的结果，读到的即生效值） */
const moduleStyle = computed<Partial<IMODELSTYLE>>(() => (activeItem.value?.style || {}) as Partial<IMODELSTYLE>)
/** 当前简历的全局样式 */
const globalStyle = computed<Partial<IGlobalStyle>>(() => (store.current?.GLOBAL_STYLE || {}) as Partial<IGlobalStyle>)

/** 基本资料才有头像尺寸 */
const isBaseInfo = computed(() => model.value === 'BASE_INFO')
/** 可添加多条目的模块才有「列表项间距」 */
const LIST_MODELS = ['EDU_BACKGROUND', 'WORK_EXPERIENCE', 'PROJECT_EXPERIENCE', 'INTERNSHIP_EXPERIENCE', 'CAMPUS_EXPERIENCE', 'AWARDS', 'WORKS_DISPLAY']
const isListModule = computed(() => LIST_MODELS.includes(model.value))
/** 含富文本正文的模块才有「正文左缩进」（对应 RichTextView 的 contentPaddingLeft） */
const RICH_CONTENT_MODELS = ['BASE_INFO', 'EDU_BACKGROUND', 'SKILL_SPECIALTIES', 'SELF_EVALUATION', 'HOBBIES', 'CAMPUS_EXPERIENCE', 'INTERNSHIP_EXPERIENCE', 'WORK_EXPERIENCE', 'PROJECT_EXPERIENCE']
const hasRichContent = computed(() => RICH_CONTENT_MODELS.includes(model.value))

/** 每次打开都重置到入口期望的栏位与模块 */
watch(() => props.visible, (visible) => {
  if (!visible)
    return
  tab.value = props.showModuleTab && props.moduleKeyId ? 'module' : 'global'
  activeKeyId.value = props.moduleKeyId || modules.value[0]?.keyId || ''
})

/** 模块标题：优先取数据里的 title，再退回模块默认名（与编辑页一致） */
function moduleTitle(item: IMATERIALITEM): string {
  const title = (item.data as { title?: string } | undefined)?.title
  return String(title || MODEL_DATA_JSON[item.model]?.title || item.cptTitle || '模块')
}

type TGlobalFontSizeKey = 'firstTitleFontSize' | 'secondTitleFontSize' | 'textFontSize'
type TGlobalWeightKey = 'secondTitleWeight' | 'textFontWeight'
type TGlobalSpacingKey = 'pTop' | 'pBottom' | 'pLeftRight' | 'modelMarginTop' | 'modelMarginBottom'
type TModuleFontSizeKey = 'firstTitleFontSize' | 'titleFontSize' | 'textFontSize'
type TModuleWeightKey = 'titleFontWeight' | 'textFontWeight'
type TModuleSpacingKey = 'pTop' | 'pBottom' | 'pLeftRight' | 'mTop' | 'mBottom'
type TSizeKey = 'avatarWidth' | 'avatarHeight' | 'contentPaddingLeft' | 'entryMarginBottom'

/**
 * 每项都带 `hint`：面板里光写「一级标题 / 二级标题」没人知道指的是哪块文字，
 * 给出「例如」让用户对着简历一一对上（hint 只在面板展示，不落库）。
 */
const GLOBAL_FONT_SIZE_ITEMS: { key: TGlobalFontSizeKey, label: string, hint: string }[] = [
  { key: 'firstTitleFontSize', label: '一级标题', hint: '如简历标题、模块小标题' },
  { key: 'secondTitleFontSize', label: '二级标题', hint: '如公司名、学校名、姓名' },
  { key: 'textFontSize', label: '正文', hint: '如工作内容、自我评价' },
]

const GLOBAL_WEIGHT_ITEMS: { key: TGlobalWeightKey, label: string, hint: string }[] = [
  { key: 'secondTitleWeight', label: '标题字重', hint: '如600 为半粗、700 更醒目' },
  { key: 'textFontWeight', label: '正文字重', hint: '如400 常规、300 更细淡' },
]

/** 间距档位：内边距最小值取 0（负 padding 无效），外边距允许负值用来压紧模块 */
const GLOBAL_SPACING_ITEMS: { key: TGlobalSpacingKey, label: string, hint: string, min: number, max: number }[] = [
  { key: 'pTop', label: '模块上内边距', hint: '', min: 0, max: 60 },
  { key: 'pBottom', label: '模块下内边距', hint: '', min: 0, max: 60 },
  { key: 'pLeftRight', label: '模块左右内边距', hint: '', min: 0, max: 60 },
  { key: 'modelMarginTop', label: '模块上间距', hint: '', min: -40, max: 80 },
  { key: 'modelMarginBottom', label: '模块下间距', hint: '', min: -40, max: 120 },
]

const MODULE_FONT_SIZE_ITEMS: { key: TModuleFontSizeKey, label: string, hint: string }[] = [
  { key: 'firstTitleFontSize', label: '一级标题', hint: '如模块小标题' },
  { key: 'titleFontSize', label: '二级标题', hint: '如公司名、姓名' },
  { key: 'textFontSize', label: '正文', hint: '如工作内容、自我评价' },
]

const MODULE_WEIGHT_ITEMS: { key: TModuleWeightKey, label: string, hint: string }[] = [
  { key: 'titleFontWeight', label: '标题字重', hint: '如600 为半粗、700 更醒目' },
  { key: 'textFontWeight', label: '正文字重', hint: '如400 常规、300 更细淡' },
]

const MODULE_SPACING_ITEMS: { key: TModuleSpacingKey, label: string, hint: string, min: number, max: number }[] = [
  { key: 'pTop', label: '模块上内边距', hint: '', min: 0, max: 60 },
  { key: 'pBottom', label: '模块下内边距', hint: '', min: 0, max: 60 },
  { key: 'pLeftRight', label: '模块左右内边距', hint: '', min: 0, max: 60 },
  { key: 'mTop', label: '模块上间距', hint: '', min: -40, max: 80 },
  { key: 'mBottom', label: '模块下间距', hint: '', min: -40, max: 120 },
]

/** 头像尺寸：未设置时滑块从皮肤常见尺寸起步，改动后才写入模块 style */
const AVATAR_ITEMS: { key: TSizeKey, label: string, hint: string, min: number, max: number, fallback: number }[] = [
  { key: 'avatarWidth', label: '头像宽度', hint: '', min: 40, max: 300, fallback: 115 },
  { key: 'avatarHeight', label: '头像高度', hint: '', min: 40, max: 400, fallback: 145 },
]

const CONTENT_INDENT_ITEM: { key: TSizeKey, label: string, hint: string, min: number, max: number, fallback: number }
  = { key: 'contentPaddingLeft', label: '正文左缩进', hint: '', min: 0, max: 60, fallback: 0 }

/** 列表项间距：未设置时滑块从各皮肤常见值起步，改动后才写入模块 style（各皮肤用 var 兜底） */
const ENTRY_GAP_ITEM: { key: TSizeKey, label: string, hint: string, min: number, max: number, fallback: number }
  = { key: 'entryMarginBottom', label: '条目间距', hint: '', min: 0, max: 80, fallback: 20 }

function pickGlobalTheme(color: string) {
  store.updateGlobalStyle({ themeColor: color })
}

function patchModule(next: Partial<IMODELSTYLE>) {
  if (activeKeyId.value)
    store.updateModuleStyle(activeKeyId.value, next)
}

function pickModuleTheme(color: string) {
  patchModule({ themeColor: color })
}

function pickGlobalTitleColor(color: string) {
  store.updateGlobalStyle({ secondTitleColor: color })
}

function pickGlobalTextColor(color: string) {
  store.updateGlobalStyle({ textFontColor: color })
}

function pickModuleTitleColor(color: string) {
  patchModule({ titleColor: color })
}

function pickModuleTextColor(color: string) {
  patchModule({ textColor: color })
}

function onGlobalFontSizeChange(key: TGlobalFontSizeKey, e: { detail: { value: number | string } }) {
  const patch: Partial<IGlobalStyle> = {}
  patch[key] = FONT_SIZES[Number(e.detail.value)] || FONT_SIZES[0]
  store.updateGlobalStyle(patch)
}

function onGlobalWeightChange(key: TGlobalWeightKey, e: { detail: { value: number | string } }) {
  const patch: Partial<IGlobalStyle> = {}
  patch[key] = FONT_WEIGHTS[Number(e.detail.value)] || FONT_WEIGHTS[4]
  store.updateGlobalStyle(patch)
}

/** 滑块只监听 `@change`（松手触发），避免每个 tick 都写一次 store 与本地存储 */
function onGlobalSpacingChange(key: TGlobalSpacingKey, e: { detail: { value: number | string } }) {
  const patch: Partial<IGlobalStyle> = {}
  patch[key] = `${Number(e.detail.value)}px`
  store.updateGlobalStyle(patch)
}

function onModuleFontSizeChange(key: TModuleFontSizeKey, e: { detail: { value: number | string } }) {
  patchModule({ [key]: FONT_SIZES[Number(e.detail.value)] || FONT_SIZES[0] } as Partial<IMODELSTYLE>)
}

function onModuleWeightChange(key: TModuleWeightKey, e: { detail: { value: number | string } }) {
  patchModule({ [key]: FONT_WEIGHTS[Number(e.detail.value)] || FONT_WEIGHTS[4] } as Partial<IMODELSTYLE>)
}

function onModuleSpacingChange(key: TModuleSpacingKey, e: { detail: { value: number | string } }) {
  patchModule({ [key]: `${Number(e.detail.value)}px` } as Partial<IMODELSTYLE>)
}

function onSizeChange(key: TSizeKey, e: { detail: { value: number | string } }) {
  patchModule({ [key]: `${Number(e.detail.value)}px` } as Partial<IMODELSTYLE>)
}

/** 滑块当前值：没设过就用手给的起步值，避免滑块停在 0 */
function sizeSliderValue(key: TSizeKey, fallback: number): number {
  return pxTonumber(moduleStyle.value[key]) || fallback
}

function close() {
  emit('close')
}
</script>

<template>
  <view v-if="visible" class="mask" @click="close">
    <view class="sheet sheet--tall" @click.stop>
      <text class="sheet-title">{{ showModuleTab ? '样式' : '全局样式' }}</text>

      <view v-if="showModuleTab" class="sheet-tabs">
        <view
          class="sheet-tab"
          :class="{ 'sheet-tab--on': tab === 'global' }"
          hover-class="sheet-tab--press"
          @click="tab = 'global'"
        >
          <text>全局样式</text>
        </view>
        <view
          class="sheet-tab"
          :class="{ 'sheet-tab--on': tab === 'module' }"
          hover-class="sheet-tab--press"
          @click="tab = 'module'"
        >
          <text>组件样式</text>
        </view>
      </view>

      <scroll-view v-if="tab === 'module'" scroll-x class="mod-picker">
        <view
          v-for="item in modules"
          :key="item.keyId"
          class="mod-chip"
          :class="{ 'mod-chip--on': item.keyId === activeKeyId }"
          hover-class="mod-chip--press"
          @click="activeKeyId = item.keyId"
        >
          <text>{{ moduleTitle(item) }}</text>
        </view>
      </scroll-view>

      <scroll-view scroll-y class="sheet-scroll sheet-scroll--tall">
        <template v-if="tab === 'global'">
          <text class="sheet-label">主题色</text>
          <text class="sheet-hint">标题栏、图标、装饰线等的主色</text>
          <view class="swatches">
            <view
              v-for="color in THEME_COLORS"
              :key="color"
              class="swatch"
              :class="{ 'swatch--on': globalStyle.themeColor === color }"
              :style="{ backgroundColor: color }"
              @click="pickGlobalTheme(color)"
            />
          </view>

          <text class="sheet-label">标题颜色</text>
          <text class="sheet-hint">二级标题颜色，如公司名、职位、学校名</text>
          <view class="swatches">
            <view
              v-for="color in TEXT_COLORS"
              :key="color"
              class="swatch"
              :class="{ 'swatch--on': globalStyle.secondTitleColor === color }"
              :style="{ backgroundColor: color }"
              @click="pickGlobalTitleColor(color)"
            />
          </view>

          <text class="sheet-label">正文颜色</text>
          <text class="sheet-hint">正文描述文字的颜色，如工作内容、自我评价</text>
          <view class="swatches">
            <view
              v-for="color in TEXT_COLORS"
              :key="color"
              class="swatch"
              :class="{ 'swatch--on': globalStyle.textFontColor === color }"
              :style="{ backgroundColor: color }"
              @click="pickGlobalTextColor(color)"
            />
          </view>

          <text class="sheet-label">字号</text>
          <view v-for="one in GLOBAL_FONT_SIZE_ITEMS" :key="one.key" class="opt-row">
            <view class="opt-name">
              <text class="opt-label">{{ one.label }}</text>
              <text class="opt-hint">{{ one.hint }}</text>
            </view>
            <picker
              :range="FONT_SIZES"
              :value="fontSizeIndex(globalStyle[one.key])"
              @change="onGlobalFontSizeChange(one.key, $event)"
            >
              <view class="opt-value">
                <text>{{ globalStyle[one.key] || '默认' }}</text>
                <text class="opt-arrow">›</text>
              </view>
            </picker>
          </view>

          <text class="sheet-label">字重</text>
          <view v-for="one in GLOBAL_WEIGHT_ITEMS" :key="one.key" class="opt-row">
            <view class="opt-name">
              <text class="opt-label">{{ one.label }}</text>
              <text class="opt-hint">{{ one.hint }}</text>
            </view>
            <picker
              :range="WEIGHT_RANGE"
              :value="weightIndex(globalStyle[one.key])"
              @change="onGlobalWeightChange(one.key, $event)"
            >
              <view class="opt-value">
                <text>{{ globalStyle[one.key] || '默认' }}</text>
                <text class="opt-arrow">›</text>
              </view>
            </picker>
          </view>

          <text class="sheet-label">间距</text>
          <view v-for="one in GLOBAL_SPACING_ITEMS" :key="one.key" class="slider-row">
            <view class="slider-head">
              <view class="opt-name">
                <text class="opt-label">{{ one.label }}</text>
                <text class="opt-hint">{{ one.hint }}</text>
              </view>
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
              @change="onGlobalSpacingChange(one.key, $event)"
            />
          </view>
        </template>

        <template v-else-if="activeItem">
          <text class="sheet-label">主题色</text>
          <text class="sheet-hint">本模块标题栏、图标、装饰线的主色</text>
          <view class="swatches">
            <view
              v-for="color in THEME_COLORS"
              :key="color"
              class="swatch"
              :class="{ 'swatch--on': moduleStyle.themeColor === color }"
              :style="{ backgroundColor: color }"
              @click="pickModuleTheme(color)"
            />
          </view>

          <text class="sheet-label">标题颜色</text>
          <text class="sheet-hint">本模块二级标题颜色，如公司名、职位</text>
          <view class="swatches">
            <view
              v-for="color in TEXT_COLORS"
              :key="color"
              class="swatch"
              :class="{ 'swatch--on': moduleStyle.titleColor === color }"
              :style="{ backgroundColor: color }"
              @click="pickModuleTitleColor(color)"
            />
          </view>

          <text class="sheet-label">正文颜色</text>
          <text class="sheet-hint">本模块正文描述文字的颜色</text>
          <view class="swatches">
            <view
              v-for="color in TEXT_COLORS"
              :key="color"
              class="swatch"
              :class="{ 'swatch--on': moduleStyle.textColor === color }"
              :style="{ backgroundColor: color }"
              @click="pickModuleTextColor(color)"
            />
          </view>

          <text class="sheet-label">字号</text>
          <view v-for="one in MODULE_FONT_SIZE_ITEMS" :key="one.key" class="opt-row">
            <view class="opt-name">
              <text class="opt-label">{{ one.label }}</text>
              <text class="opt-hint">{{ one.hint }}</text>
            </view>
            <picker
              :range="FONT_SIZES"
              :value="fontSizeIndex(moduleStyle[one.key])"
              @change="onModuleFontSizeChange(one.key, $event)"
            >
              <view class="opt-value">
                <text>{{ moduleStyle[one.key] || '默认' }}</text>
                <text class="opt-arrow">›</text>
              </view>
            </picker>
          </view>

          <text class="sheet-label">字重</text>
          <view v-for="one in MODULE_WEIGHT_ITEMS" :key="one.key" class="opt-row">
            <view class="opt-name">
              <text class="opt-label">{{ one.label }}</text>
              <text class="opt-hint">{{ one.hint }}</text>
            </view>
            <picker
              :range="WEIGHT_RANGE"
              :value="weightIndex(moduleStyle[one.key])"
              @change="onModuleWeightChange(one.key, $event)"
            >
              <view class="opt-value">
                <text>{{ moduleStyle[one.key] || '默认' }}</text>
                <text class="opt-arrow">›</text>
              </view>
            </picker>
          </view>

          <text class="sheet-label">间距</text>
          <view v-for="one in MODULE_SPACING_ITEMS" :key="one.key" class="slider-row">
            <view class="slider-head">
              <view class="opt-name">
                <text class="opt-label">{{ one.label }}</text>
                <text class="opt-hint">{{ one.hint }}</text>
              </view>
              <text class="slider-value">{{ moduleStyle[one.key] || '默认' }}</text>
            </view>
            <slider
              class="slider"
              :min="one.min"
              :max="one.max"
              :step="1"
              :value="pxTonumber(moduleStyle[one.key]) || 0"
              active-color="#0957de"
              :block-size="18"
              @change="onModuleSpacingChange(one.key, $event)"
            />
          </view>

          <template v-if="isListModule">
            <text class="sheet-label">列表</text>
            <view class="slider-row">
              <view class="slider-head">
                <view class="opt-name">
                  <text class="opt-label">{{ ENTRY_GAP_ITEM.label }}</text>
                  <text class="opt-hint">{{ ENTRY_GAP_ITEM.hint }}</text>
                </view>
                <text class="slider-value">{{ moduleStyle.entryMarginBottom || '默认' }}</text>
              </view>
              <slider
                class="slider"
                :min="ENTRY_GAP_ITEM.min"
                :max="ENTRY_GAP_ITEM.max"
                :step="1"
                :value="sizeSliderValue(ENTRY_GAP_ITEM.key, ENTRY_GAP_ITEM.fallback)"
                active-color="#0957de"
                :block-size="18"
                @change="onSizeChange(ENTRY_GAP_ITEM.key, $event)"
              />
            </view>
          </template>

          <template v-if="isBaseInfo">
            <text class="sheet-label">头像尺寸</text>
            <view v-for="one in AVATAR_ITEMS" :key="one.key" class="slider-row">
              <view class="slider-head">
                <view class="opt-name">
                  <text class="opt-label">{{ one.label }}</text>
                  <text class="opt-hint">{{ one.hint }}</text>
                </view>
                <text class="slider-value">{{ moduleStyle[one.key] || '默认' }}</text>
              </view>
              <slider
                class="slider"
                :min="one.min"
                :max="one.max"
                :step="1"
                :value="sizeSliderValue(one.key, one.fallback)"
                active-color="#0957de"
                :block-size="18"
                @change="onSizeChange(one.key, $event)"
              />
            </view>
          </template>

          <template v-if="hasRichContent">
            <text class="sheet-label">正文</text>
            <view class="slider-row">
              <view class="slider-head">
                <view class="opt-name">
                  <text class="opt-label">{{ CONTENT_INDENT_ITEM.label }}</text>
                  <text class="opt-hint">{{ CONTENT_INDENT_ITEM.hint }}</text>
                </view>
                <text class="slider-value">{{ moduleStyle.contentPaddingLeft || '默认' }}</text>
              </view>
              <slider
                class="slider"
                :min="CONTENT_INDENT_ITEM.min"
                :max="CONTENT_INDENT_ITEM.max"
                :step="1"
                :value="sizeSliderValue(CONTENT_INDENT_ITEM.key, CONTENT_INDENT_ITEM.fallback)"
                active-color="#0957de"
                :block-size="18"
                @change="onSizeChange(CONTENT_INDENT_ITEM.key, $event)"
              />
            </view>
          </template>
        </template>

        <view v-else class="sheet-empty">
          <text>暂无可调整的模块</text>
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

.sheet-empty {
  padding: 40px 0;
  color: #94a3b8;
  font-size: 13px;
  text-align: center;
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
