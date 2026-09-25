import type { IResumeTemplate } from '@/schema/templates'
import { defineStore } from 'pinia'
import { getTemplateDetail, getTemplateList } from '@/api/template'

/** 每页条数 */
const PAGE_SIZE = 10

/**
 * 模板库 store：模板数据全部来自后端（分页），本地不兜底写死的模板。
 *
 * 刻意不 re-export 到 @/store/index：请求层会间接引入 @/store，
 * 把模板数据挂上去反而会拖大主包，改为按需 from '@/store/template' 引入。
 */
export const useTemplateStore = defineStore('template', () => {
  /** 已加载的模板（后端分页累加） */
  const list = ref<IResumeTemplate[]>([])
  /** 详情页当前查看的模板 */
  const current = ref<IResumeTemplate | null>(null)
  /** 首屏 / 重新加载中（页面据此铺骨架屏） */
  const loading = ref(false)
  /** 上拉加载下一页中 */
  const loadingMore = ref(false)
  /** 是否已成功加载过第一页 */
  const loaded = ref(false)
  /** 加载失败提示，空串表示没有错误 */
  const error = ref('')
  /** 当前页码 */
  const pageNum = ref(1)
  /** 后端返回的总条数 */
  const total = ref(0)
  /** 是否还有下一页 */
  const hasMore = computed(() => list.value.length < total.value)

  /**
   * 同步取模板：优先列表，其次详情页已载入的当前模板。
   *
   * 「使用模板」在 onLoad 里同步套用，不能等接口，所以留这条同步通道。
   */
  function get(code: string): IResumeTemplate | undefined {
    return list.value.find(item => item.code === code) || (current.value?.code === code ? current.value : undefined)
  }

  /** 请求某一页；append 为 true 时追加到列表尾部 */
  async function fetchPage(page: number, append: boolean): Promise<IResumeTemplate[]> {
    const res = await getTemplateList(page, PAGE_SIZE)
    const items = res?.list || []
    total.value = res?.total ?? (append ? total.value : items.length)
    list.value = append ? [...list.value, ...items] : items
    pageNum.value = page
    loaded.value = true
    return list.value
  }

  /** 首屏加载 / 重新加载：重置到第一页 */
  async function fetchList(): Promise<IResumeTemplate[]> {
    if (loading.value)
      return list.value
    loading.value = true
    error.value = ''
    try {
      await fetchPage(1, false)
    }
    catch (err) {
      console.error('载入模板列表失败:', err)
      error.value = '模板加载失败，请检查网络后重试'
    }
    finally {
      loading.value = false
    }
    return list.value
  }

  /** 上拉加载下一页 */
  async function fetchMore(): Promise<IResumeTemplate[]> {
    if (loading.value || loadingMore.value || !hasMore.value)
      return list.value
    loadingMore.value = true
    try {
      await fetchPage(pageNum.value + 1, true)
    }
    catch (err) {
      console.error('加载更多模板失败:', err)
    }
    finally {
      loadingMore.value = false
    }
    return list.value
  }

  /** 拉取模板详情：先用列表 / 已载入的当前模板兜底，详情接口回来再覆盖 */
  async function fetchDetail(code: string): Promise<IResumeTemplate | null> {
    current.value = get(code) || null
    try {
      const res = await getTemplateDetail(code)
      if (res)
        current.value = res
    }
    catch (err) {
      console.error('载入模板详情失败:', err)
      if (!current.value)
        current.value = (await fetchList()).find(item => item.code === code) || null
    }
    return current.value
  }

  return {
    list,
    current,
    loading,
    loadingMore,
    loaded,
    error,
    pageNum,
    total,
    hasMore,
    get,
    fetchList,
    fetchMore,
    fetchDetail,
  }
})
