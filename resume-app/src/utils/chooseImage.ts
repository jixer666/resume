/**
 * 头像 / 图片选择的公共实现（基本信息、自定义模块的头像字段共用）。
 *
 * H5 端 `uni.chooseImage` 返回的是 `blob:` 地址，刷新页面即失效，
 * 而简历草稿是要持久化的 → 先转成 base64 再回填；
 * 小程序端 `tempFilePath` 由基础库托管，直接用即可。
 */
export function chooseLocalImage(apply: (value: string) => void): void {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: ({ tempFilePaths }) => {
      const path = tempFilePaths[0] || ''
      if (!path)
        return
      // #ifdef H5
      readAsDataUrl(path, apply)
      // #endif
      // #ifndef H5
      apply(path)
      // #endif
    },
  })
}

// #ifdef H5
/** H5 端把本地图片读成 base64，读取失败时退回原始地址 */
function readAsDataUrl(url: string, apply: (value: string) => void) {
  const xhr = new XMLHttpRequest()
  xhr.onload = () => {
    const reader = new FileReader()
    reader.onload = () => apply(String(reader.result))
    reader.onerror = () => apply(url)
    reader.readAsDataURL(xhr.response)
  }
  xhr.onerror = () => apply(url)
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.send()
}
// #endif
