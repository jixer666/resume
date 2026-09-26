<!-- 项目经验 -->
<template>
  <div class="project-experience-content u-tag-div">
    <!-- 校园经历 -->
    <div class="project-experience-list u-tag-div">
      <div v-for="(item, index) in modelData.LIST" :key="index" class="list u-tag-div">
        <ul class="u-tag-ul">
          <!-- 经历时间 -->
          <li v-if="modelData.isShow.date" class="list-title start-end-date u-tag-li">
            {{
              formatDate(item.date)
            }}
          </li>
          <!-- 公司名称 -->
          <li v-if="modelData.isShow.projectName" class="list-title u-tag-li">
            {{ item.projectName }}
          </li>
          <!-- 主要职责 -->
          <li v-if="modelData.isShow.posts" class="list-title u-tag-li">
            {{ item.posts }}
          </li>
        </ul>
        <!-- 简述 -->
        <div class="job-content u-tag-div">
          <div class="content-list u-tag-div">
            <ul class="u-tag-ul">
              <li v-if="item.projectContent" class="u-tag-li">
                <RichTextView :html="item.projectContent" :model-style="modelStyle" extra-style="letter-spacing:2px" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IPROJECTEXPERIENCE } from '@/interface/model'
import { formatDate } from '@/utils/common'
import type IMODELSTYLE from '@/interface/modelStyle'

defineProps<{
  modelData: IPROJECTEXPERIENCE
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped>
  .project-experience-content {
  box-sizing: border-box;
  .project-experience-list {
    padding-top: 15px;
    box-sizing: border-box;
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
        .content-list {
          flex: 1;
          .u-tag-ul {
            display: flex;
            flex-direction: column;
            padding-left: 18px;
            .u-tag-li {
              letter-spacing: 2px;
              font-size: v-bind('modelStyle.textFontSize');
              color: v-bind('modelStyle.textColor');
              font-weight: v-bind('modelStyle.textFontWeight');
              line-height: 1.5;
              text-align: justify;
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
