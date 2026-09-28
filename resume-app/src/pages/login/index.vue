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
    navigationBarTitleText: '简历盒子',
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
      <image class="login__logo" src="/static/logo.png" mode="aspectFit" />
      <text class="login__title">简历盒子</text>
      <text class="login__desc">微信一键登录，简历自动同步到云端</text>
    </view>

    <view class="login__action">
      <button
        class="login__btn"
        hover-class="login__btn--press"
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
  /* H5 的页面容器在导航栏下方，需减去导航栏高度（--window-top）；小程序无此变量，回退为 0 */
  min-height: calc(100vh - var(--window-top, 0px));
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  /* 底部避开 Home 指示条 */
  padding: 88px 32px calc(40px + env(safe-area-inset-bottom));
  background-color: #fff;
}

.login__brand {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login__logo {
  width: 96px;
  height: 96px;
  /* 与图片本身的圆角保持一致，让投影贴合圆角轮廓 */
  border-radius: 22%;
  box-shadow: 0 16px 32px rgba(37, 99, 235, 0.18);
}

.login__title {
  margin-top: 24px;
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
  background-color: var(--wot-color-theme, #2563eb);
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

.login__btn--press {
  opacity: 0.9;
}

.login__tip {
  margin-top: 16px;
  color: #a0aec0;
  font-size: 12px;
}
</style>
