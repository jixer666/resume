<template>
  <div class="base-info-7-box u-tag-div">
    <!-- 基本信息 -->
    <div class="user-info u-tag-div">
      <div class="top u-tag-div">
        <!-- 个人头像 -->
        <div
          v-show="isShow.avatar"
          class="u-tag-div"
          :class="modelData.avatarShape ? 'avatar-shape-box' : 'avatar-box'"
          :style="avatarStyle"
        >
          <AvatarShape v-if="modelData.avatarShape" :model-data="modelData" />
          <image v-else mode="aspectFill" :src="modelData.avatar" style="width: 115px; height: 145px" :style="avatarStyle" />
        </div>
        <div class="right u-tag-div">
          <h1 class="u-tag-h1">
            {{ modelData.name }}
          </h1>
          <p v-show="isShow.abstract" class="user-abstract u-tag-p">
            <RichTextView :html="modelData.abstract" :model-style="modelStyle" />
          </p>
          <div class="bottom u-tag-div">
            <!-- 年龄、地点、经验等信息 -->
            <ul class="u-tag-ul">
              <li v-show="isShow.age" class="li-border u-tag-li">
                {{ modelData.age }}岁
              </li>
              <li v-show="isShow.address" class="li-border u-tag-li">
                {{ modelData.address }}
              </li>
              <li v-show="isShow.workService" class="li-border u-tag-li">
                {{ modelData.workService }}年经验
              </li>
              <li v-show="isShow.phoneNumber" class="li-border u-tag-li">
                {{ modelData.phoneNumber }}
              </li>
              <li v-show="isShow.email" class="u-tag-li">
                {{ modelData.email }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import AvatarShape from '@/material/Avatar/AvatarShape.vue'

const props = defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()
const isShow = reactive(props.modelData.isShow)

const avatarStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.modelStyle?.avatarWidth)
    style.width = props.modelStyle.avatarWidth
  if (props.modelStyle?.avatarHeight)
    style.height = props.modelStyle.avatarHeight
  return style
})
</script>

<style lang="scss" scoped>
  .base-info-7-box {
  width: 100%;
  cursor: pointer;
  padding-top: v-bind('modelStyle.pTop');
  padding-bottom: v-bind('modelStyle.pBottom');
  padding-left: v-bind('modelStyle.pLeftRight');
  padding-right: v-bind('modelStyle.pLeftRight');
  box-sizing: border-box;
  margin-bottom: v-bind('modelStyle.mBottom');
  margin-top: v-bind('modelStyle.mTop');
  .user-info {
    display: flex;
    flex-direction: column;
    .top {
      display: flex;
      align-items: flex-end;
      .avatar-box {
        width: 118px;
        height: 150px;
        overflow: hidden;
        background-color: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 4px solid #eee;
        margin-right: 50px;
      }
      .avatar-shape-box {
        margin-right: 50px;
      }
      .right {
        .u-tag-h1 {
          margin: 0;
          font-size: v-bind('modelStyle.titleFontSize');
          color: v-bind('modelStyle.titleColor');
          font-weight: v-bind('modelStyle.titleFontWeight');
          margin-bottom: 20px;
        }
        .u-tag-p {
          color: v-bind('modelStyle.textColor');
          font-size: v-bind('modelStyle.textFontSize');
          font-weight: v-bind('modelStyle.textFontWeight');
        }
        .bottom {
          height: 45px;
          display: flex;
          align-items: flex-end;
          .u-tag-ul {
            display: flex;
            .u-tag-li {
              list-style: none;
              font-size: v-bind('modelStyle.textFontSize');
              font-weight: v-bind('modelStyle.textFontWeight');
              padding-right: 12px;
              height: 20px;
              margin-right: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: v-bind('modelStyle.textColor');
            }
            .li-border {
              border-right: 2px solid #b4b4b4;
            }
          }
        }
      }
    }
  }
}
</style>
