<template>
  <view class="rectangle-avatar-box">
    <image
      v-if="modelData?.avatar"
      class="avatar-img"
      :src="modelData.avatar"
      mode="aspectFill"
      :style="{ width: '115px', height: '145px' }"
    />
    <image
      v-else
      class="avatar-img"
      :src="defaultImg"
      mode="aspectFill"
      :style="{ width: '100%', height: '100%' }"
    />
  </view>
</template>

<script lang="ts" setup>
import type { IBASEINFO, ICUSTOM3 } from '@/interface/model'
import defaultImg from '@img/people.jpg'

defineOptions({
  name: 'RECTANGLEAVATAR',
})

const props = withDefaults(defineProps<IAvatar>(), {
  width: '118px',
  height: '150px',
  modelData: null,
})
interface IAvatar {
  width?: string
  height?: string
  modelData?: IBASEINFO | ICUSTOM3 | null // 模块数据
}
</script>

<style lang="scss" scoped>
  .rectangle-avatar-box {
  width: v-bind('props.width');
  height: v-bind('props.height');
  border: 3px solid #e5e5e5;
  overflow: hidden;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
