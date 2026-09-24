<script setup lang="ts">
import type { IJobIntentionData, IMaterialItem, IResumeTitleData, ModelName } from '@/schema/types'
import { useResumeStore } from '@/store/resume'

/**
 * 简历标题 / 求职意向的编辑页：按 keyId 定位 store 里的模块，直接改它的业务数据。
 * 页面本身不落库，返回编辑页时读的是同一份 JSON。
 */
const store = useResumeStore()
const keyId = ref('')

const form = reactive({
  title: '',
  intendedPositions: '',
  intendedCity: '',
  expectSalary: '',
  jobStatus: '',
  jobSearchType: '',
})

const jobStatusOptions = ['离职-随时到岗', '在职-暂不考虑', '在职-考虑机会', '在职-月内到岗']
const jobSearchTypeOptions = ['全职', '兼职', '实习']

const item = computed<IMaterialItem | undefined>(() => store.current?.COMPONENTS.find(com => com.keyId === keyId.value))
const model = computed<ModelName | undefined>(() => item.value?.model)

onLoad((query) => {
  keyId.value = query?.keyId ? String(query.keyId) : ''
  const data = item.value?.data as Partial<IResumeTitleData & IJobIntentionData> | undefined
  if (data) {
    Object.assign(form, {
      title: String(data.title || ''),
      intendedPositions: String(data.intendedPositions || ''),
      intendedCity: String(data.intendedCity || ''),
      expectSalary: String(data.expectSalary || ''),
      jobStatus: String(data.jobStatus || ''),
      jobSearchType: String(data.jobSearchType || ''),
    })
  }
})

function onPickerChange(field: 'jobStatus' | 'jobSearchType', options: string[]) {
  return (e: { detail: { value: number | string } }) => {
    form[field] = options[Number(e.detail.value)] || ''
  }
}

function save() {
  const target = item.value
  if (target) {
    Object.assign(target.data, model.value === 'RESUME_TITLE'
      ? { title: form.title }
      : {
          intendedPositions: form.intendedPositions,
          intendedCity: form.intendedCity,
          expectSalary: form.expectSalary,
          jobStatus: form.jobStatus,
          jobSearchType: form.jobSearchType,
        })
  }
  uni.navigateBack()
}

function clear() {
  uni.showModal({
    title: '清空',
    content: '确定清空当前填写的内容吗？',
    success: ({ confirm }) => {
      if (!confirm)
        return
      Object.assign(form, {
        title: '',
        intendedPositions: '',
        intendedCity: '',
        expectSalary: '',
        jobStatus: '',
        jobSearchType: '',
      })
    },
  })
}
</script>

<template>
  <view class="page">
    <view class="card">
      <template v-if="model === 'RESUME_TITLE'">
        <text class="label">简历标题</text>
        <input v-model="form.title" class="input" placeholder="通常填姓名，显示在简历顶部">
      </template>

      <template v-else>
        <text class="label">期望职位</text>
        <input v-model="form.intendedPositions" class="input" placeholder="如：前端开发工程师">
        <text class="label">期望城市</text>
        <input v-model="form.intendedCity" class="input" placeholder="如：上海">
        <text class="label">期望薪资</text>
        <input v-model="form.expectSalary" class="input" placeholder="如：20-30K">
        <text class="label">求职状态</text>
        <picker :range="jobStatusOptions" @change="onPickerChange('jobStatus', jobStatusOptions)">
          <view class="picker">
            <text :class="{ placeholder: !form.jobStatus }">{{ form.jobStatus || '请选择求职状态' }}</text>
            <text class="arrow">›</text>
          </view>
        </picker>
        <text class="label">求职类型</text>
        <picker :range="jobSearchTypeOptions" @change="onPickerChange('jobSearchType', jobSearchTypeOptions)">
          <view class="picker">
            <text :class="{ placeholder: !form.jobSearchType }">{{ form.jobSearchType || '请选择求职类型' }}</text>
            <text class="arrow">›</text>
          </view>
        </picker>
      </template>
    </view>
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
.card {
  padding: 18px 16px;
  background: #fff;
  border-radius: 12px;
}
.label {
  display: block;
  margin: 2px 0 8px;
  color: #344054;
  font-size: 13px;
}
.input {
  width: 100%;
  box-sizing: border-box;
  height: 44px;
  margin-bottom: 15px;
  padding: 0 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 14px;
}
.picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  margin-bottom: 15px;
  padding: 0 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  color: #172b4d;
  font-size: 14px;
}
.placeholder {
  color: #94a3b8;
}
.arrow {
  color: #94a3b8;
  font-size: 16px;
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
