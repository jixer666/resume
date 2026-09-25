import type { IAuthLoginRes, ICaptcha, IDoubleTokenRes, IUpdateInfo, IUpdatePassword, IUserInfoRes } from './types/login'
import { http } from '@/http/http'

/** 后端 AuthTypeEnum：1=账号密码，2=微信 */
const AUTH_TYPE_ACCOUNT = 1
const AUTH_TYPE_WX = 2

/**
 * 登录表单
 */
export interface ILoginForm {
  username: string
  password: string
}

/**
 * 获取验证码
 * @returns ICaptcha 验证码
 */
export function getCode() {
  return http.get<ICaptcha>('/user/getCode')
}

/**
 * 账号密码登录
 * @param loginForm 登录表单
 */
export function login(loginForm: ILoginForm) {
  return http.post<IAuthLoginRes>('/system/user/login', { ...loginForm, authType: AUTH_TYPE_ACCOUNT })
}

/**
 * 刷新token
 * @param refreshToken 刷新token
 */
export function refreshToken(refreshToken: string) {
  return http.post<IDoubleTokenRes>('/auth/refreshToken', { refreshToken })
}

/** 后端 /system/user/info 返回的用户字段（主键叫 uid，是 BASE62 字符串） */
interface IBackendUser {
  uid: string
  nickname: string
  username: string
  avatar: string
  email: string
}

/**
 * 获取用户信息
 *
 * 后端把用户包在 UserInfoVO.user 里、主键字段叫 uid，这里统一摊平成前端约定的结构。
 */
export async function getUserInfo(): Promise<IUserInfoRes> {
  const res = await http.get<{ user?: IBackendUser }>('/system/user/info')
  const user = res?.user
  return {
    userId: user?.uid || '',
    username: user?.username || '',
    nickname: user?.nickname || '',
    avatar: user?.avatar || '',
    email: user?.email || '',
  }
}

/**
 * 退出登录
 *
 * 该接口由 Spring Security 提供，只接受 POST。
 */
export function logout() {
  return http.post<void>('/system/logout')
}

/**
 * 修改用户信息
 */
export function updateInfo(data: IUpdateInfo) {
  return http.post('/user/updateInfo', data)
}

/**
 * 修改用户密码
 */
export function updateUserPassword(data: IUpdatePassword) {
  return http.post('/user/updatePassword', data)
}

/**
 * 获取微信登录凭证
 * @returns Promise 包含微信登录凭证(code)
 */
export function getWxCode() {
  return new Promise<UniApp.LoginRes>((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: res => resolve(res),
      fail: err => reject(new Error(err)),
    })
  })
}

/**
 * 微信登录：把 code 交给后端换 token
 * @param data 微信登录参数，包含 code
 */
export function wxLogin(data: { code: string }) {
  return http.post<IAuthLoginRes>('/system/user/login', { code: data.code, authType: AUTH_TYPE_WX })
}
