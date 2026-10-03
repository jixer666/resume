<script lang="ts" setup>
import type { IMATERIALITEM } from '@/interface/material'
import MODEL_DATA_JSON from '@/schema/modelData'
import { DEFAULT_RESUME_NAME, useResumeStore } from '@/store/resume'
import { formatDate } from '@/utils/common'
import { showToast } from '@/utils/toast'

/**
 * 简历编辑入口：顶部简历名 + 保存态、一张滚动的模块清单、底部常驻三入口 + 三个底部弹层。
 *
 * 页面本身不写死模块清单，而是遍历 COMPONENTS 逐个渲染 —— 模块管理里新加的任何模块
 * 都会立刻出现编辑入口。改动即时落 store（子页改的是同一份 JSON），没有「保存」按钮。
 *
 * 本页只负责「编辑一份已经存在的简历」：带 `?id=` 载入指定简历，不带参数续编辑最近一份；
 * 载入失败给错误态 + 重试，一份都没有给空态引导去模板库 —— 绝不在这里新建。
 * 新建的唯一入口是模板详情页「使用模板」：先在后端创建、拿到主键，再带着 `?id=` 进本页。
 *
 * 形态对标 resume-app-temp 的 resume-edit（任务文档 §4）：手机端一屏一列，
 * 排序只用上移 / 下移按钮，不引入拖拽。
 */
defineOptions({ name: 'ResumeEdit' })
definePage({
  style: {
    navigationBarTitleText: '简历编辑',
  },
})

/** 列表类模块：数据在 data.LIST，逐条进 experience 子页编辑 */
const LIST_MODELS: string[] = [
  'EDU_BACKGROUND',
  'WORK_EXPERIENCE',
  'PROJECT_EXPERIENCE',
  'INTERNSHIP_EXPERIENCE',
  'CAMPUS_EXPERIENCE',
  'AWARDS',
  'WORKS_DISPLAY',
]
/** 文本类模块：一整段富文本，进 text 子页编辑 */
const TEXT_MODELS: string[] = ['SELF_EVALUATION', 'HOBBIES', 'SKILL_SPECIALTIES']

/** 条目卡片第一行取哪个字段（字段名对齐 resume-design 的数据模型） */
const ENTRY_PRIMARY: Record<string, string> = {
  EDU_BACKGROUND: 'schoolName',
  WORK_EXPERIENCE: 'companyName',
  PROJECT_EXPERIENCE: 'projectName',
  INTERNSHIP_EXPERIENCE: 'companyName',
  CAMPUS_EXPERIENCE: 'campusBriefly',
  AWARDS: 'awardsName',
  WORKS_DISPLAY: 'worksName',
}
/** 条目卡片第二行按顺序拼接展示的字段 */
const ENTRY_SECONDARY: Record<string, string[]> = {
  EDU_BACKGROUND: ['specialized', 'degree', 'date'],
  WORK_EXPERIENCE: ['posts', 'date'],
  PROJECT_EXPERIENCE: ['posts', 'date'],
  INTERNSHIP_EXPERIENCE: ['posts', 'date'],
  CAMPUS_EXPERIENCE: ['campusDuty', 'date'],
  AWARDS: ['awardsGrade', 'date'],
  WORKS_DISPLAY: ['worksLink'],
}

const store = useResumeStore()
const resume = computed(() => store.current)
const components = computed(() => resume.value?.COMPONENTS || [])

/** 底部弹层：简历设置、编辑名称、模块管理、全局样式 */
const showSettingSheet = ref(false)
const showNameSheet = ref(false)
const showModuleSheet = ref(false)
const showGlobalStyle = ref(false)
/** 名称弹层的草稿，确认后才写回简历 */
const nameDraft = ref('')

/**
 * 本页要载入的简历主键：空串表示「续编辑最近一份」。
 * 载入成功前不放行 onShow 的自动保存，否则会把上一份草稿存成新记录。
 */
const inited = ref(false)
/** 正在载入：铺骨架屏，避免先闪一下上一份持久化草稿 */
const loading = ref(true)
/** 载入失败 / 简历不存在：非空时页面只渲染错误态，绝不新建 */
const loadError = ref('')
/** 本次载入是否已经拿到可编辑的内容：空态与错误态的区分依据 */
const ready = ref(false)
/** 载入失败后的重试入口用的查询参数 */
const pageId = ref('')

