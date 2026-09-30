/**
 * 文件读取与类型推断的公共实现：上传接口要的 fileMd5 / fileType / fileName 都在这里准备。
 */

/** 取路径 / 文件名里的扩展名（小写、不含点），没有扩展名时返回空串 */
export function getFileExtension(fileName: string): string {
  const index = fileName.lastIndexOf('.')
  return index > -1 ? fileName.slice(index + 1).toLowerCase() : ''
}

/** 取路径最后一段当文件名：小程序 / App 的临时路径都带扩展名，上传时用它保住扩展名 */
export function getFileName(filePath: string): string {
  return filePath.split('?')[0].split('/').pop() || ''
}

/** 按扩展名给图片 MIME：上传场景只有图片，未知扩展名按 jpeg 兜底 */
export function getImageMimeType(fileName: string): string {
  switch (getFileExtension(fileName)) {
    case 'png':
      return 'image/png'
    case 'gif':
      return 'image/gif'
    case 'webp':
      return 'image/webp'
    case 'bmp':
      return 'image/bmp'
    default:
      return 'image/jpeg'
  }
}

/**
 * 读本地文件为 ArrayBuffer：H5 的路径是 `blob:` 地址，只能走 XHR；
 * 小程序 / App 有文件系统，直接 readFile。上传接口要求 fileMd5，各端都读成字节后统一用 md5 算。
 */
export function readFileAsArrayBuffer(filePath: string): Promise<ArrayBuffer> {
  let task: Promise<ArrayBuffer>
  // #ifdef H5
  task = readByXhr(filePath)
  // #endif
  // #ifndef H5
  task = readByFileSystem(filePath)
  // #endif
  return task
}

// #ifdef H5
function readByXhr(filePath: string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', filePath)
    xhr.responseType = 'arraybuffer'
    xhr.onload = () => resolve(xhr.response as ArrayBuffer)
    xhr.onerror = () => reject(new Error('图片读取失败，请重试'))
    xhr.send()
  })
}
// #endif

// #ifndef H5
function readByFileSystem(filePath: string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    uni.getFileSystemManager().readFile({
      filePath,
      success: ({ data }) => resolve(data as ArrayBuffer),
      fail: () => reject(new Error('图片读取失败，请重试')),
    })
  })
}
// #endif
