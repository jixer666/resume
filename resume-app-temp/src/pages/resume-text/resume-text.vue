<script setup lang="ts">
import type { IMaterialItem, ModelName } from '@/schema/types'
import { cleanHtml, plainToHtml } from '@/schema/modelData'
import { useResumeStore } from '@/store/resume'

/**
 * 文本类模块编辑（自我评价 / 兴趣爱好 / 自定义模块）。
 * 按 keyId 定位 store 里的模块，content 存富文本 HTML。
 */
const store = useResumeStore()
const keyId = ref('')
const value = ref('')
const placeholder = ref('请输入内容')

const TEXT_MODEL: Partial<Record<ModelName, { placeholder: string }>> = {
  SELF_EVALUATION: { placeholder: '请输入个人总结，如：5 年产品经验，擅长从 0 到 1 搭建业务线…' },
  HOBBIES: { placeholder: '请输入兴趣爱好' },
  CUSTOM: { placeholder: '请输入自定义模块内容' },
}

const item = computed<IMaterialItem | undefined>(() => store.current?.COMPONENTS.find(com => com.keyId === keyId.value))

onLoad((query) => {
  keyId.value = query?.keyId ? String(query.keyId) : ''
  const data = item.value?.data as { content?: string } | undefined
  value.value = plainToHtml(data?.content || '')
  placeholder.value = TEXT_MODEL[item.value?.model as ModelName]?.placeholder || '请输入内容'
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
      if (!confirm)
        return
      value.value = ''
    },
  })
}
</script>

<template>
  <view class="page">
    <fg-rich-editor v-model="value" :placeholder="placeholder" />
    <view class="footer">
      <button class="btn-clear" @click="clear">
        清空
      </button>
      <button class="btn-save" @click="save">
        保存
      </button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 18px 16px 100px;
  background: rgb(244, 244, 244);
}
.footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  gap: 12px;
  padding: 10px 16px;
  padding-bottom: calc(10px + constant(safe-area-inset-bottom));
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  border-top: 1px solid #f1f5f9;
  background: #fff;
}
.btn-clear,
.btn-save {
  flex: 1;
  height: 44px;
  margin: 0;
  border: none;
  border-radius: 22px;
  line-height: 44px;
  font-size: 15px;

  &::after {
    border: none;
  }
}
.btn-clear {
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;
}
.btn-save {
  background: #2563eb;
  color: #fff;
}
</style>