/**
 * 载入当前简历，三种结果分开处理：
 *
 * - 成功：进入可编辑状态；
 * - 后端确实没有这份简历（返回 null）→ 错误态「不存在或已删除」；
 * - 请求失败（断网 / 401 / 404）→ 错误态 + 重试。
 *
 * 后两种都不新建 —— 用户点的是具体某份简历，失败时不能替他做「新建」的决定
 * （旧实现在 catch 里无条件 createResume + autoSave，会把载入失败变成一份新的空简历）。
 */
async function load() {
  loading.value = true
  loadError.value = ''
  ready.value = false
  try {
    if (pageId.value) {
      const json = await store.loadResume(pageId.value)
      if (!json)
        loadError.value = '这份简历不存在或已被删除'
      else
        ready.value = true
      return
    }
    // 没有指定 id 时优先续编辑最近一份，避免每次进页面都新建出一堆空简历
    await store.fetchList()
    const latest = store.list[0]
    if (!latest)
      return
    const json = await store.loadResume(String(latest.id))
    if (!json)
      loadError.value = '简历载入失败，请重试'
    else
      ready.value = true
  }
  catch (error) {
    console.error('载入简历失败:', error)
    loadError.value = pageId.value ? '简历载入失败，请重试' : '简历列表载入失败，请重试'
  }
  finally {
    // 载入结束（成功 / 失败）才放行 onShow 的自动保存
    inited.value = true
    loading.value = false
  }
}

onLoad((query) => {
  pageId.value = query?.id ? String(query.id) : ''
  load()
})

onShow(() => {
  // 子页改的是同一份 JSON，返回本页时统一落库；载入没跑完 / 载入失败时跳过（见 inited / loadError）
  if (inited.value && !loadError.value)
    autoSave()
})

/** 错误态「重试」：重新走一遍载入流程 */
function retryLoad() {
  load()
}

/** 空态 / 错误态的兜底出口：回模板库挑一个版式（tab 页之间只能 switchTab） */
function goTemplates() {
  uni.switchTab({ url: '/pages/index/index' })
}

/**
 * 自动保存：把当前 JSON 同步到后端。
 *
 * 失败只记日志、不打断编辑（内容没改过时 store 内部会跳过，不会每次回页都发请求）。
 */
function autoSave() {
  store.saveCurrent().catch((error) => {
    console.error('保存简历失败:', error)
  })
}

/** 模块标题：优先取数据里的 title，再退回模块默认名 */
function moduleTitle(item: IMATERIALITEM): string {
  const title = (item.data as { title?: string } | undefined)?.title
  return String(title || MODEL_DATA_JSON[item.model]?.title || item.cptTitle || '模块')
}

function isListModel(model: string) {
  return LIST_MODELS.includes(model)
}

function isTextModel(model: string) {
  return TEXT_MODELS.includes(model)
}

/** 列表类模块的条目集合 */
function entriesOf(item: IMATERIALITEM): Record<string, unknown>[] {
  return (item.data as { LIST?: Record<string, unknown>[] } | undefined)?.LIST || []
}

