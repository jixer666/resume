<script lang="ts" setup>
import type { IMATERIALITEM } from '@/interface/material'
import MODEL_DATA_JSON from '@/schema/modelData'
import { MATERIAL_JSON } from '@/schema/materialList'
import { DEFAULT_RESUME_NAME, useResumeStore } from '@/store/resume'
import { formatDate } from '@/utils/common'

/**
 * 简历编辑入口：一张滚动的模块清单 + 底部常驻三入口 + 三个底部弹层。
 *
 * 页面本身不写死模块清单，而是遍历 COMPONENTS 逐个渲染 —— 模块管理里新加的任何模块
 * 都会立刻出现编辑入口。改动即时落 store（子页改的是同一份 JSON），没有「保存」按钮。
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
  'SKILL_SPECIALTIES',
  'AWARDS',
  'WORKS_DISPLAY',
]
/** 文本类模块：一整段富文本，进 text 子页编辑 */
const TEXT_MODELS: string[] = ['SELF_EVALUATION', 'HOBBIES']

/** 条目卡片第一行取哪个字段（字段名对齐 resume-design 的数据模型） */
const ENTRY_PRIMARY: Record<string, string> = {
  EDU_BACKGROUND: 'schoolName',
  WORK_EXPERIENCE: 'companyName',
  PROJECT_EXPERIENCE: 'projectName',
  INTERNSHIP_EXPERIENCE: 'companyName',
  CAMPUS_EXPERIENCE: 'campusBriefly',
  SKILL_SPECIALTIES: 'skillName',
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
  SKILL_SPECIALTIES: ['proficiency'],
  AWARDS: ['awardsGrade', 'date'],
  WORKS_DISPLAY: ['worksLink'],
}

const store = useResumeStore()
const resume = computed(() => store.current)
const components = computed(() => resume.value?.COMPONENTS || [])

/** 底部弹层：简历设置、编辑名称、模块管理、全局样式、模块设置 */
const showSettingSheet = ref(false)
const showNameSheet = ref(false)
const showModuleSheet = ref(false)
const showGlobalStyle = ref(false)
const showModuleSetting = ref(false)
/** 模块设置面板当前操作的模块 keyId */
const settingKeyId = ref('')
/** 名称弹层的草稿，确认后才写回简历 */
const nameDraft = ref('')

/** 全部可新增的模块（按物料清单去重，自定义模块的 3 套皮肤各算一个） */
const allModels = computed(() => {
  const models: string[] = []
  Object.values(MATERIAL_JSON).forEach((list) => {
    list.forEach((one) => {
      if (!models.includes(one.model))
        models.push(one.model)
    })
  })
  return models
})
/** 还能新增的模块：同一类模块一份简历里只放一个 */
const addableModels = computed(() => {
  const used = components.value.map(one => one.model)
  return allModels.value.filter(model => !used.includes(model))
})

onLoad(async (query) => {
  const id = query?.id ? String(query.id) : ''
  // 模板详情页「使用该模板」带来的模板标识，套用它的版式与样式
  const templateId = query?.template ? String(query.template) : ''
  // 首页 / 我的页「新建简历」会带 new=1，否则会被下面的「续编辑最近一份」劫持
  const isNew = query?.new === '1' || !!templateId
  try {
    if (!isNew && id && await store.loadResume(id))
      return
    // 没有指定 id 时优先续编辑最近一份，避免每次进页面都新建出一堆空简历
    if (!isNew && !id) {
      await store.fetchList()
      const latest = store.list[0]
      if (latest && await store.loadResume(String(latest.id)))
        return
    }
  }
  catch (error) {
    console.error('载入简历失败:', error)
  }
  store.createResume(templateId || undefined)
})

onShow(() => {
  // 子页改的是同一份 JSON，返回本页时统一落库
  autoSave()
})

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
        secondary: joined('phoneNumber', 'email', 'abstract') || '姓名、电话、邮箱等',
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
        secondary: String(data.abstract || ''),
      }
  }
}

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

/** 删除列表类模块的一条 */
function removeEntry(item: IMATERIALITEM, index: number) {
  entriesOf(item).splice(index, 1)
  autoSave()
}

