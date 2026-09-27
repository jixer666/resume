/**
 * 头像 / 图片选择的公共实现（基本信息、自定义模块的头像字段共用）。
 *
 * 两端都要把选中的图片转成 base64 再回填，原因是同一个：临时地址都活不过一次重启。
 * H5 的 `blob:` 刷新即失效；小程序的 `tempFilePath` 只在本次会话有效，
 * 而且导出 PDF 时后端浏览器读不到 `wxfile://`，PDF 里就会缺头像。
 *
 * base64 会跟着简历 JSON 一起落库，所以这里同时兜住体积：先压缩，再限制 base64 长度。
 */

/** 图片 base64 上限（字符数，约合 1.2MB 原文）：后端没有上传接口，图片只能随 JSON 落库，太大既拖慢保存也顶不住本地存储 */
const IMAGE_MAX_BASE64_LENGTH = 1.2 * 1024 * 1024
/** 小程序端压缩目标宽度：头像在 A4 上最大约 200px，480px 足够 2 倍屏清晰 */
const IMAGE_TARGET_WIDTH = 480

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
      // #ifdef MP-WEIXIN
      readAsBase64(path, apply)
      // #endif
      // #ifndef H5 || MP-WEIXIN
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
    reader.onload = () => applyChecked(String(reader.result), apply)
    reader.onerror = () => apply(url)
    reader.readAsDataURL(xhr.response)
  }
  xhr.onerror = () => apply(url)
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.send()
}
// #endif

// #ifdef MP-WEIXIN
/**
 * 小程序端：先压缩再读成 base64。
 *
 * `compressImage` 在小图上也按 `compressedWidth` 缩放（放大反而更占体积），
 * 所以先用 `getImageInfo` 拿原图宽度，只有确实更宽时才指定目标宽度。
 */
function readAsBase64(path: string, apply: (value: string) => void) {
  uni.getImageInfo({
    src: path,
    success: ({ width }) => compressThenRead(path, width, apply),
    fail: () => compressThenRead(path, 0, apply),
  })
}

function compressThenRead(path: string, width: number, apply: (value: string) => void) {
  uni.compressImage({
    src: path,
    quality: 80,
    ...(width > IMAGE_TARGET_WIDTH ? { compressedWidth: IMAGE_TARGET_WIDTH } : {}),
    success: ({ tempFilePath }) => readFileBase64(tempFilePath || path, apply),
    // 压缩失败不拦路：退回原图读 base64，体积交给下面的统一兜底
    fail: () => readFileBase64(path, apply),
  })
}

function readFileBase64(filePath: string, apply: (value: string) => void) {
  uni.getFileSystemManager().readFile({
    filePath,
    encoding: 'base64',
    success: ({ data }) => {
      const base64 = typeof data === 'string' ? data : ''
      if (!base64) {
        uni.showToast({ title: '图片读取失败，请重试', icon: 'none' })
        return
      }
      applyChecked(`data:${mimeOf(filePath)};base64,${base64}`, apply)
    },
    fail: () => uni.showToast({ title: '图片读取失败，请重试', icon: 'none' }),
  })
}

/** readFile 只给纯 base64，data url 的 mime 前缀只能自己按后缀补 */
function mimeOf(path: string): string {
  const lower = path.toLowerCase()
  if (lower.endsWith('.png'))
    return 'image/png'
  if (lower.endsWith('.webp'))
    return 'image/webp'
  if (lower.endsWith('.gif'))
    return 'image/gif'
  return 'image/jpeg'
}
// #endif

/** 体积兜底：超限就提示换图，不把超大的 base64 塞进简历 JSON */
function applyChecked(dataUrl: string, apply: (value: string) => void) {
  if (dataUrl.length > IMAGE_MAX_BASE64_LENGTH) {
    uni.showToast({ title: '图片过大，请换一张', icon: 'none' })
    return
  }
  apply(dataUrl)
}
