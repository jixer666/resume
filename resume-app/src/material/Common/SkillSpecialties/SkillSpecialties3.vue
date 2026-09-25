<!-- 技能特长 -->
<template>
  <div class="skill-specialties-content u-tag-div">
    <div class="skill-list-box u-tag-div">
      <!-- 左边部分 -->
      <div class="left u-tag-div">
        <template v-for="(item, index) in modelData.LIST" :key="index">
          <li v-if="index % 2 === 0" class="u-tag-li">
            <RichTextView :html="item.introduce" :model-style="modelStyle" extra-style="letter-spacing:2px" />
          </li>
        </template>
      </div>
      <!-- 右边部分 -->
      <div class="right u-tag-div">
        <template v-for="(item, index) in modelData.LIST" :key="index">
          <li v-if="index % 2 !== 0" class="u-tag-li">
            <RichTextView :html="item.introduce" :model-style="modelStyle" extra-style="letter-spacing:2px" />
          </li>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISKILLSPECIALTIES } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: ISKILLSPECIALTIES
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .skill-specialties-content {
  box-sizing: border-box;

  .skill-list-box {
    display: flex;
    flex-wrap: wrap;
    .left,
    .right {
      flex: 40%;
      .u-tag-li {
        letter-spacing: 2px;
        font-size: v-bind('modelStyle.textFontSize');
        color: v-bind('modelStyle.textColor');
        font-weight: v-bind('modelStyle.textFontWeight');
        line-height: 1.5;
        text-align: justify;
        &:not(:last-child) {
          margin-bottom: 10px;
        }
        :deep(.u-tag-p) {
          display: inline;
          text-align: justify;
        }
      }
    }
    .right {
      padding: 0 0 0 15px;
    }
  }
}
</style>
