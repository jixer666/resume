<script lang="ts" setup>
import type { IBASEINFO, ICUSTOM3 } from '@/interface/model'
import CircleAvatar from '@/material/Avatar/CircleAvatar.vue'
import RectangleAvatar from '@/material/Avatar/RectangleAvatar.vue'
import SquareAvatar from '@/material/Avatar/SquareAvatar.vue'

/**
 * 头像形状派发。
 *
 * 小程序端不支持 <component :is>，形状只能静态穷举；
 * 取值来自 MODEL_DATA_JSON 的 avatarShape：CIRCLE_AVATAR / SQUARE_AVATAR / RECTANGLE_AVATAR。
 * BASE_INFO 与 CUSTOM_3 都用它，所以这里收两种模块数据。
 */
defineProps<{
  modelData: IBASEINFO | ICUSTOM3
}>()
</script>

<template>
  <CircleAvatar v-if="modelData.avatarShape === 'CIRCLE_AVATAR'" :model-data="modelData" />
  <SquareAvatar v-else-if="modelData.avatarShape === 'SQUARE_AVATAR'" :model-data="modelData" />
  <RectangleAvatar v-else-if="modelData.avatarShape === 'RECTANGLE_AVATAR'" :model-data="modelData" />
</template>
