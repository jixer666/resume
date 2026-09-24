<script setup lang="ts">
/**
 * 轻量富文本编辑器：uni-app 内置 editor 组件 + 自定义工具栏（加粗/斜体/下划线/列表/撤销重做）。
 * v-model 输出 HTML 字符串，简历模板经 fg-rich-view 渲染。
 */
const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  /** 编辑区高度（编辑器不支持自动增高） */
  height?: string
}>(), {
  modelValue: '',
  placeholder: '请输入内容',
  height: '240px',
})

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

/** editor 组件的实例上下文（H5 与小程序暴露的 API 有差异：setHtml 仅小程序提供） */
interface EditorContext {
  format: (name: string, value?: string) => void
  undo: () => void
  redo: () => void
  setHtml?: (options: { html: string }) => void
  setContents?: (options: { html?: string, delta?: unknown }) => void
}

/** 页面可能同时存在多个编辑器，id 加随机后缀保证选择器唯一 */
const uid = `fg-rich-editor-${Math.random().toString(36).slice(2, 8)}`
const instance = getCurrentInstance()
const ctx = ref<EditorContext | null>(null)
/** 最近一次发出的值：外部回传相同值时不重设 HTML，避免编辑时光标跳动 */
let lastValue = props.modelValue

/** 工具栏高亮：statuschange 回传光标所在位置的格式状态 */
const formats = ref<{ bold?: boolean, italic?: boolean, underline?: boolean, list?: string }>({})

/** 把 HTML 灌进编辑器：小程序走 setHtml，H5 端只有 setContents({ html }) */
function applyHtml(html: string) {
  const c = ctx.value
  if (!c)
    return
  if (typeof c.setHtml === 'function')
    c.setHtml({ html })
  else if (typeof c.setContents === 'function')
    c.setContents({ html })
}

function onReady() {
  uni.createSelectorQuery()
    .in(instance?.proxy)
    .select(`#${uid}`)
    .context((res) => {
      ctx.value = (res as { context?: EditorContext }).context || null
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

/** 外部清空/回填（如「清空」按钮）时同步进编辑器 */
watch(() => props.modelValue, (value) => {
  if (value === lastValue)
    return
  lastValue = value
  applyHtml(value || '')
})
</script>

<template>
  <view class="fg-rich-editor">
    <view class="toolbar">
      <text class="tool" :class="{ active: formats.bold }" @click="ctx?.format('bold')">
        B
      </text>
      <text class="tool tool-italic" :class="{ active: formats.italic }" @click="ctx?.format('italic')">
        I
      </text>
      <text class="tool tool-underline" :class="{ active: formats.underline }" @click="ctx?.format('underline')">
        U
      </text>
      <view class="divider" />
      <text class="tool" :class="{ active: formats.list === 'ordered' }" @click="ctx?.format('list', 'ordered')">
        1.
      </text>
      <text class="tool" :class="{ active: formats.list === 'bullet' }" @click="ctx?.format('list', 'bullet')">
        •
      </text>
      <view class="divider" />
      <text class="tool" @click="ctx?.undo()">
        ↶
      </text>
      <text class="tool" @click="ctx?.redo()">
        ↷
      </text>
    </view>
    <editor
      :id="uid"
      class="editor"
      :style="{ height }"
      :placeholder="placeholder"
      @ready="onReady"
      @input="onInput"
      @statuschange="onStatus"
    />
  </view>
</template>

<style scoped lang="scss">
.fg-rich-editor {
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
}
.tool {
  display: flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #344054;
  font-size: 14px;
  font-weight: 600;
}
.tool-italic {
  font-style: italic;
}
.tool-underline {
  text-decoration: underline;
}
.tool.active {
  background: #e8f0fe;
  color: #2563eb;
}
.divider {
  width: 1px;
  height: 16px;
  margin: 0 4px;
  background: #e2e8f0;
}
.editor {
  display: block;
  width: 100%;
  background: transparent;
}
</style>
