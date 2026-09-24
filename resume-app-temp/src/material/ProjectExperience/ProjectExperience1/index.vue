<script setup lang="ts">
import type { IExperienceData, IModelStyle } from '@/schema/types'
import ExperienceBody from '../../shared/ExperienceBody.vue'

/** 项目经历 1：要点列表式（与工作经历共用正文结构） */
const props = defineProps<{ modelData: IExperienceData, modelStyle: IModelStyle }>()
</script>

<template>
  <ExperienceBody :model-data="props.modelData" :model-style="props.modelStyle" />
</template>
