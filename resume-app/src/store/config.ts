import type { IFeedbackSheet } from '@/api/config'
import type IGlobalStyle from '@/interface/globalStyle'
import type IMODELSTYLE from '@/interface/modelStyle'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getResumeConfig } from '@/api/config'

/**
 * 简历前端配置 store：缓存后端下发的出厂默认全局样式、各模块默认样式与问题反馈群入口。
 *
 * 只在内存里留一份，不持久化 —— 配置随时可能变，每次冷启动都该拉最新的。
 * `ensureLoaded` 做了请求去重与失败重试：加载失败时保持未就绪（不抛异常），
 * 下一次调用会重新拉，调用方则继续用本地 schema 兜底。刻意不 re-export 到
 * @/store/index，改为按需 from '@/store/config' 引入。
 */
export const useConfigStore = defineStore('resumeConfig', () => {
  /** 出厂默认全局样式；为 null 表示尚未成功加载 */
  const globalStyle = ref<Partial<IGlobalStyle> | null>(null)
  /** 模块默认样式，key 为模块名（如 WORK_EXPERIENCE） */
  const modelStyle = ref<Record<string, Partial<IMODELSTYLE>>>({})
  /** 问题反馈群入口：null 表示后端还没下发，组件按「默认展示」处理 */
  const feedbackSheet = ref<IFeedbackSheet | null>(null)
  /** 在途的加载请求，用来把并发调用串成一次 */
  let pending: Promise<void> | null = null

  /**
   * 确保配置已加载：已加载直接返回，加载中复用同一个请求，失败不抛（下次会重试）。
   */
  async function ensureLoaded(): Promise<void> {
    if (globalStyle.value || pending)
      return pending ?? undefined
    pending = getResumeConfig()
      .then((res) => {
        globalStyle.value = res?.globalStyle ?? {}
        modelStyle.value = res?.modelStyle ?? {}
        feedbackSheet.value = res?.feedbackSheet ?? null
      })
      .catch((err) => {
        console.error('载入简历前端配置失败:', err)
      })
      .finally(() => {
        pending = null
      })
    return pending
  }

  return {
    globalStyle,
    modelStyle,
    feedbackSheet,
    ensureLoaded,
  }
})
