<script lang="ts" setup>
import { useTokenStore } from '@/store/token'
import { HOME_PAGE } from '@/utils'

/**
 * 一键登录页：只做一件事——把微信 code 交给后端换 token。
 *
 * 页面刻意保持极简（任务文档 §3 登录方案）：没有账号密码、没有图形验证码，
 * 登录成功直接回上一页，让「简历云端同步」成为唯一入口。
 */
defineOptions({ name: 'Login' })
definePage({
  style: {
    navigationBarTitleText: '登录',
  },
})

const tokenStore = useTokenStore()
/** 请求期间锁按钮，避免连点产生多个 code */
const loading = ref(false)

/** 一键登录：wx code → 后端 token → 拉用户信息，失败提示已由 store 内统一处理 */
async function handleLogin() {
  if (loading.value)
    return
  loading.value = true
  try {
    await tokenStore.wxLogin()
    backAfterLogin()
  }
  catch {
    // wxLogin 内部已 toast，这里只负责解锁按钮
  }
  finally {
    loading.value = false
  }
}

/** 登录成功回上一页；页面栈里只有登录页时回首页 */
function backAfterLogin() {
  if (getCurrentPages().length > 1)
    uni.navigateBack()
  else
    uni.reLaunch({ url: HOME_PAGE })
}
</script>

<template>
  <view class="login">
    <view class="login__brand">
      <view class="login__logo">
        <text class="login__logo-text">简</text>
      </view>
      <text class="login__title">简历设计</text>
      <text class="login__desc">微信一键登录，简历自动同步到云端</text>
    </view>

    <view class="login__action">
      <button
        class="login__btn"
        :loading="loading"
        :disabled="loading"
        @click="handleLogin"
      >
        微信一键登录
      </button>
      <text class="login__tip">登录即表示同意用户协议与隐私政策</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login {
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 96px 32px 48px;
  background-color: #fff;
}

.login__brand {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login__logo {
  display: flex;
  width: 72px;
  height: 72px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background-color: #0957de;
}

.login__logo-text {
  color: #fff;
  font-size: 34px;
  font-weight: 700;
}

.login__title {
  margin-top: 22px;
  color: #172b4d;
  font-size: 24px;
  font-weight: 700;
}

.login__desc {
  margin-top: 12px;
  color: #8290a5;
  font-size: 14px;
}

.login__action {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login__btn {
  width: 100%;
  height: 46px;
  border-radius: 23px;
  background-color: #0957de;
  color: #fff;
  font-size: 16px;
  line-height: 46px;

  &::after {
    border: none;
  }

  &[disabled] {
    background-color: #7aa2e8;
    color: #fff;
  }
}

.login__tip {
  margin-top: 16px;
  color: #a0aec0;
  font-size: 12px;
}
</style>
