/**
 * 应用级静态配置。
 * 只放「编译期可确定的常量」，可运营的数据一律走接口下发。
 */
const CONFIG = {
  /** 图片上传接口地址 */
  uploadAvatarUrl: `${import.meta.env.VITE_SERVER_BASEURL}/huajian/upload/file/avatar`,
}

export default CONFIG
