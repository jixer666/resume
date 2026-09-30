/**
 * 头像 / 图片选择与上传的公共实现（基本信息页的头像字段用）。
 *
 * 上传接口（`/system/oss/upload`）要求 fileMd5 与 fileType 都必填，文件名还决定
 * 后端拼 OSS 对象名时用的扩展名，所以这里把三样都准备齐：
 * - 文件名：H5 取选择器给的原始文件名，小程序 / App 取临时路径最后一段（都带扩展名）；
 * - MD5：把文件读成字节后统一用 `md5` 算（各端结果一致，见 utils/file.ts）；
 * - 类型：按扩展名给图片 MIME。
 *
 * 图片先压缩再上传：头像在 A4 上最大约 200px，压缩到 480px 足够 2 倍屏清晰，
 * 也避免把几 MB 的原图传给后端；压缩失败（如非 JPG）退回原图，不拦路。
 */

import { uploadFile } from '@/api/file'
import { getFileName, getImageMimeType, readFileAsArrayBuffer } from '@/utils/file'
import { md5 } from '@/utils/md5'
import { hideLoading, showLoading, showToast } from '@/utils/toast'

/** 小程序端压缩目标宽度：头像在 A4 上最大约 200px，480px 足够 2 倍屏清晰 */
const IMAGE_TARGET_WIDTH = 480

/** 选中的图片：path 用于读取与上传，name / type 交给上传接口 */
interface IChosenImage {
  path: string
  name: string
  type: string
}

/**
 * 选一张本地图片并上传到后端 OSS，返回可直接存进简历 JSON 的下载地址。
 * 用户取消选择时返回空串（不提示），上传失败时提示并返回空串。
 */
export async function chooseAndUploadAvatar(): Promise<string> {
  const file = await chooseImageFile()
  if (!file)
    return ''
  showLoading({ title: '头像上传中', mask: true })
  try {
    const fileMd5 = md5(await readFileAsArrayBuffer(file.path))
    const { downloadUrl } = await uploadFile({
      filePath: file.path,
      fileName: file.name,
      fileMd5,
      fileType: file.type,
    })
    hideLoading()
    return downloadUrl
  }
  catch (error) {
    hideLoading()
    showToast({ title: (error as Error).message || '头像上传失败' })
    return ''
  }
}

/** 选一张本地图片；用户取消选择时返回 null */
function chooseImageFile(): Promise<IChosenImage | null> {
  return new Promise((resolve) => {
    uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // #ifdef H5
        const h5File = res.tempFiles[0] as unknown as { name?: string, type?: string } | undefined
        const h5Path = res.tempFilePaths[0] || ''
        if (!h5Path) {
          resolve(null)
          return
        }
        resolve({ path: h5Path, name: h5File?.name || 'avatar.jpg', type: h5File?.type || 'image/jpeg' })
        // #endif
        // #ifdef MP-WEIXIN
        const mpPath = res.tempFilePaths[0] || ''
        if (!mpPath) {
          resolve(null)
          return
        }
        compressImage(mpPath).then((compressedPath) => {
          resolve({ path: compressedPath, name: getFileName(compressedPath), type: getImageMimeType(compressedPath) })
        })
        // #endif
        // #ifndef H5 || MP-WEIXIN
        const appPath = res.tempFilePaths[0] || ''
        if (!appPath) {
          resolve(null)
          return
        }
        resolve({ path: appPath, name: getFileName(appPath), type: getImageMimeType(appPath) })
        // #endif
      },
      // 用户取消选择也走 fail，这里静默返回，由调用方按空值处理
      fail: () => resolve(null),
    })
  })
}

// #ifdef MP-WEIXIN
/**
 * 小程序端压缩图片：`compressImage` 在小图上也按 `compressedWidth` 缩放（放大反而更占体积），
 * 所以先用 `getImageInfo` 拿原图宽度，只有确实更宽时才指定目标宽度；
 * 压缩失败退回原图，体积交给上传接口。
 */
function compressImage(filePath: string): Promise<string> {
  return new Promise((resolve) => {
    uni.getImageInfo({
      src: filePath,
      success: ({ width }) => {
        uni.compressImage({
          src: filePath,
          quality: 80,
          ...(width > IMAGE_TARGET_WIDTH ? { compressedWidth: IMAGE_TARGET_WIDTH } : {}),
          success: ({ tempFilePath }) => resolve(tempFilePath || filePath),
          fail: () => resolve(filePath),
        })
      },
      fail: () => resolve(filePath),
    })
  })
}
// #endif
