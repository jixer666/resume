import { reactive } from 'vue'

/**
 * 全局提示（toast / loading）：自绘提示框的唯一状态源。
 *
 * 为什么不用 `uni.showToast`：微信小程序原生 toast 会截断文案 —— 带 icon 时标题最多
 * 显示 14 个半角字符（即 7 个汉字），多出来的直接丢掉。后端错误文案
 * 「人气太火爆了，请稍后再试」（ExceptionEnum 的 PARAM_EXCEPTION / BIZ_EXCEPTION）
 * 带 icon 弹出时只会显示「人气太火爆了，」，正是这个限制造成的；
 * 不带 icon 时原生也最多两行，H5 / App / 小程序三端样式还互不一致。
 * 这里统一改成页面内自绘（组件见 components/fg-toast），文案按宽度自动换行、完整展示。
 *
 * 用法与原生的 `uni.showToast` 基本一致，只是不再经过 `uni`：
 * `showToast({ title, icon, mask, duration })`、`showLoading({ title })`、`hideToast()`。
 */
export type ToastIcon = 'none' | 'success' | 'error' | 'loading'

export interface ToastOptions {
  /** 提示文案 */
  title?: string
  /** 图标：none 纯文字 / success 对勾 / error 感叹号 / loading 转圈 */
  icon?: ToastIcon
  /** 是否显示透明遮罩、挡住页面点击（原生 loading 默认有） */
  mask?: boolean
  /** 自动关闭时间（ms），loading 与原生一致不自动关闭 */
  duration?: number
}

/** toast 状态：由 fg-toast 组件消费，挂在 App.ku.vue 根节点上，所有页面共用一份 */
export const toastState = reactive({
  visible: false,
  title: '',
  icon: 'none' as ToastIcon,
  mask: false,
})

/** 自动关闭定时器；loading 没有定时器，只能手动 hide */
let timer: ReturnType<typeof setTimeout> | undefined

function clearTimer() {
  if (timer) {
    clearTimeout(timer)
    timer = undefined
  }
}

/** 显示提示；同 `uni.showToast`，但长文案不会被截断 */
export function showToast(options: ToastOptions = {}) {
  const { title = '', icon = 'none', mask = false, duration = 1500 } = options
  // 文案为空（如接口没返回 message）时不弹空框；loading 没文案也要转圈
  if (!title && icon !== 'loading')
    return
  clearTimer()
  toastState.title = title
  toastState.icon = icon
  toastState.mask = mask
  toastState.visible = true
  // loading 与原生一致：不自动关闭，等 hideLoading / hideToast 收尾
  if (icon !== 'loading')
    timer = setTimeout(hideToast, duration)
}

/** 显示 loading；同 `uni.showLoading`，默认带遮罩 */
export function showLoading(options: ToastOptions = {}) {
  showToast({ ...options, icon: 'loading', mask: options.mask ?? true })
}

/** 关闭提示；toast 与 loading 共用一套 UI，同 `uni.hideToast` */
export function hideToast() {
  clearTimer()
  toastState.visible = false
}

/** 同 `uni.hideLoading`；与 hideToast 等价，保留别名让调用处语义不变 */
export const hideLoading = hideToast
