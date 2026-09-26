<script lang="ts" setup>
import type IMODELSTYLE from '@/interface/modelStyle'

/**
 * 富文本输出组件 —— 替代 resume-design 的 `v-dompurify-html` / `v-html`
 * （mp 端不认识这两个指令，直接编译失败）
 *
 * - 小程序：走 `<rich-text :nodes>`，并把主题文字样式**内联进富文本根节点**。
 *   `rich-text` 的节点不继承宿主样式，这正是「换主题后自我评价等区域不跟随」的根因，
 *   内联后即可跟随主题（见任务文档 §9 的对应风险项）。
 * - H5 / App：走 `v-html`，宿主节点直接吃同一份内联样式，保证两端视觉一致。
 */
defineOptions({ name: 'RichTextView' })

const props = withDefaults(defineProps<{
  /** 富文本 HTML */
  html?: string
  /** 传入即让富文本跟随主题字号 / 颜色 / 字重 */
  modelStyle?: Partial<IMODELSTYLE>
  /** 追加内联样式，如 `letter-spacing:2px` */
  extraStyle?: string
}>(), {
  html: '',
  modelStyle: undefined,
  extraStyle: '',
})

const nodeStyle = computed(() => {
  const style = props.modelStyle
  const declarations: string[] = []
  if (style?.textFontSize)
    declarations.push(`font-size:${style.textFontSize}`)
  if (style?.textColor)
    declarations.push(`color:${style.textColor}`)
  if (style?.textFontWeight)
    declarations.push(`font-weight:${style.textFontWeight}`)
  declarations.push('line-height:1.5', 'text-align:justify', 'word-break:break-word')
  if (props.extraStyle)
    declarations.push(props.extraStyle)
  return declarations.join(';')
})

/** 小程序端：样式必须内联在富文本根节点上 */
const nodes = computed(() => {
  const html = props.html || ''
  if (!html)
    return ''
  return `<div style="${nodeStyle.value}">${html}</div>`
})

/** 正文左缩进，空值即 0（模块级样式面板控制） */
const contentIndent = computed(() => props.modelStyle?.contentPaddingLeft || '')
</script>

<template>
  <view class="rich-text-view">
    <!-- #ifdef MP -->
    <rich-text class="rich-text-view__body" :nodes="nodes" />
    <!-- #endif -->
    <!-- #ifndef MP -->
    <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
    <view class="rich-text-view__body" :style="nodeStyle" v-html="html || ''" />
    <!-- #endif -->
  </view>
</template>

<style lang="scss" scoped>
.rich-text-view {
  display: block;
  box-sizing: border-box;
  width: 100%;
  /* 正文左缩进：默认 0，由模块级样式面板的 contentPaddingLeft 单独控制 */
  padding-left: v-bind('contentIndent');

  &__body {
    display: block;
    width: 100%;

    /*
     * 富文本内容里若自带 <ul>/<ol>（编辑器的项目符号列表），
     * 清掉 UA 默认的 40px 左内边距，避免与模块内边距叠加导致「太靠右」。
     * 注意：小程序端 rich-text 节点不吃外部样式，仅在 H5 / App 生效。
     */
    :deep(ul),
    :deep(ol) {
      padding-left: 0;
      margin: 0;
      list-style-position: inside;
    }
  }
}
</style>
