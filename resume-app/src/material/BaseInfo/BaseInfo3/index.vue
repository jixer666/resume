<!-- 基础资料皮肤 3：蓝色侧栏头部（头像 / 姓名 / 联系方式靠左，白字），正文版式与经典模板一致 -->
<template>
  <div class="base-info-3-box u-tag-div">
    <base-info3-vue :model-data="modelData" :model-style="modelStyle" />
  </div>
</template>

<script lang="ts" setup>
import type { IBASEINFO } from '@/interface/model'
import type IMODELSTYLE from '@/interface/modelStyle'
import BaseInfo3Vue from '@/material/Common/BaseInfo/BaseInfo3.vue'

defineProps<{
  modelData: IBASEINFO // 模块数据
  modelStyle: IMODELSTYLE // 模块样式
}>()
</script>
