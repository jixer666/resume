<template>
  <div class="base-info-9-box u-tag-div">
    <base-info4-vue :model-data="modelData" :model-style="modelStyle" />
  </div>
</template>

<script lang="ts" setup>
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import BaseInfo4Vue from '@/material/Common/BaseInfo/BaseInfo4.vue'

defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>

<style lang="scss" scoped></style>