/** 清空文本类模块的内容 */
function clearContent(item: IMATERIALITEM) {
  const data = item.data as { content?: string } | undefined
  if (data)
    data.content = ''
  autoSave()
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

/** 打开某个模块的设置面板（皮肤选择 + 可编辑时改标题） */
function openModuleSetting(item: IMATERIALITEM) {
  settingKeyId.value = item.keyId
  showModuleSetting.value = true
}

function closeModuleSetting() {
  showModuleSetting.value = false
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
          uni.showToast({ title: '已删除', icon: 'none' })
          setTimeout(() => uni.navigateBack(), 300)
        })
        .catch((error) => {
          console.error('删除简历失败:', error)
        })
    },
  })
}

function toggleModule(item: IMATERIALITEM) {
  store.toggleModule(item.keyId)
  autoSave()
}

function moveModule(from: number, to: number) {
  store.moveModule(from, to)
  autoSave()
}

function removeModule(item: IMATERIALITEM) {
  store.removeModule(item.keyId)
  autoSave()
}

function addModule(model: string) {
  store.addModule(model)
  autoSave()
}
</script>

<template>
  <view class="page">
    <scroll-view v-if="resume" scroll-y class="page__scroll">
      <view class="modules">
        <view v-for="item in components" :key="item.keyId" class="section">
          <view class="section-head">
            <view class="section-bar" />
            <text class="section-name">{{ moduleTitle(item) }}</text>
            <text
              v-if="isListModel(item.model)"
              class="section-action section-action--add"
              @click.stop="openEntry(item, -1)"
            >
              ＋ 添加
            </text>
            <text
              v-else-if="isTextModel(item.model) && contentOf(item)"
              class="section-action section-action--danger"
              @click.stop="clearContent(item)"
            >
              删除
            </text>
          </view>

          <template v-if="isListModel(item.model)">
            <view
              v-for="(entry, index) in entriesOf(item)"
              :key="index"
              class="card"
              hover-class="card--press"
              @click="openEntry(item, index)"
            >
              <view class="item-main">
                <text class="primary">{{ entryPrimary(entry, item.model) }}</text>
                <text v-if="entrySecondary(entry, item.model)" class="secondary">{{ entrySecondary(entry, item.model) }}</text>
              </view>
              <view class="item-actions">
                <text class="chip-danger" @click.stop="removeEntry(item, index)">删除</text>
                <text class="arrow">›</text>
              </view>
            </view>
            <view
              v-if="!entriesOf(item).length"
              class="card card--empty"
              hover-class="card--press"
              @click="openEntry(item, -1)"
            >
              ＋ 添加{{ moduleTitle(item) }}
            </view>
          </template>

          <view
            v-else-if="isTextModel(item.model)"
            class="card"
            hover-class="card--press"
            @click="openText(item)"
          >
            <text class="excerpt">{{ contentOf(item) || `点击填写${moduleTitle(item)}` }}</text>
            <text class="arrow">›</text>
          </view>

          <view v-else class="card" hover-class="card--press" @click="openModule(item)">
            <view class="item-main">
              <text class="primary">{{ summaryOf(item).primary }}</text>
              <text class="secondary">{{ summaryOf(item).secondary }}</text>
            </view>
            <text class="arrow">›</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <view v-else class="empty">
      <text class="empty-text">暂无可编辑的简历</text>
    </view>

    <view v-if="resume" class="footer">
      <view class="tab" hover-class="tab--press" @click="preview">
        <mp-icon name="ui-view" color="#64748b" size="30px" />
        <text class="tab-text">简历预览</text>
      </view>
      <view class="tab" hover-class="tab--press" @click="showModuleSheet = true">
        <mp-icon name="ui-list" color="#64748b" size="30px" />
        <text class="tab-text">模块管理</text>
      </view>
      <view class="tab" hover-class="tab--press" @click="showSettingSheet = true">
        <mp-icon name="ui-edit" color="#64748b" size="30px" />
        <text class="tab-text">编辑</text>
      </view>
    </view>

    <view v-if="showSettingSheet" class="mask" @click="showSettingSheet = false">
      <view class="sheet" @click.stop>
        <text class="sheet-title">{{ resume?.NAME || DEFAULT_RESUME_NAME }}</text>
        <text class="sheet-sub">共 {{ components.length }} 个模块</text>
        <view class="sheet-item" hover-class="sheet-item--press" @click="openNameSheet">
          <mp-icon name="ui-pen" color="#0957de" size="30px" />
          <text class="sheet-text">编辑名称</text>
        </view>
        <view class="sheet-item" hover-class="sheet-item--press" @click="openGlobalStyle">
          <mp-icon name="ui-palette" color="#0957de" size="30px" />
          <text class="sheet-text">全局样式</text>
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

    <view v-if="showNameSheet" class="mask" @click="showNameSheet = false">
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

    <view v-if="showModuleSheet" class="mask" @click="showModuleSheet = false">
      <view class="sheet sheet--tall" @click.stop>
        <text class="sheet-title">模块管理</text>
        <scroll-view scroll-y class="sheet-scroll">
          <view
            v-for="(item, index) in components"
            :key="item.keyId"
            class="module-row"
            :class="{ 'module-row--off': !item.show }"
          >
            <view class="module-main" hover-class="module-main--press" @click="openModuleSetting(item)">
              <text class="module-name">{{ moduleTitle(item) }}</text>
              <text class="module-state">{{ item.show ? '显示中' : '已隐藏' }}</text>
            </view>
            <view class="module-acts">
              <view class="icon-btn" hover-class="icon-btn--press" @click="moveModule(index, index - 1)">
                <mp-icon name="ui-up" color="#64748b" size="26px" />
              </view>
              <view class="icon-btn" hover-class="icon-btn--press" @click="moveModule(index, index + 1)">
                <mp-icon name="ui-down" color="#64748b" size="26px" />
              </view>
              <view class="icon-btn" hover-class="icon-btn--press" @click="toggleModule(item)">
                <mp-icon :name="item.show ? 'ui-view' : 'ui-view-off'" color="#64748b" size="26px" />
              </view>
              <view class="icon-btn" hover-class="icon-btn--press" @click="removeModule(item)">
                <mp-icon name="ui-trash" color="#ef4444" size="26px" />
              </view>
            </view>
          </view>
          <view v-if="addableModels.length" class="add-grid">
            <view
              v-for="model in addableModels"
              :key="model"
              class="add-chip"
              hover-class="add-chip--press"
              @click="addModule(model)"
            >
              ＋ {{ MODEL_DATA_JSON[model]?.title || model }}
            </view>
          </view>
          <text v-else class="module-empty">
            全部模块都已添加
          </text>
        </scroll-view>
      </view>
    </view>

    <module-setting-sheet :visible="showModuleSetting" :key-id="settingKeyId" @close="closeModuleSetting" />
    <global-style-sheet :visible="showGlobalStyle" @close="closeGlobalStyle" />
  </view>
