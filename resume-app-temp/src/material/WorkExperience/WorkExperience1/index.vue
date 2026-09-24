<script setup lang="ts">
import type { IExperienceData, IModelStyle } from '@/schema/types'
import ExperienceBody from '../../shared/ExperienceBody.vue'

/** 工作经历 1：要点列表式 */
const props = defineProps<{ modelData: IExperienceData, modelStyle: IModelStyle }>()
</script>

<template>
  <ExperienceBody :model-data="props.modelData" :model-style="props.modelStyle" />
</template>
