<script setup lang="ts">
import type { IHobbiesData, IModelStyle } from '@/schema/types'
import TextBody from '../../shared/TextBody.vue'

/** 兴趣爱好 1：纯文本 */
const props = defineProps<{ modelData: IHobbiesData, modelStyle: IModelStyle }>()
</script>

<template>
  <TextBody :title="props.modelData.title" :content="props.modelData.content" :model-style="props.modelStyle" />
</template>
