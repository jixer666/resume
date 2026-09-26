<!-- 校园经历 -->
<template>
  <div class="campus-experience-content u-tag-div">
    <!-- 校园经历 -->
    <div class="campue-experience-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="list u-tag-div">
        <ul class="u-tag-ul">
          <!-- 经历时间 -->
          <li v-if="modelData.isShow.date" class="start-end-date u-tag-li">
            {{ formatDate(item.date) }}
          </li>
          <!-- 项目名称 -->
          <li v-if="modelData.isShow.campusBriefly" class="u-tag-li">
            {{ item.campusBriefly }}
          </li>
          <!-- 主要职责 -->
          <li v-if="modelData.isShow.campusDuty" class="u-tag-li">
            {{ item.campusDuty }}
          </li>
        </ul>
        <!-- 简述 -->
        <p v-if="modelData.isShow.campusContent" class="u-tag-p">
          <RichTextView :html="item.campusContent" :model-style="modelStyle" extra-style="letter-spacing:2px" />
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICAMPUSEXPERIENCE } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import { formatDate } from '@/utils/common'

defineProps<{
  modelData: ICAMPUSEXPERIENCE
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .campus-experience-content {
  box-sizing: border-box;
  .campue-experience-list {
    padding-top: 15px;
    .list {
      display: flex;
      flex-direction: column;
      &:not(:last-child) {
        margin-bottom: var(--entry-mb, 25px);
      }
      .u-tag-ul {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        & :first-child {
          min-width: 165px;
        }
        .u-tag-li {
          list-style: none;
          font-size: v-bind('modelStyle.titleFontSize');
          color: v-bind('modelStyle.titleColor');
          font-weight: v-bind('modelStyle.titleFontWeight');
          letter-spacing: 2px;
        }
      }
      .u-tag-p {
        letter-spacing: 2px;
        font-size: v-bind('modelStyle.textFontSize');
        color: v-bind('modelStyle.textColor');
        font-weight: v-bind('modelStyle.textFontWeight');
        line-height: 1.5;
        text-align: justify;
      }
    }
  }
}
</style>
