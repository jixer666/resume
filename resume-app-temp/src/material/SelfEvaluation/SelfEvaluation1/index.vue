<script setup lang="ts">
import type { IModelStyle, ISelfEvaluationData } from '@/schema/types'
import TextBody from '../../shared/TextBody.vue'

/** 自我评价 1：纯文本 */
const props = defineProps<{ modelData: ISelfEvaluationData, modelStyle: IModelStyle }>()
</script>

<template>
  <TextBody :title="props.modelData.title" :content="props.modelData.content" :model-style="props.modelStyle" />
</template>
