<script setup lang="ts">
import { computed } from 'vue'
import { toastState } from '@/utils/toast'

/**
 * 全局提示框：替代 `uni.showToast` / `uni.showLoading` 的页面内自绘实现。
 *
 * 为什么自绘：微信小程序原生 toast 会截断文案 —— 带 icon 时最多 7 个汉字
 * （如「人气太火爆了，请稍后再试」只显示「人气太火爆了，」），不带 icon 时也最多两行，
 * 长文案根本展示不全；原生样式 H5 / App / 小程序三端也不一致。自绘后文案按宽度换行、
 * 完整展示，样式也对齐微信原生：深灰圆角底（rgba(0, 0, 0, .7)）+ 白色图标与文案。
 *
 * 挂在 App.ku.vue 根节点上（同 FgTabbar），所有页面共用一份，z-index 压过
 * 自定义 tabbar（1000）与各底部弹层（1001）。
 */
defineOptions({ name: 'FgToast' })

/**
 * 12 条竖线组成的 iOS 风 loading。
 * 颜色固定白色（toast 底色恒为深灰），所以直接用 data URI 当背景图，
 * 不经过 UnoCSS（mp 端不会为动态图标生成样式）。
 */
const loadingImage = computed(() => {
  const blades = Array.from({ length: 12 }, (_, i) => `<rect x='46.5' y='20' width='7' height='20' rx='3.5' transform='rotate(${i * 30} 50 50)' opacity='${((12 - i) / 12).toFixed(2)}'/>`).join('')
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 100 100'><g fill='#fff'>${blades}</g></svg>`
  return `url("data:image/svg+xml;charset=utf8,${encodeURIComponent(svg)}")`
})
</script>

<template>
  <!-- 遮罩：只有 mask 时铺满全屏，挡住点击与滚动穿透（同原生 toast 的 mask: true） -->
  <view
    v-if="toastState.visible && toastState.mask"
    class="fg-toast-mask"
    @touchmove.stop.prevent
  />
  <!--
    提示框：短文案时贴合原生 120px 方框，长文案按宽度换行、完整展示。
    无 icon 的纯文字提示收窄成一条（同原生 icon: none 的样式）。
  -->
  <view
    v-if="toastState.visible"
    class="fg-toast"
    :class="{ 'fg-toast--text': toastState.icon === 'none' }"
  >
    <view
      v-if="toastState.icon === 'loading'"
      class="fg-toast__loading"
      :style="{ backgroundImage: loadingImage }"
    />
    <mp-icon
      v-else-if="toastState.icon !== 'none'"
      :name="`ui-toast-${toastState.icon}`"
      color="#ededed"
      size="55px"
    />
    <text class="fg-toast__text">{{ toastState.title }}</text>
  </view>
</template>

<style lang="scss" scoped>
.fg-toast-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* 原生 toast 是 5000，这里压过自定义 tabbar（1000）与各底部弹层 */
  z-index: 5000;
}

.fg-toast {
  position: fixed;
  top: 40%;
  left: 50%;
  z-index: 5001;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 120px;
  min-height: 120px;
  /* 长文案在 260px 内换行，不再像原生那样截断 */
  max-width: 260px;
  padding: 20px 16px;
  border-radius: 8px;
  background-color: rgb(0 0 0 / 70%);
  transform: translate(-50%, -50%);
}

/* 纯文字提示：收窄成一条，同原生 icon: none 的样式 */
.fg-toast--text {
  min-width: 0;
  min-height: 0;
  padding: 12px 14px;
}

.fg-toast__loading {
  width: 38px;
  height: 38px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.fg-toast__text {
  margin-top: 8px;
  color: rgb(255 255 255 / 90%);
  font-size: 14px;
  line-height: 1.4;
  text-align: center;
  /* 中英文 / 链接都能按宽度换行 */
  word-break: break-all;
}

/* 纯文字提示没有图标，去掉图文的间距 */
.fg-toast--text .fg-toast__text {
  margin-top: 0;
}
</style>

<!-- loading 的旋转动画：keyframes 不能写在 scoped 块里（会被编译改名、引用却不会同步），
     同 style/editor-sheet.scss 里 sheet-up 的处理 -->
<style lang="scss">
@keyframes fg-toast-loading {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.fg-toast__loading {
  animation: fg-toast-loading 1s steps(12) infinite;
}
</style>
