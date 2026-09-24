<script setup lang="ts">
import type { ICustomData, IModelStyle } from '@/schema/types'
import TextBody from '../../shared/TextBody.vue'

/** 自定义模块 1：纯文本 */
const props = defineProps<{ modelData: ICustomData, modelStyle: IModelStyle }>()
</script>

<template>
  <TextBody :title="props.modelData.title" :content="props.modelData.content" :model-style="props.modelStyle" />
</template>
