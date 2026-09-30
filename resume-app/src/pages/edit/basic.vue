<script lang="ts" setup>
import type { IBASEINFO } from '@/interface/model'
import type { IMATERIALITEM } from '@/interface/material'
import { useResumeStore } from '@/store/resume'
import { chooseAndUploadAvatar } from '@/utils/chooseImage'

/**
 * 基本信息表单：按 keyId 定位 store 里的 BASE_INFO 模块，直接改它的业务数据。
 * 页面不落库，返回编辑页时读的是同一份 JSON。
 *
 * 字段对齐 resume-design 的数据模型（`IBASEINFO`）：没有性别 / 求职意向，
 * 那两项在「求职意向」模块里。
 */
defineOptions({ name: 'ResumeEditBasic' })
definePage({
  style: {
    navigationBarTitleText: '基本信息',
  },
})

const store = useResumeStore()
const keyId = ref('')

/** 学历快捷选项：绝大多数简历落在这四档里，点一下即可，冷门学历仍走输入框 */
const DEGREE_OPTIONS = ['大专', '本科', '硕士', '博士']

/** 表单初始值即模块默认数据，避免手写一份可能与 schema 漂移的空对象 */
function createForm(): IBASEINFO {
  return {
    iconfont: '',
    model: 'BASE_INFO',
    show: true,
    title: '基本资料',
    avatarShape: '',
    name: '',
    age: 0,
    address: '',
    avatar: '',
    workService: 0,
    phoneNumber: '',
    email: '',
    degree: '',
    isShow: {
      age: true,
      address: true,
      avatar: true,
      workService: true,
      phoneNumber: true,
      email: true,
      degree: true,
    },
  }
}

const form = reactive<IBASEINFO>(createForm())

const item = computed<IMATERIALITEM | undefined>(() => store.current?.COMPONENTS.find(com => com.keyId === keyId.value))

onLoad((query) => {
  keyId.value = query?.keyId ? String(query.keyId) : ''
  const data = item.value?.data as Partial<IBASEINFO> | undefined
  if (data)
    Object.assign(form, data)
})

/** 选图后直接上传到后端 OSS，落库的是下载地址；取消选择或上传失败时不动原头像 */
async function chooseAvatar() {
  const url = await chooseAndUploadAvatar()
  if (url)
    form.avatar = url
}

function removeAvatar() {
  form.avatar = ''
}

/** 数字输入框拿到的是字符串，空值回退 0（年龄 / 工作年限在皮肤里是直接插值的数字） */
function toNumber(value: string): number {
  const num = Number(value)
  return Number.isNaN(num) ? 0 : num
}

function save() {
  const target = item.value
  if (target)
    Object.assign(target.data, form)
  uni.navigateBack()
}

function clear() {
  uni.showModal({
    title: '清空',
    content: '确定清空当前填写的内容吗？',
    success: ({ confirm }) => {
      if (!confirm)
        return
      Object.assign(form, createForm())
    },
  })
}
</script>

<template>
  <view class="page">
    <view class="card">
      <view class="avatar-row">
        <view v-if="form.avatar" class="avatar-wrap" @click="removeAvatar">
          <image :src="form.avatar" class="avatar" mode="aspectFill" />
          <text class="avatar-remove">删除头像</text>
        </view>
        <view v-else class="avatar-empty" @click="chooseAvatar">
          <mp-icon name="ui-image" color="#2563eb" size="30px" />
          <text class="avatar-empty-text">上传头像</text>
        </view>
        <text class="avatar-action" @click="chooseAvatar">
          {{ form.avatar ? '重新选择' : '选择照片' }}
        </text>
      </view>

      <text class="label">姓名</text>
      <input v-model="form.name" class="input" placeholder="请输入姓名">
      <text class="label">年龄</text>
      <input class="input" type="number" :value="String(form.age || '')" placeholder="请输入年龄" @input="form.age = toNumber($event.detail.value)">
      <text class="label">工作年限</text>
      <input class="input" type="number" :value="String(form.workService || '')" placeholder="请输入工作年限" @input="form.workService = toNumber($event.detail.value)">
      <text class="label">学历</text>
      <input v-model="form.degree" class="input input--degree" placeholder="如：本科">
      <view class="chips">
        <view
          v-for="option in DEGREE_OPTIONS"
          :key="option"
          class="chip"
          :class="{ 'chip--active': form.degree === option }"
          hover-class="chip--press"
          @click="form.degree = form.degree === option ? '' : option"
        >
          <text>{{ option }}</text>
        </view>
      </view>
      <text class="label">所在城市</text>
      <input v-model="form.address" class="input" placeholder="如：上海">
      <text class="label">联系电话</text>
      <input v-model="form.phoneNumber" class="input" type="number" placeholder="请输入联系电话">
      <text class="label">邮箱</text>
      <input v-model="form.email" class="input" placeholder="请输入邮箱">
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

.avatar-remove {
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed #93c5fd;
  border-radius: 8px;
}

.avatar-empty-text {
  margin-top: 4px;
  color: var(--wot-color-theme, #2563eb);
  font-size: 11px;
}

.avatar-action {
  margin-left: 14px;
  color: var(--wot-color-theme, #2563eb);
  font-size: 13px;
}

/* 学历快捷选项：与样式面板的色块一样用 margin 排版，不依赖小程序对 flex gap 的支持 */
.chips {
  display: flex;
  flex-wrap: wrap;
  margin: -4px 0 11px;
}

.chip {
  margin: 0 8px 8px 0;
  padding: 0 14px;
  border: 1px solid #e2e8f0;
  border-radius: 15px;
  background-color: #f8fafc;
  color: #475467;
  font-size: 13px;
  line-height: 28px;
}

.chip--active {
  border-color: var(--wot-color-theme, #2563eb);
  background-color: #eef4ff;
  color: var(--wot-color-theme, #2563eb);
}

.chip--press {
  opacity: 0.85;
}

/* 输入框下面紧跟快捷选项，收窄它自己的下间距，让两者视觉上是一组 */
.input--degree {
  margin-bottom: 8px;
}
</style>
