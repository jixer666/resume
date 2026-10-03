import { showToast } from '@/utils/toast'

/**
 * 复制文本，只用自绘 toast 提示。
 *
 * `uni.setClipboardData` 自己会弹一个「内容已复制」的原生提示，再调 showToast 就会
 * 同时冒出两个弹窗，所以这里统一收口：
 *
 * - H5 / App：传 `showToast: false` 关掉原生提示（uni 的 formatArgs 支持该参数）；
 * - 小程序：客户端原生提示没有开关，在 success 里 `uni.hideToast()` 把它收掉。
 */
export function copyText(data: string, title: string) {
  if (!data)
    return
  uni.setClipboardData({
    data,
    showToast: false,
    success: () => {
      uni.hideToast()
      showToast({ title })
    },
  })
}
