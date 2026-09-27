<template>
  <view v-show="isShow.avatar" class="avatar-box" :style="avatarStyle">
    <AvatarShape v-if="modelData.avatarShape" :model-data="modelData" />
    <image
      v-else
      class="avatar-box__img"
      :src="modelData.avatar"
      mode="aspectFill"
    />
  </view>
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

/** 头像尺寸：默认 100 x 120，可在样式面板里改 avatarWidth / avatarHeight */
const avatarStyle = computed<Record<string, string>>(() => ({
  width: props.modelStyle?.avatarWidth || '100px',
  height: props.modelStyle?.avatarHeight || '120px',
}))
</script>

<style lang="scss" scoped>
.avatar-box {
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;

  &__img {
    width: 100%;
    height: 100%;
    z-index: 1000;
  }
}
</style>
