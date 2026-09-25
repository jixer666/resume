<!-- 工作经验 -->
<template>
  <div class="work-experience u-tag-div">
    <!-- 标题 -->
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <!-- 校园经历 -->
    <div class="work-experience-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="list u-tag-div">
        <ul class="u-tag-ul">
          <!-- 经历时间 -->
          <li v-if="modelData.isShow.date" class="list-title u-tag-li">
            {{ formatDate(item.date) }}
          </li>
          <!-- 公司名称 -->
          <li v-if="modelData.isShow.companyName" class="list-title u-tag-li">
            {{ item.companyName }}
          </li>
          <!-- 主要职责 -->
          <li v-if="modelData.isShow.posts" class="list-title u-tag-li">
            {{ item.posts }}
          </li>
        </ul>
        <!-- 简述 -->
        <div class="job-content u-tag-div">
          <p class="left u-tag-p">
            工作内容
          </p>
          <div class="content-list u-tag-div">
            <ul class="u-tag-ul">
              <li v-for="(list, j) in item.jobContent" :key="j" class="u-tag-li">
                <RichTextView :html="list.content" :model-style="modelStyle" extra-style="letter-spacing:2px" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IWORKEXPERIENCE } from '@/interface/model'
import ModelTitle from '@/material/ModelTitle/ModelTitle5/ModelTitle.vue'
import { formatDate } from '@/utils/common'
import type IMODELSTYLE from '@/interface/modelStyle'
import useGetLineLeft from '@/hooks/material/useTemplate3LeftLine'

const props = defineProps<{
  modelData: IWORKEXPERIENCE
  modelStyle: IMODELSTYLE // 模块样式
}>()

const { left } = useGetLineLeft(props.modelStyle, -23)
</script>

<style lang="scss" scoped>
  .work-experience {
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  box-sizing: border-box;
  margin-bottom: v-bind('modelStyle.mBottom');
  margin-top: v-bind('modelStyle.mTop');
  &::before {
    content: '';
    position: absolute;
    width: 1px;
    height: 100%;
    background-color: v-bind('modelStyle.themeColor');
    left: v-bind('left');
    top: 5px;
  }
  .work-experience-list {
    padding: 30px 30px 10px 50px;
    box-sizing: border-box;
    .list {
      display: flex;
      flex-direction: column;
      &:not(:last-child) {
        margin-bottom: 25px;
      }
      .u-tag-ul {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        & :first-child {
          min-width: 165px;
        }
        .list-title {
          list-style: none;
          font-size: v-bind('modelStyle.titleFontSize');
          color: v-bind('modelStyle.titleColor');
          font-weight: v-bind('modelStyle.titleFontWeight');
          letter-spacing: 2px;
        }
      }
      .job-content {
        display: flex;
        .left {
          width: 20%;
          letter-spacing: 2px;
          font-size: v-bind('modelStyle.titleFontSize');
          color: v-bind('modelStyle.titleColor');
          font-weight: v-bind('modelStyle.titleFontWeight');
        }
        .content-list {
          flex: 1;
          .u-tag-ul {
            display: flex;
            flex-direction: column;
            .u-tag-li {
              letter-spacing: 2px;
              font-size: v-bind('modelStyle.textFontSize');
              color: v-bind('modelStyle.textColor');
              font-weight: v-bind('modelStyle.textFontWeight');
              line-height: 1.5;
              &:not(:last-child) {
                margin-bottom: 6px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
