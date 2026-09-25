<template>
  <div class="base-info-1-box u-tag-div">
    <base-info1-vue :model-data="modelData" :model-style="modelStyle" />
  </div>
</template>

<script lang="ts" setup>
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import BaseInfo1Vue from '@/material/Common/BaseInfo/BaseInfo1.vue'

defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>
