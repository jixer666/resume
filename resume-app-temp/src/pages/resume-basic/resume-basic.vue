<script setup lang="ts">
import type { IBaseInfoData, IMaterialItem } from '@/schema/types'
import { createModelData } from '@/schema/modelData'
import { useResumeStore } from '@/store/resume'

/**
 * 基本信息编辑：按 keyId 定位 store 里的 BASE_INFO 模块，直接改它的业务数据。
 * 页面本身不落库，返回编辑页时读的是同一份 JSON。
 */
const store = useResumeStore()
const keyId = ref('')
const form = reactive<IBaseInfoData>(createModelData<IBaseInfoData>('BASE_INFO'))

const genderOptions = ['男', '女']

/** 当前编辑的模块实例 */
function moduleOf(): IMaterialItem | undefined {
  return store.current?.COMPONENTS.find(item => item.keyId === keyId.value)
}

onLoad((query) => {
  keyId.value = query?.keyId ? String(query.keyId) : ''
  const data = moduleOf()?.data as IBaseInfoData | undefined
  if (data)
    Object.assign(form, data)
})

function chooseAvatar() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: ({ tempFilePaths }) => {
      const path = tempFilePaths[0]
      // #ifdef H5
      // H5 端转 base64，避免 blob URL 刷新后失效
      toBase64(path)
      return
      // #endif
      form.avatar = path
    },
  })
}

// #ifdef H5
function toBase64(url: string) {
  const xhr = new XMLHttpRequest()
  xhr.onload = () => {
    const reader = new FileReader()
    reader.onload = () => {
      form.avatar = String(reader.result)
    }
    reader.onerror = () => {
      form.avatar = url
    }
    reader.readAsDataURL(xhr.response)
  }
  xhr.onerror = () => {
    form.avatar = url
  }
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.send()
}
// #endif

function removeAvatar() {
  form.avatar = ''
}

function onGenderChange(e: { detail: { value: number | string } }) {
  form.gender = genderOptions[Number(e.detail.value)] || ''
}

function save() {
  const item = moduleOf()
  if (item)
    Object.assign(item.data, form)
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
        avatar: '',
        name: '',
        gender: '',
        phoneNumber: '',
        email: '',
        intention: '',
      })
    },
  })
}
</script>

<template>
  <view class="page">
    <view class="card">
      <view class="avatar-row">
        <view v-if="form.avatar" class="avatar-wrap">
          <image :src="form.avatar" class="avatar" mode="aspectFill" />
          <text class="remove-avatar" @click="removeAvatar">删除头像</text>
        </view>
        <view v-else class="avatar-empty" @click="chooseAvatar">
          ＋
          <text>上传头像</text>
        </view>
        <view class="avatar-action" @click="chooseAvatar">
          {{ form.avatar ? '重新选择' : '选择照片' }}
        </view>
      </view>
      <text class="label">姓名</text>
      <input v-model="form.name" class="input" placeholder="请输入姓名">
      <text class="label">性别</text>
      <picker class="picker" mode="selector" :range="genderOptions" @change="onGenderChange">
        <view class="picker-value" :class="{ placeholder: !form.gender }">
          {{ form.gender || '请选择性别' }}
        </view>
      </picker>
      <text class="label">联系电话</text>
      <input v-model="form.phoneNumber" class="input" placeholder="请输入联系电话">
      <text class="label">邮箱</text>
      <input v-model="form.email" class="input" placeholder="请输入邮箱">
      <text class="label">求职意向</text>
      <input v-model="form.intention" class="input" placeholder="如：产品经理">
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
.avatar-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.avatar-wrap {
  position: relative;
}
.avatar {
  display: block;
  width: 72px;
  height: 72px;
  border-radius: 8px;
}
.remove-avatar {
  display: block;
  margin-top: 5px;
  color: #ef4444;
  font-size: 11px;
  text-align: center;
}
.avatar-empty {
  display: flex;
  width: 72px;
  height: 72px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 1px dashed #93c5fd;
  border-radius: 8px;
  color: #2563eb;
  font-size: 24px;
}
.avatar-empty text {
  font-size: 11px;
}
.avatar-action {
  margin-left: 14px;
  color: #2563eb;
  font-size: 13px;
}
.label {
  display: block;
  margin: 2px 0 8px;
  color: #344054;
  font-size: 13px;
}
.input {
  height: 44px;
  box-sizing: border-box;
  margin-bottom: 15px;
  padding: 0 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 14px;
}
.picker {
  margin-bottom: 15px;
}
.picker-value {
  height: 44px;
  line-height: 44px;
  padding: 0 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 14px;
  color: #344054;
}
.picker-value.placeholder {
  color: #98a2b3;
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
