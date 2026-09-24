<script setup lang="ts">
/**
 * 富文本 HTML 渲染：H5/App 走 v-html，小程序走 rich-text。
 * 简历模板里的富文本内容（自我评价/经历描述等）统一经它输出。
 */
defineProps<{ html: string }>()
</script>

<template>
  <!-- #ifdef MP -->
  <rich-text class="fg-rich-view" :nodes="html || ''" />
  <!-- #endif -->
  <!-- #ifndef MP -->
  <!-- uni-app 的 view 编译后是原生元素，v-html 是 H5/App 端渲染 HTML 的标准方式 -->
  <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
  <view class="fg-rich-view" v-html="html || ''" />
  <!-- #endif -->
</template>

<style scoped lang="scss">
.fg-rich-view {
  word-break: break-word;

  /* v-html 注入的内容没有 scoped 属性，用 :deep 提供段落/列表的默认排版 */
  :deep(p) {
    margin: 0;
  }
  :deep(p + p) {
    margin-top: 0.4em;
  }
  :deep(ul),
  :deep(ol) {
    margin: 0.2em 0;
    padding-left: 1.4em;
  }
  :deep(li) {
    margin: 0.15em 0;
  }
  :deep(strong),
  :deep(b) {
    font-weight: 600;
  }
}
</style>
