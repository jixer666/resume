<!-- 技能特长 -->
<template>
  <div class="skill-specialties-content u-tag-div">
    <!-- 技能特长 -->
    <ul class="u-tag-ul">
      <template v-for="item in modelData.LIST" :key="item.skillName">
        <li class="u-tag-li">
          <p class="u-tag-p">
            {{ item.skillName }}
          </p>
          <skill-slider :proficiency="item.proficiency" :color="modelStyle.themeColor" />
        </li>
      </template>
    </ul>
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

  .u-tag-ul {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;
    .u-tag-li {
      height: 44px;
      margin-bottom: 20px;
      list-style: none;
      .u-tag-p {
        padding: 0 0 6px 4px;
        color: v-bind('modelStyle.textColor');
        font-size: v-bind('modelStyle.textFontSize');
        font-weight: v-bind('modelStyle.textFontWeight');
      }
    }
  }
}
</style>
