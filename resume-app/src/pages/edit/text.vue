<script lang="ts" setup>
import type { IMATERIALITEM } from '@/interface/material'
import MODEL_DATA_JSON from '@/schema/modelData'
import { useResumeStore } from '@/store/resume'
import { cleanHtml, plainToHtml } from '@/utils/richText'

/**
 * 文本类模块编辑（自我评价 / 兴趣爱好）：一整段富文本，content 存 HTML。
 * 按 keyId 定位 store 里的模块，直接改它的业务数据。
 */
defineOptions({ name: 'ResumeEditText' })
definePage({
  style: {
    navigationBarTitleText: '编辑内容',
  },
})

const PLACEHOLDER: Record<string, string> = {
  SELF_EVALUATION: '对自己做一个简单评价，如：5 年产品经验，擅长从 0 到 1 搭建业务线…',
  HOBBIES: '简要介绍自己的兴趣爱好，如：逛技术博客、长跑、摄影',
}

const store = useResumeStore()
const keyId = ref('')
const value = ref('')

const item = computed<IMATERIALITEM | undefined>(() => store.current?.COMPONENTS.find(com => com.keyId === keyId.value))
const placeholder = computed(() => PLACEHOLDER[String(item.value?.model || '')] || '请输入内容')
const title = computed(() => String((item.value?.data as { title?: string } | undefined)?.title || MODEL_DATA_JSON[String(item.value?.model || '')]?.title || '内容'))

onLoad((query) => {
  keyId.value = query?.keyId ? String(query.keyId) : ''
  const data = item.value?.data as { content?: string } | undefined
  value.value = plainToHtml(String(data?.content || ''))
})

function save() {
  const data = item.value?.data as { content?: string } | undefined
  if (data)
    data.content = cleanHtml(value.value)
  uni.navigateBack()
}

function clear() {
  uni.showModal({
    title: '清空',
    content: '确定清空当前填写的内容吗？',
    success: ({ confirm }) => {
      if (confirm)
        value.value = ''
    },
  })
}
</script>

<template>
  <view class="page">
    <text class="label">{{ title }}</text>
    <rich-text-editor v-model="value" :placeholder="placeholder" height="320px" />

    <view class="footer">
      <button class="btn btn--ghost" hover-class="btn--press" @click="clear">
        清空
      </button>
      <button class="btn btn--primary" hover-class="btn--press" @click="save">
        保存
      </button>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import '../../style/editor-form.scss';

.label {
  margin-bottom: 10px;
}
</style>
