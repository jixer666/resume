<!-- 作品展示 -->
<template>
  <div class="works-display u-tag-div">
    <!-- 标题 -->
    <model-title :title="modelData.title" :model-style="modelStyle" />
    <!-- 作品展示 -->
    <ul class="works-display-list u-tag-ul">
      <li v-for="(item, index) in modelData.LIST" :key="index" class="u-tag-li">
        <h1 class="u-tag-h1">
          {{ item.worksName }}
        </h1>
        <text class="u-tag-a" @click="copyWorksLink(item.worksLink)">{{ item.worksLink }}</text>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import useGetLineLeft from '@/hooks/material/useTemplate3LeftLine'
import type { IWORKSDISPLAY } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import ModelTitle from '@/material/ModelTitle/ModelTItle4/ModelTitle.vue'

const props = defineProps<{
  modelData: IWORKSDISPLAY
  modelStyle: IMODELSTYLE // 模块样式
}>()

/** 小程序没有 `<a>`，点击复制链接（H5 端同样可用，不影响导出 PDF） */
function copyWorksLink(link?: string) {
  if (!link)
    return
  uni.setClipboardData({
    data: link,
    success: () => uni.showToast({ title: '链接已复制', icon: 'none' }),
  })
}

const { left } = useGetLineLeft(props.modelStyle, -23)
</script>

<style lang="scss" scoped>
  .works-display {
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
  .works-display-list {
    padding: 30px 30px 10px 50px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .u-tag-li {
      display: flex;
      flex-direction: column;
      list-style: none;
      .u-tag-h1 {
        font-size: v-bind('modelStyle.textFontSize');
        color: v-bind('modelStyle.textColor');
        font-weight: v-bind('modelStyle.textFontWeight');
        letter-spacing: 2px;
        margin: 0;
      }
      .u-tag-a {
        font-size: 14px;
        margin-top: 5px;
        &:hover {
          color: #00c091;
        }
      }
      &:not(:last-child) {
        margin-bottom: 15px;
      }
    }
  }
}
</style>
