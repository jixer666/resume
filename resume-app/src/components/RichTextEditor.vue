<script lang="ts" setup>
/**
 * 轻量富文本编辑器（迁移自 resume-app-temp 的 `fg-rich-editor`，见任务文档 §4.6）。
 *
 * 小程序端没有 DOM、也跑不了 wangeditor / quill 这类 DOM 编辑器，所以编辑端用 uni-app
 * 内置的 `<editor>` + 自定义工具栏，显示端走 `RichTextView`（MP 用 `rich-text`）。
 * v-model 输出 HTML 字符串，与皮肤里的 `RichTextView :html` 是同一份数据。
 *
 * 两条小程序端的坑（写在这，避免后续误改）：
 * 1. `<editor>` 是原生组件，层级永远最高 —— 盖在它上面的浮层必须用 `cover-view`；
 * 2. `setHtml` 只有小程序端有，H5 端只有 `setContents`，回填 HTML 必须分开调。
 */
defineOptions({ name: 'RichTextEditor' })

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  /** 编辑区高度（editor 不支持自动增高） */
  height?: string
}>(), {
  modelValue: '',
  placeholder: '请输入内容',
  height: '240px',
})

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

/** editor 的实例上下文，两端暴露的 API 有差异 */
interface IEditorContext {
  format: (name: string, value?: string) => void
  undo: () => void
  redo: () => void
  setHtml?: (options: { html: string }) => void
  setContents?: (options: { html?: string }) => void
}

/** 同一页面可能同时挂多个编辑器，id 加随机后缀保证选择器唯一 */
const uid = `rich-text-editor-${Math.random().toString(36).slice(2, 8)}`
const instance = getCurrentInstance()
const ctx = ref<IEditorContext | null>(null)
/** 最近一次由本组件发出的值：外部回传同值时不再重设 HTML，否则编辑时光标会跳 */
let lastValue = props.modelValue

/** 工具栏高亮状态，由 statuschange 回传 */
const formats = ref<{ bold?: boolean, italic?: boolean, underline?: boolean, list?: string }>({})

function applyHtml(html: string) {
  const context = ctx.value
  if (!context)
    return
  if (typeof context.setHtml === 'function')
    context.setHtml({ html })
  else if (typeof context.setContents === 'function')
    context.setContents({ html })
}

function onReady() {
  uni.createSelectorQuery()
    .in(instance?.proxy)
    .select(`#${uid}`)
    .context((res) => {
      ctx.value = (res as { context?: IEditorContext }).context || null
      if (lastValue)
        applyHtml(lastValue)
    })
    .exec()
}

function onInput(e: { detail: { html: string } }) {
  lastValue = e.detail.html || ''
  emit('update:modelValue', lastValue)
}

function onStatus(e: { detail: { bold?: boolean, italic?: boolean, underline?: boolean, list?: string } }) {
  formats.value = e.detail || {}
}

/** 外部清空 / 回填（如「清空」按钮）时同步进编辑器 */
watch(() => props.modelValue, (value) => {
  if (value === lastValue)
    return
  lastValue = value
  applyHtml(value || '')
})
</script>

<template>
  <view class="rich-editor">
    <view class="rich-editor__toolbar">
      <text class="rich-editor__tool" :class="{ 'rich-editor__tool--active': formats.bold }" @click="ctx?.format('bold')">
        B
      </text>
      <text class="rich-editor__tool rich-editor__tool--italic" :class="{ 'rich-editor__tool--active': formats.italic }" @click="ctx?.format('italic')">
        I
      </text>
      <text class="rich-editor__tool rich-editor__tool--underline" :class="{ 'rich-editor__tool--active': formats.underline }" @click="ctx?.format('underline')">
        U
      </text>
      <view class="rich-editor__divider" />
      <text class="rich-editor__tool" :class="{ 'rich-editor__tool--active': formats.list === 'ordered' }" @click="ctx?.format('list', 'ordered')">
        1.
      </text>
      <text class="rich-editor__tool" :class="{ 'rich-editor__tool--active': formats.list === 'bullet' }" @click="ctx?.format('list', 'bullet')">
        •
      </text>
      <view class="rich-editor__divider" />
      <text class="rich-editor__tool" @click="ctx?.undo()">
        ↶
      </text>
      <text class="rich-editor__tool" @click="ctx?.redo()">
        ↷
      </text>
    </view>
    <editor
      :id="uid"
      class="rich-editor__body"
      :style="{ height }"
      :placeholder="placeholder"
      @ready="onReady"
      @input="onInput"
      @statuschange="onStatus"
    />
  </view>
</template>

<style scoped lang="scss">
.rich-editor {
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;

  &__toolbar {
    display: flex;
    align-items: center;
    padding: 5px 8px;
    border-bottom: 1px solid #e2e8f0;
    background-color: #fff;
  }

  &__tool {
    display: flex;
    width: 28px;
    height: 28px;
    align-items: center;
    justify-content: center;
    margin-right: 4px;
    border-radius: 6px;
    color: #344054;
    font-size: 14px;
    font-weight: 600;

    &--active {
      background-color: #e8f0fe;
      color: var(--wot-color-theme, #0957de);
    }

    &--italic {
      font-style: italic;
    }

    &--underline {
      text-decoration: underline;
    }
  }

  &__divider {
    width: 1px;
    height: 16px;
    margin: 0 4px;
    background-color: #e2e8f0;
  }

  &__body {
    display: block;
    width: 100%;
    background-color: transparent;
  }
}
</style>
