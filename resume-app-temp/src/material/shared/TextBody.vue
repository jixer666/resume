<script setup lang="ts">
import type { IModelStyle } from '@/schema/types'
import { isEmptyHtml, plainToHtml } from '@/schema/modelData'
import MaterialShell from './MaterialShell.vue'
import SectionTitle from './SectionTitle.vue'

/**
 * 文本类模块的共用正文：兴趣爱好 / 自我评价 / 自定义模块的结构一致（标题 + 一段富文本）。
 * content 为 HTML 字符串（旧数据为纯文本），经 fg-rich-view 渲染并兼容旧格式。
 * 段落同样消费 --rs-entry-* 形态变量，卡片 / 衬底条模板下整段文字也会有底色或侧条。
 */
const props = defineProps<{ title: string, content: string, modelStyle: IModelStyle }>()

const text = computed(() => {
  const html = plainToHtml(props.content || '')
  return isEmptyHtml(html) ? '' : html
})
</script>

<template>
  <MaterialShell :model-style="props.modelStyle">
    <SectionTitle v-if="props.title" :title="props.title" :model-style="props.modelStyle" />
    <fg-rich-view v-if="text" class="rs-text" :html="text" />
  </MaterialShell>
</template>

<style scoped lang="scss">
.rs-text {
  display: block;
  padding: var(--rs-entry-pad);
  border: var(--rs-entry-border);
  border-left: var(--rs-entry-accent);
  border-radius: var(--rs-entry-radius);
  background-color: var(--rs-entry-bg);
  letter-spacing: 0.01em;
  text-align: justify;
  word-break: break-word;
}
</style>