/** 文本类模块的内容（富文本 HTML，摘要展示时剥掉标签） */
function contentOf(item: IMATERIALITEM): string {
  return stripHtml(String((item.data as { content?: string } | undefined)?.content || ''))
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** 取条目字段值：时间区间交给 formatDate，其余数组用空格拼接 */
function fieldOf(entry: Record<string, unknown>, key: string): string {
  const value = entry[key]
  if (key === 'date')
    return formatDate(value as string | string[] | undefined)
  if (Array.isArray(value))
    return value.filter(Boolean).join(' ')
  return value ? String(value) : ''
}

function entryPrimary(entry: Record<string, unknown>, model: string): string {
  return fieldOf(entry, ENTRY_PRIMARY[model] || '') || '未填写'
}

function entrySecondary(entry: Record<string, unknown>, model: string): string {
  return (ENTRY_SECONDARY[model] || []).map(key => fieldOf(entry, key)).filter(Boolean).join(' · ')
}

/** 非列表模块的卡片摘要（基本信息 / 简历标题 / 求职意向 / 自定义模块） */
function summaryOf(item: IMATERIALITEM): { primary: string, secondary: string } {
  const data = (item.data || {}) as Record<string, unknown>
  const joined = (...keys: string[]) => keys.map(key => data[key]).filter(Boolean).join(' · ')
  switch (item.model) {
    case 'BASE_INFO':
      return {
        primary: String(data.name || '点击填写个人信息'),
        secondary: joined('phoneNumber', 'email') || '姓名、电话、邮箱等',
      }
    case 'RESUME_TITLE':
      return {
        primary: String(data.title || '点击填写简历大标题'),
        secondary: '通常填姓名，会显示在简历顶部',
      }
    case 'JOB_INTENTION':
      return {
        primary: String(data.intendedPositions || '点击填写求职意向'),
        secondary: joined('intendedCity', 'expectSalary', 'jobStatus', 'jobSearchType') || '期望职位、城市、薪资等',
      }
    default:
      return {
        primary: String(data.name || data.title || '点击填写'),
        secondary: '',
      }
  }
}

/** 模块清单的视图模型：标题、形态与卡片文案一次算好，模板里不再重复调用函数 */
interface IModuleView {
  item: IMATERIALITEM
  title: string
  kind: 'list' | 'text' | 'form'
  entries: { index: number, primary: string, secondary: string }[]
  excerpt: string
  primary: string
  secondary: string
}

const moduleViews = computed<IModuleView[]>(() => components.value.map((item): IModuleView => {
  const title = moduleTitle(item)
  if (isListModel(item.model)) {
    return {
      item,
      title,
      kind: 'list',
      entries: entriesOf(item).map((entry, index) => ({
        index,
        primary: entryPrimary(entry, item.model),
        secondary: entrySecondary(entry, item.model),
      })),
      excerpt: '',
      primary: '',
      secondary: '',
    }
  }
  if (isTextModel(item.model))
    return { item, title, kind: 'text', entries: [], excerpt: contentOf(item), primary: '', secondary: '' }
  const summary = summaryOf(item)
  return { item, title, kind: 'form', entries: [], excerpt: '', primary: summary.primary, secondary: summary.secondary }
}))

function openRoute(path: string, params: Record<string, string | number> = {}) {
  const query = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
  uni.navigateTo({ url: query ? `${path}?${query}` : path })
}

/** 点击模块卡片：基本信息走 basic，自定义等短表单走 form */
function openModule(item: IMATERIALITEM) {
  if (item.model === 'BASE_INFO')
    openRoute('/pages/edit/basic', { keyId: item.keyId })
  else openRoute('/pages/edit/form', { keyId: item.keyId })
}

/** 打开列表类模块的某一条：index 传 -1 表示新增 */
function openEntry(item: IMATERIALITEM, index: number) {
  openRoute('/pages/edit/experience', { keyId: item.keyId, index })
}

/** 打开文本类模块 */
function openText(item: IMATERIALITEM) {
  openRoute('/pages/edit/text', { keyId: item.keyId })
}

/** 顶部保存态文案：让用户知道改动有没有落库 */
const saveText = computed(() => {
  switch (store.saveState) {
    case 'saving':
      return '保存中…'
    case 'error':
      return '保存失败，点击重试'
    default:
      return '已保存'
  }
})

/** 保存失败时点一下保存态文案重试 */
function retrySave() {
  if (store.saveState === 'error')
    autoSave()
}

/** 删除列表类模块的一条（已确认） */
function removeEntry(item: IMATERIALITEM, index: number) {
  entriesOf(item).splice(index, 1)
  autoSave()
}

/** 清空文本类模块的内容（已确认） */
function clearContent(item: IMATERIALITEM) {
  const data = item.data as { content?: string } | undefined
  if (data)
    data.content = ''
  autoSave()
}

/** 删除一条经历 / 作品：误触代价高，先确认再删（与删除简历保持一致） */
function confirmRemoveEntry(item: IMATERIALITEM, index: number) {
  uni.showModal({
    title: '删除这条内容',
    content: '删除后无法恢复，确定删除吗？',
    confirmColor: '#ef4444',
    success: ({ confirm }) => {
      if (confirm)
        removeEntry(item, index)
    },
  })
}

/** 清空文本模块正文：同样先确认 */
function confirmClearContent(item: IMATERIALITEM) {
  uni.showModal({
    title: `清空${moduleTitle(item)}`,
    content: '清空后无法恢复，确定清空吗？',
    confirmColor: '#ef4444',
    success: ({ confirm }) => {
      if (confirm)
        clearContent(item)
    },
  })
}

/** 进预览页：先落库，预览页读的仍是 store 里这份 JSON */
function preview() {
  autoSave()
  openRoute('/pages/edit/preview')
}

/** 打开名称编辑弹层，带入当前名称 */
function openNameSheet() {
  showSettingSheet.value = false
  nameDraft.value = resume.value?.NAME || ''
  showNameSheet.value = true
}

/** 确认名称：空名字回退到默认名 */
function confirmName() {
  if (!resume.value)
    return
  resume.value.NAME = nameDraft.value.trim() || DEFAULT_RESUME_NAME
  autoSave()
  showNameSheet.value = false
}

/** 打开全局样式面板：先收起简历设置，避免两个弹层叠在一起 */
function openGlobalStyle() {
  showSettingSheet.value = false
  showGlobalStyle.value = true
}

/** 关闭全局样式面板：各项改动已经落 store，这里统一落库 */
function closeGlobalStyle() {
  showGlobalStyle.value = false
  autoSave()
}

/** 关闭模块管理弹层：面板内的改动已经落 store，这里统一落库 */
function closeModuleManager() {
  showModuleSheet.value = false
  autoSave()
}

/** 删除当前简历，回不到编辑页就退回上一页 */
function confirmDelete() {
  const id = resume.value?.ID
  showSettingSheet.value = false
  if (!id)
    return
  uni.showModal({
    title: '删除简历',
    content: '删除后无法恢复，确定删除这份简历吗？',
    confirmColor: '#ef4444',
    success: (res) => {
      if (!res.confirm)
        return
      store.removeResume(id)
        .then(() => {
          showToast({ title: '已删除' })
          setTimeout(() => uni.navigateBack(), 300)
        })
        .catch((error) => {
          console.error('删除简历失败:', error)
        })
    },
  })
}
</script>

<template>
  <view class="page">
    <!-- 载入中：骨架屏，避免先闪上一份持久化草稿或空态 -->
    <view v-if="loading" class="skeletons">
      <view class="skeleton skeleton--bar" />
      <view v-for="n in 3" :key="n" class="skeleton-group">
        <view class="skeleton skeleton--title" />
        <view class="skeleton skeleton--card" />
        <view class="skeleton skeleton--card" />
      </view>
    </view>

    <!-- 载入失败 / 简历不存在：给重试入口，绝不在这里新建 -->
    <view v-else-if="loadError" class="state">
      <text class="state-title">载入失败</text>
      <text class="state-desc">{{ loadError }}</text>
      <view class="retry" hover-class="retry-press" @click="retryLoad">
        重试
      </view>
      <text class="state-link" @click="goTemplates">
        或回模板库重新选一个
      </text>
    </view>

    <scroll-view v-else-if="ready && resume" scroll-y class="page__scroll">
      <!-- 简历名 + 保存态：白底吸顶，与三页的吸顶栏同一形态 -->
      <view class="topbar">
        <text class="topbar-name">{{ resume.NAME || DEFAULT_RESUME_NAME }}</text>
        <text
          class="topbar-state"
          :class="{ 'topbar-state--error': store.saveState === 'error' }"
          @click="retrySave"
        >
          {{ saveText }}
        </text>
      </view>

      <view class="modules">
        <view v-for="view in moduleViews" :key="view.item.keyId" class="section">
          <view class="section-head">
            <view class="section-bar" />
            <text class="section-name">{{ view.title }}</text>
            <text
              v-if="view.kind === 'list'"
              class="section-action section-action--add"
              @click.stop="openEntry(view.item, -1)"
            >
              ＋ 添加
            </text>
            <text
              v-else-if="view.kind === 'text' && view.excerpt"
              class="section-action section-action--danger"
              @click.stop="confirmClearContent(view.item)"
            >
              删除
            </text>
          </view>

          <template v-if="view.kind === 'list'">
            <view
              v-for="entry in view.entries"
              :key="entry.index"
              class="card"
              hover-class="card--press"
              @click="openEntry(view.item, entry.index)"
            >
              <view class="item-main">
                <text class="primary">{{ entry.primary }}</text>
                <text v-if="entry.secondary" class="secondary">{{ entry.secondary }}</text>
              </view>
              <view class="item-actions">
                <text class="chip-danger" @click.stop="confirmRemoveEntry(view.item, entry.index)">删除</text>
                <text class="arrow">›</text>
              </view>
            </view>
            <view
              v-if="!view.entries.length"
              class="card card--empty"
              hover-class="card--press"
              @click="openEntry(view.item, -1)"
            >
              ＋ 添加{{ view.title }}
            </view>
          </template>

          <view
            v-else-if="view.kind === 'text'"
            class="card"
            hover-class="card--press"
            @click="openText(view.item)"
          >
            <text class="excerpt">{{ view.excerpt || `点击填写${view.title}` }}</text>
            <text class="arrow">›</text>
          </view>

          <view v-else class="card" hover-class="card--press" @click="openModule(view.item)">
            <view class="item-main">
              <text class="primary">{{ view.primary }}</text>
              <text class="secondary">{{ view.secondary }}</text>
            </view>
            <text class="arrow">›</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 一份简历都没有：空态引导去模板库 -->
    <view v-else class="state">
      <text class="state-title">还没有简历</text>
      <text class="state-desc">从模板开始，创建你的第一份简历</text>
      <view class="retry" hover-class="retry-press" @click="goTemplates">
        去模板库挑一个
      </view>
    </view>

    <view v-if="ready && resume" class="footer">
      <view class="tab" hover-class="tab--press" @click="preview">
        <mp-icon name="ui-view" color="#64748b" size="24px" />
        <text class="tab-text">简历预览</text>
      </view>
      <view class="tab" hover-class="tab--press" @click="showModuleSheet = true">
        <mp-icon name="ui-list" color="#64748b" size="24px" />
        <text class="tab-text">模块管理</text>
      </view>
      <view class="tab" hover-class="tab--press" @click="showSettingSheet = true">
        <mp-icon name="ui-pen" color="#64748b" size="24px" />
        <text class="tab-text">设置</text>
      </view>
    </view>

    <view v-if="showSettingSheet" class="mask">
      <view class="mask__backdrop" @click="showSettingSheet = false" />
      <view class="sheet" @click.stop>
        <text class="sheet-title">{{ resume?.NAME || DEFAULT_RESUME_NAME }}</text>
        <text class="sheet-sub">共 {{ components.length }} 个模块</text>
        <view class="sheet-item" hover-class="sheet-item--press" @click="openNameSheet">
          <mp-icon name="ui-pen" color="#2563eb" size="30px" />
          <text class="sheet-text">编辑名称</text>
        </view>
        <view class="sheet-item sheet-item--danger" hover-class="sheet-item--press" @click="confirmDelete">
          <mp-icon name="ui-trash" color="#ef4444" size="30px" />
          <text class="sheet-text">删除简历</text>
        </view>
        <view class="sheet-cancel" hover-class="sheet-cancel--press" @click="showSettingSheet = false">
          取消
        </view>
      </view>
    </view>

    <view v-if="showNameSheet" class="mask">
      <view class="mask__backdrop" @click="showNameSheet = false" />
      <view class="sheet" @click.stop>
        <text class="sheet-title">编辑名称</text>
        <input
          class="sheet-input"
          type="text"
          :value="nameDraft"
          :maxlength="20"
          placeholder="给简历起个名字"
          placeholder-class="sheet-placeholder"
          @input="nameDraft = $event.detail.value"
        >
        <view class="sheet-actions">
          <view class="sheet-btn sheet-btn--ghost" hover-class="sheet-cancel--press" @click="showNameSheet = false">
            取消
          </view>
          <view class="sheet-btn sheet-btn--primary" hover-class="sheet-btn--press" @click="confirmName">
            确定
          </view>
        </view>
      </view>
    </view>

    <module-manager-sheet
      :visible="showModuleSheet"
      @close="closeModuleManager"
      @change="autoSave"
    />
    <editor-style-sheet :visible="showGlobalStyle" :show-module-tab="false" @close="closeGlobalStyle" />
  </view>
</template>

<style scoped lang="scss">
@import '../../style/editor-sheet.scss';

.page {
  height: 100vh;
  background-color: #f5f6f8;
}

.page__scroll {
  height: 100%;
}

/* 简历名 + 保存态：白底吸顶，与首页筛选栏同一形态 */
.topbar {
  position: sticky;
  z-index: 10;
  top: 0;
  display: flex;
  align-items: center;
  height: 44px;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #eef0f3;
  background-color: #fff;
}

.topbar-name {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  color: #1f2329;
  font-size: 14px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.topbar-state {
  flex: none;
  margin-left: 10px;
  color: #8f959e;
  font-size: 12px;
}

.topbar-state--error {
  color: #ef4444;
}

.modules {
  box-sizing: border-box;
  padding: 14px 16px;
  /* 底栏高度约 97px，再加 iPhone 底部安全区，留足空间避免最后的模块被盖住 */
  padding-bottom: calc(96px + env(safe-area-inset-bottom));
}

.section-head {
  display: flex;
  align-items: center;
  margin: 0 2px 10px;
}

.section-bar {
  width: 4px;
  height: 15px;
  margin-right: 8px;
  border-radius: 2px;
  background-color: var(--wot-color-theme, #2563eb);
}

.section-name {
  color: #172b4d;
  font-size: 16px;
  font-weight: 700;
}

.section-action {
  margin-left: auto;
  padding: 3px 10px;
  border-radius: 11px;
  font-size: 12px;

  &--add {
    background-color: #e8f0ff;
    color: var(--wot-color-theme, #2563eb);
  }

  &--danger {
    background-color: #fef2f2;
    color: #ef4444;
  }
}

.card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  margin-bottom: 10px;
  padding: 15px 16px;
  border-radius: 8px;
  background-color: #fff;

  &--press {
    background-color: #f6f9ff;
  }

  &--empty {
    justify-content: center;
    border: 1px dashed #bfd7f7;
    background-color: #f7faff;
    color: var(--wot-color-theme, #2563eb);
    font-size: 13px;
  }
}

.item-main {
  min-width: 0;
  flex: 1;
}

.primary {
  display: block;
  overflow: hidden;
  color: #172b4d;
  font-size: 15px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.secondary {
  display: block;
  margin-top: 6px;
  overflow: hidden;
  color: #8290a5;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.excerpt {
  display: -webkit-box;
  overflow: hidden;
  color: #596273;
  font-size: 14px;
  line-height: 22px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.item-actions {
  display: flex;
  align-items: center;
  margin-left: 12px;
}

.chip-danger {
  padding: 3px 10px;
  border-radius: 11px;
  background-color: #fef2f2;
  color: #ef4444;
  font-size: 12px;
}

.arrow {
  margin-left: 10px;
  color: #c0c9d6;
  font-size: 22px;
  line-height: 1;
}

/* 载入失败 / 空态：与首页同一套 state + retry 形态 */
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 96px 32px 0;
}

.state-title {
  color: #1f2329;
  font-size: 15px;
  font-weight: 500;
}

.state-desc {
  margin-top: 8px;
  color: #8f959e;
  font-size: 13px;
  text-align: center;
}

.state-link {
  margin-top: 14px;
  color: #8f959e;
  font-size: 12px;
  text-decoration: underline;
}

.retry {
  margin-top: 20px;
  padding: 8px 24px;
  border: 1px solid var(--wot-color-theme, #2563eb);
  border-radius: 6px;
  color: var(--wot-color-theme, #2563eb);
  font-size: 13px;
}

.retry-press {
  background-color: #f0f5ff;
}

/* -------- 骨架屏（与三页同一套呼吸动画） -------- */
.skeletons {
  padding: 14px 16px;
}

.skeleton {
  background-color: #e9ebee;
  animation: skeleton-pulse 1.2s ease-in-out infinite;
}

.skeleton--bar {
  height: 44px;
  margin: -14px -16px 14px;
  border-radius: 0;
}

.skeleton-group {
  margin-bottom: 18px;
}

.skeleton--title {
  width: 30%;
  height: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
}

.skeleton--card {
  height: 54px;
  margin-bottom: 10px;
  border-radius: 8px;
}

.footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
  background-color: #fff;
  box-shadow: 0 -6px 18px rgb(23 43 77 / 8%);
  z-index: 1000;
}

.tab {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px 0;
  border-radius: 12px;

  &--press {
    background-color: #f1f5f9;
  }
}

.tab-text {
  margin-top: 3px;
  color: #64748b;
  font-size: 12px;
}
</style>

<style lang="scss">
@keyframes sheet-up {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }
}
</style>
