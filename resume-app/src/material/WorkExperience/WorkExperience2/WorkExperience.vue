<!-- 工作经验 -->
<template>
  <div class="work-experience u-tag-div">
    <!-- 标题 -->
    <model-title
      :title="modelData.title"
      :iconfont="modelData.iconfont"
      :model-style="modelStyle"
    />
    <!-- 实习经历 -->
    <div v-for="(item, index) in modelData.LIST" :key="index" class="list u-tag-div">
      <ul class="list-ul u-tag-ul">
        <!-- 经历时间和项目名称 -->
        <div class="date-name-box u-tag-div">
          <span v-if="modelData.isShow.date" class="u-tag-span">{{ formatDate(item.date) }}</span>
          <!-- 公司名称 -->
          <span v-if="modelData.isShow.companyName" class="u-tag-span">{{ item.companyName }}</span>
        </div>
        <!-- 主要职责 -->
        <p v-if="modelData.isShow.posts" class="campusDuty u-tag-p">
          {{ item.posts }}
        </p>
        <!-- 工作内容 -->
        <ul class="campusContent u-tag-ul">
          <li v-for="(list, j) in item.jobContent" :key="j" class="u-tag-li">
            <RichTextView :html="list.content" :model-style="modelStyle" extra-style="letter-spacing:2px" />
          </li>
        </ul>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IWORKEXPERIENCE } from '@/interface/model'
import ModelTitle from '@/material/ModelTitle/ModelTitle2/ModelTitle.vue'
import { formatDate } from '@/utils/common'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IWORKEXPERIENCE
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .work-experience {
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  margin-bottom: v-bind('modelStyle.mBottom');
  margin-top: v-bind('modelStyle.mTop');
  box-sizing: border-box;
  .list {
    display: flex;
    flex-direction: column;
    display: flex;
    width: 100%;
    flex-direction: column;
    margin-top: 20px;
    .list-ul {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .date-name-box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: v-bind('modelStyle.titleFontSize');
        color: v-bind('modelStyle.titleColor');
        font-weight: v-bind('modelStyle.titleFontWeight');
        letter-spacing: 2px;
        margin-bottom: 5px;
        & :first-child {
          min-width: 165px;
        }
      }
      .campusDuty,
      .campusContent {
        width: 100%;
        font-size: v-bind('modelStyle.textFontSize');
        color: v-bind('modelStyle.textColor');
        font-weight: v-bind('modelStyle.textFontWeight');
        line-height: 18px;
        text-align: justify;
      }
      .campusDuty {
        margin-bottom: 10px;
      }
      .campusContent {
        flex-direction: column;
        padding: 0 0 0 18px;
        box-sizing: border-box;
        .u-tag-li {
          list-style: disc;
        }
      }
    }
  }
}
</style>
