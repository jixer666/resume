<template>
  <div class="title u-tag-div">
    <div class="left u-tag-div" />
    <div class="editor-resume u-tag-div">
      {{ modelData.title }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IRESUMETITLE } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IRESUMETITLE
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  /*
   * 简历标题条高度：`--rs-doc-title-h` 由 ResumeRender 按「整理成一页」的压缩比例下发
   * （默认 32px = 字号 13px + 上下各约 10px），条高跟着字号一起收。
   * 左侧色块与文字行同高，两边必须一起缩，否则色块会把条重新撑到原高。
   */
.title {
  width: 100%;
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  min-height: var(--rs-doc-title-h, 32px);
  margin-bottom: v-bind('modelStyle.mBottom');
  margin-top: v-bind('modelStyle.mTop');
  background-color: v-bind('modelStyle.themeColor');
  display: flex;
  .left {
    min-height: var(--rs-doc-title-h, 32px);
    width: 36px;
    background-color: #258bb1;
    margin-right: 18px;
  }

  .editor-resume {
    color: v-bind('modelStyle.textColor');
    outline: none;
    font-weight: v-bind('modelStyle.textFontWeight');
    font-size: v-bind('modelStyle.textFontSize');
    letter-spacing: 2px;
    word-break: break-all;
    width: 0;
    flex: 1;
    display: flex;
    align-items: center;
  }
}
</style>
