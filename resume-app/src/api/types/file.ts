/**
 * 后端 FileVO：`/system/oss/upload` 上传成功后返回的文件记录。
 * 字段与 resume-server 的 FileVO 一一对应，上传场景只用到 downloadUrl。
 */
export interface IFileVO {
  /** 文件主键，下载地址按它拼接 */
  id: number
  /** 原始文件名（含扩展名） */
  filename: string
  /** 文件 MD5，后端用它当 OSS 对象名 */
  fileMd5: string
  /** 文件类型，如 image/jpeg */
  fileType: string
  /** 文件大小（字节） */
  totalSize: number
  /** 后端拼好的下载地址，可直接存进简历 JSON 的 avatar 字段 */
  downloadUrl: string
  /** OSS 上的相对路径 */
  filePath: string
  /** OSS 类型 */
  ossType: number
  /** 上传用户 */
  userId: number
  /** 创建时间 */
  createTime: string
  /** 状态 */
  status: number
}

/** 上传文件入参：后端 OssFileUploadDTO 的 file / fileMd5 / fileType 都必填 */
export interface IFileUploadParams {
  /** 本地文件路径：小程序 / App 是临时文件路径，H5 是 blob 地址 */
  filePath: string
  /** 带扩展名的文件名：后端按它取扩展名拼 OSS 对象名 */
  fileName: string
  /** 文件内容的 MD5 */
  fileMd5: string
  /** 文件类型（MIME），如 image/jpeg */
  fileType: string
}
