<template>
  <view
    v-show="isShow.avatar"
    :class="modelData.avatarShape ? 'avatar-shape-box' : 'avatar-box'"
    :style="avatarStyle"
  >
    <AvatarShape v-if="modelData.avatarShape" :model-data="modelData" />
    <image
      v-else
      class="avatar-img"
      :src="modelData.avatar"
      mode="aspectFill"
      style="width: 115px; height: 145px"
      :style="avatarStyle"
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
</style>
