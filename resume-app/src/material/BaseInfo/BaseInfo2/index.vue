<!-- 基础资料皮肤 2：名片式头部（文字靠左 / 头像靠右），正文版式与经典模板一致 -->
<template>
  <div class="base-info-2-box u-tag-div">
    <base-info2-vue :model-data="modelData" :model-style="modelStyle" />
  </div>
</template>

<script lang="ts" setup>
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import BaseInfo2Vue from '@/material/Common/BaseInfo/BaseInfo2.vue'

defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>
