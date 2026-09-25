<script lang="ts" setup>
import type { IMATERIALITEM } from '@/interface/material'
import { useResumeStore } from '@/store/resume'
import { chooseLocalImage } from '@/utils/chooseImage'

/**
 * 短表单类模块的编辑页：简历标题 / 求职意向 / 自定义模块（CUSTOM_1/2/3）。
 * 按 keyId 定位 store 里的模块，直接改它的业务数据；页面不落库，返回编辑页时读的是同一份 JSON。
 */
defineOptions({ name: 'ResumeEditForm' })
definePage({
  style: {
    navigationBarTitleText: '编辑模块',
  },
})

/** 求职状态 / 求职类型 / 头像形状都是有限枚举，用 picker 而不是自由输入 */
const JOB_STATUS = ['离职-随时到岗', '在职-暂不考虑', '在职-考虑机会', '在职-月内到岗']
const JOB_SEARCH_TYPE = ['全职', '兼职', '实习']
const AVATAR_SHAPES = [
  { label: '圆形', value: 'CIRCLE_AVATAR' },
  { label: '正方形', value: 'SQUARE_AVATAR' },
  { label: '长方形', value: 'RECTANGLE_AVATAR' },
]

const store = useResumeStore()
const keyId = ref('')

interface IFormData {
  title: string
  intendedPositions: string
  intendedCity: string
  expectSalary: string
  jobStatus: string
  jobSearchType: string
  name: string
  abstract: string
  avatar: string
  avatarShape: string
}

function createForm(): IFormData {
  return {
    title: '',
    intendedPositions: '',
    intendedCity: '',
    expectSalary: '',
    jobStatus: '',
    jobSearchType: '',
    name: '',
    abstract: '',
    avatar: '',
    avatarShape: 'CIRCLE_AVATAR',
  }
}

const form = reactive<IFormData>(createForm())

const item = computed<IMATERIALITEM | undefined>(() => store.current?.COMPONENTS.find(com => com.keyId === keyId.value))
const model = computed(() => String(item.value?.model || ''))
const avatarShapeLabel = computed(() => AVATAR_SHAPES.find(one => one.value === form.avatarShape)?.label || '')

onLoad((query) => {
  keyId.value = query?.keyId ? String(query.keyId) : ''
  const data = item.value?.data as Record<string, unknown> | undefined
  if (!data)
    return
  Object.keys(form).forEach((key) => {
    const value = data[key]
    if (value !== undefined && value !== null && value !== '')
      form[key as keyof IFormData] = String(value)
  })
})

/** picker 回调只给下标，按下标回查枚举值 */
function pick(target: keyof IFormData, options: { value: string }[] | string[]) {
  return (e: { detail: { value: number | string } }) => {
    const chosen = options[Number(e.detail.value)]
    form[target] = String(typeof chosen === 'string' ? chosen : chosen?.value || '')
  }
}

/** 表单 → 模块数据：按模块只写自己那部分字段，避免把别的模块的键塞进来 */
function buildData(): Record<string, unknown> {
  if (model.value === 'RESUME_TITLE')
    return { title: form.title.trim() }
  if (model.value === 'JOB_INTENTION') {
    return {
      intendedPositions: form.intendedPositions.trim(),
      intendedCity: form.intendedCity.trim(),
      expectSalary: form.expectSalary.trim(),
      jobStatus: form.jobStatus,
      jobSearchType: form.jobSearchType,
    }
  }
  // CUSTOM_1 / CUSTOM_2 / CUSTOM_3 共用 name + abstract，只有 CUSTOM_3 带头像
  const custom: Record<string, unknown> = {
    name: form.name.trim(),
    abstract: form.abstract.trim(),
  }
  if (model.value === 'CUSTOM_3') {
    custom.avatar = form.avatar
    custom.avatarShape = form.avatarShape
  }
  return custom
}

function chooseAvatar() {
  chooseLocalImage((value) => {
    form.avatar = value
  })
}

function save() {
  const target = item.value
  if (target)
    Object.assign(target.data, buildData())
  uni.navigateBack()
}

function clear() {
  uni.showModal({
    title: '清空',
    content: '确定清空当前填写的内容吗？',
    success: ({ confirm }) => {
      if (!confirm)
        return
      // 头像形状是版式选择而非内容，清空内容时保留
      Object.assign(form, { ...createForm(), avatarShape: form.avatarShape })
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

      <template v-else-if="model === 'JOB_INTENTION'">
        <text class="label">期望职位</text>
        <input v-model="form.intendedPositions" class="input" placeholder="如：前端开发工程师">
        <text class="label">期望城市</text>
        <input v-model="form.intendedCity" class="input" placeholder="如：上海">
        <text class="label">期望薪资</text>
        <input v-model="form.expectSalary" class="input" placeholder="如：20-30K">
        <text class="label">求职状态</text>
        <picker :range="JOB_STATUS" @change="pick('jobStatus', JOB_STATUS)">
          <view class="picker">
            <text :class="{ placeholder: !form.jobStatus }">{{ form.jobStatus || '请选择求职状态' }}</text>
            <text class="arrow">›</text>
          </view>
        </picker>
        <text class="label">求职类型</text>
        <picker :range="JOB_SEARCH_TYPE" @change="pick('jobSearchType', JOB_SEARCH_TYPE)">
          <view class="picker">
            <text :class="{ placeholder: !form.jobSearchType }">{{ form.jobSearchType || '请选择求职类型' }}</text>
            <text class="arrow">›</text>
          </view>
        </picker>
      </template>

      <template v-else>
        <template v-if="model === 'CUSTOM_3'">
          <text class="label">头像</text>
          <view class="avatar-row">
            <image v-if="form.avatar" :src="form.avatar" class="avatar" mode="aspectFill" @click="chooseAvatar" />
            <view v-else class="avatar-empty" @click="chooseAvatar">
              <mp-icon name="ui-image" color="#0957de" size="30px" />
              <text class="avatar-empty-text">上传头像</text>
            </view>
            <text class="avatar-action" @click="chooseAvatar">
              {{ form.avatar ? '重新选择' : '选择照片' }}
            </text>
          </view>
          <text class="label">头像形状</text>
          <picker :range="AVATAR_SHAPES" range-key="label" @change="pick('avatarShape', AVATAR_SHAPES)">
            <view class="picker">
              <text :class="{ placeholder: !form.avatarShape }">{{ avatarShapeLabel || '请选择头像形状' }}</text>
              <text class="arrow">›</text>
            </view>
          </picker>
        </template>
        <text class="label">{{ model === 'CUSTOM_2' ? '标题内容' : '姓名' }}</text>
        <input v-model="form.name" class="input" :placeholder="model === 'CUSTOM_2' ? '如：个人简历' : '请输入姓名'">
        <text class="label">简介</text>
        <textarea v-model="form.abstract" class="textarea" placeholder="一句话介绍，不宜过长" :maxlength="60" />
      </template>
    </view>

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

.avatar-row {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}

.avatar {
  display: block;
  width: 72px;
  height: 72px;
  border-radius: 8px;
}

.avatar-empty {
  display: flex;
  width: 72px;
  height: 72px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed #93c5fd;
  border-radius: 8px;
}

.avatar-empty-text {
  margin-top: 4px;
  color: var(--wot-color-theme, #0957de);
  font-size: 11px;
}

.avatar-action {
  margin-left: 14px;
  color: var(--wot-color-theme, #0957de);
  font-size: 13px;
}
</style>
