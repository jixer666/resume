<!-- 头像上传：选择图片 → 体积校验 → 上传 → 回填 URL -->
<template>
  <view class="avatar-upload" :style="{ width, height }" @click="handleChoose">
    <image v-if="modelValue" class="avatar-upload__img" :src="modelValue" mode="aspectFill" />
    <view v-else class="avatar-upload__placeholder">
      <text class="avatar-upload__icon i-carbon-add" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import CONFIG from '@/config'
import { useTokenStore } from '@/store'

const props = withDefaults(defineProps<{
  /** 头像地址，双向绑定 */
  modelValue?: string
  /** 展示宽度 */
  width?: string
  /** 展示高度 */
  height?: string
  /** 圆角百分比，50% 为圆形 */
  radius?: string
}>(), {
  modelValue: '',
  width: '100px',
  height: '100px',
  radius: '8%',
})

const emit = defineEmits<{
  (e: 'update:modelValue', url: string): void
}>()

const uploading = ref(false)

async function handleChoose() {
  if (uploading.value)
    return

  const chooseRes = await new Promise<{ tempFilePaths?: string | string[] } | null>((resolve) => {
    uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => resolve(res),
      fail: () => resolve(null),
    })
  })
  const paths = chooseRes?.tempFilePaths
  const filePath = Array.isArray(paths) ? paths[0] : paths
  if (!filePath)
    return

  await uploadAvatar(filePath)
}

/** 上传头像并回填地址，失败时只提示不打断编辑 */
async function uploadAvatar(filePath: string) {
  uploading.value = true
  uni.showLoading({ title: '上传中' })
  try {
    const res = await uni.uploadFile({
      url: CONFIG.uploadAvatarUrl,
      filePath,
      name: 'file',
      header: { Authorization: useTokenStore().validToken },
    })
    const data = JSON.parse(res.data || '{}') as {
      data?: { fileUrl?: string }
      fileUrl?: string
    }
    const url = data?.data?.fileUrl || data?.fileUrl || ''
    if (!url)
      throw new Error('上传响应缺少 fileUrl')
    emit('update:modelValue', url)
  }
  catch (error) {
    console.error('头像上传失败', error)
    uni.showToast({ title: '头像上传失败', icon: 'none' })
  }
  finally {
    uploading.value = false
    uni.hideLoading()
  }
}
</script>

<style lang="scss" scoped>
  .avatar-upload {
  overflow: hidden;
  background-color: #f2f3f5;
  border-radius: v-bind('props.radius');
  display: flex;
  align-items: center;
  justify-content: center;

  &__img {
    width: 100%;
    height: 100%;
  }

  &__placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    font-size: 28px;
    color: #c0c9d6;
  }
}
</style>