</template>

<style scoped lang="scss">
@import '../../style/editor-sheet.scss';

.page {
  height: 100vh;
  background-color: #f4f4f4;
}

.page__scroll {
  height: 100%;
}

.modules {
  box-sizing: border-box;
  padding: 14px 16px 96px;
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
  background-color: var(--wot-color-theme, #0957de);
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
    color: var(--wot-color-theme, #0957de);
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
    color: var(--wot-color-theme, #0957de);
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

.empty {
  padding-top: 200rpx;
  text-align: center;
}

.empty-text {
  color: #909399;
  font-size: 28rpx;
}

.footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  padding: 8px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
  background-color: #fff;
  box-shadow: 0 -6px 18px rgb(23 43 77 / 8%);
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
  font-size: 10px;
}

.module-row {
  display: flex;
  align-items: center;
  margin-top: 8px;
  padding: 12px 14px;
  border-radius: 12px;
  background-color: #f8fafc;

  &--off {
    opacity: 0.55;
  }
}

.module-main {
  min-width: 0;
  flex: 1;

  &--press {
    opacity: 0.6;
  }
}

.module-name {
  display: block;
  overflow: hidden;
  color: #172b4d;
  font-size: 14px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.module-state {
  display: block;
  margin-top: 4px;
  color: #94a3b8;
  font-size: 11px;
}

.module-acts {
  display: flex;
  flex: none;
  align-items: center;
  margin-left: 10px;
}

.icon-btn {
  display: flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  border-radius: 9px;
  background-color: #fff;

  &--press {
    background-color: #e2e8f0;
  }
}

.add-grid {
  display: flex;
  flex-wrap: wrap;
  margin-top: 14px;
}

.add-chip {
  margin: 0 8px 8px 0;
  padding: 7px 12px;
  border-radius: 15px;
  background-color: #eff6ff;
  color: var(--wot-color-theme, #0957de);
  font-size: 12px;

  &--press {
    background-color: #dbeafe;
  }
}

.module-empty {
  display: block;
  margin-top: 16px;
  color: #94a3b8;
  font-size: 12px;
  text-align: center;
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
</style>
