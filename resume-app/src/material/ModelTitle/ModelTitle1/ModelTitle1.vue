<!-- 模块小标题：按模板级样式预设 titleStyle 分发（空串为经典标题条，iconBadge 为圆点图标标题） -->
<template>
  <icon-badge-title v-if="isIconBadge" :title="title" :model-style="modelStyle" :icon="icon" />
  <classic-title v-else :title="title" :model-style="modelStyle" />
</template>

<script setup lang="ts">
import type IMODELSTYLE from '@/interface/modelStyle'
import { computed } from 'vue'
import ClassicTitle from '@/material/Common/ModelTitle/ClassicTitle.vue'
import IconBadgeTitle from '@/material/Common/ModelTitle/IconBadgeTitle.vue'

const props = defineProps<{
  title: string
  modelStyle: IMODELSTYLE // 模块样式
  icon?: string // 模块图标（模块数据里的 iconfont 名），圆点标题用
}>()

/**
 * 小标题形态由模板级样式预设 titleStyle 决定（与整页背景 resumeBackgroundCom 同一套做法）：
 * 换模板时小标题跟着模板走，所有模块一起换形态。
 *
 * 为什么不给每个模块各出一套标题皮肤：小标题不属于模块变体（variants 里没有 MODEL_TITLE），
 * 这里分发一次，11 套正文皮肤就不用为「只换标题形态」各复制一份。
 */
const isIconBadge = computed(() => props.modelStyle?.titleStyle === 'iconBadge')
</script>
