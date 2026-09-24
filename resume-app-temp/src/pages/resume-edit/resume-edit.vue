<script setup lang="ts">
import type {
  IBaseInfoData,
  IJobIntentionData,
  IMaterialItem,
  IResumeTitleData,
  ModelName,
} from '@/schema/types'
import { DEFAULT_RESUME_NAME, materialTitle } from '@/schema/resume'
import { MODEL_TITLE } from '@/schema/modelData'
import { useResumeStore } from '@/store/resume'

/**
 * 简历编辑：直接编辑 store 里那份简历 JSON 的 COMPONENTS。
 *
 * 页面没有「保存」动作 —— 改动即时落库，子页面返回时 onShow 再兜底存一次；
 * 底部只留预览 / 模块管理 / 编辑三个入口。
 *
 * 模块区不写死模块清单，而是遍历 COMPONENTS 逐个渲染，
 * 因此模块管理里加进来的任何模块（校园经历、荣誉奖项…）都会立刻出现编辑入口。
 */
/** 列表类模块：内部是一条条记录，进 resume-experience 编辑单条 */
const LIST_MODELS: ModelName[] = [
  'EDU_BACKGROUND',
  'WORK_EXPERIENCE',
  'PROJECT_EXPERIENCE',
  'INTERNSHIP_EXPERIENCE',
  'CAMPUS_EXPERIENCE',
  'SKILL_SPECIALTIES',
  'AWARDS',
  'WORKS_DISPLAY',
]
/** 文本类模块：一整段文字，进 resume-text 编辑 */
const TEXT_MODELS: ModelName[] = ['SELF_EVALUATION', 'HOBBIES', 'CUSTOM']

/** 条目主标题字段，决定卡片第一行展示什么 */
const ENTRY_PRIMARY: Partial<Record<ModelName, string>> = {
  EDU_BACKGROUND: 'schoolName',
  WORK_EXPERIENCE: 'companyName',
  PROJECT_EXPERIENCE: 'companyName',
  INTERNSHIP_EXPERIENCE: 'companyName',
  CAMPUS_EXPERIENCE: 'campusBriefly',
  SKILL_SPECIALTIES: 'skillName',
  AWARDS: 'awardsName',
  WORKS_DISPLAY: 'worksName',
}
/** 条目副标题字段，按顺序拼接展示 */
const ENTRY_SECONDARY: Partial<Record<ModelName, string[]>> = {
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

/** 底部弹层：编辑菜单、模块管理、名称编辑 */
const showEditSheet = ref(false)
const showModuleSheet = ref(false)
const showNameSheet = ref(false)
/** 名称弹窗里的草稿，确认后才写回简历 */
const nameDraft = ref('')

onLoad((query) => {
  // 只按 id 加载；新建简历由入口页先落库再带 id 跳转，页面重建时也不会重新生成模块
  const id = query?.id ? String(query.id) : ''
  store.loadResume(id)
})

onShow(() => {
  // 子页面改的是同一份 JSON，返回本页时统一落库
  autoSave()
})

/** 自动保存：把当前 JSON 写回列表（没有改动也会刷新时间，代价可忽略） */
function autoSave() {
  store.saveCurrent()
}

/** 按模块名取模块实例 */
function moduleOf(model: ModelName): IMaterialItem | undefined {
  return resume.value?.COMPONENTS.find(item => item.model === model)
}

/** 模块管理列表：当前简历的全部模块 */
const components = computed(() => resume.value?.COMPONENTS || [])
/** 还能新增的模块：一份简历里同一类模块只放一个 */
const addableModels = computed(() =>
  (Object.keys(MODEL_TITLE) as ModelName[]).filter(model => !resume.value?.COMPONENTS.some(item => item.model === model)),
)

/** 基本信息卡片上的摘要行 */
const baseData = computed(() => moduleOf('BASE_INFO')?.data as IBaseInfoData | undefined)
const baseInfo = computed(() => moduleOf('BASE_INFO'))
const baseSummary = computed(() => {
  const data = baseData.value
  if (!data)
    return []
  return [
    data.phoneNumber ? `电话：${data.phoneNumber}` : '',
    data.email ? `邮箱：${data.email}` : '',
    data.intention ? `求职：${data.intention}` : '',
  ].filter(Boolean)
})

/** 简历标题 / 求职意向：单独的两类模块，走 resume-form 编辑 */
const resumeTitle = computed(() => moduleOf('RESUME_TITLE'))
const titleData = computed(() => resumeTitle.value?.data as IResumeTitleData | undefined)
const jobIntention = computed(() => moduleOf('JOB_INTENTION'))
const intentionData = computed(() => jobIntention.value?.data as IJobIntentionData | undefined)
const intentionSummary = computed(() => {
  const data = intentionData.value
  if (!data)
    return ''
  return [data.intendedPositions, data.intendedCity, data.expectSalary, data.jobStatus, data.jobSearchType]
    .filter(Boolean)
    .join(' · ')
})

/** 模块区要渲染的清单：按 COMPONENTS 顺序，排除已单独成块的标题 / 意向 / 基本信息 */
const contentModules = computed(() =>
  components.value.filter(item => item.model !== 'BASE_INFO' && item.model !== 'RESUME_TITLE' && item.model !== 'JOB_INTENTION'),
)

function isListModel(model: ModelName) {
  return LIST_MODELS.includes(model)
}

function isTextModel(model: ModelName) {
  return TEXT_MODELS.includes(model)
}

/** 列表类模块的条目集合 */
function listOf(item: IMaterialItem): Record<string, unknown>[] {
  const data = item.data as { LIST?: Record<string, unknown>[] } | undefined
  return data?.LIST || []
}

/** 文本类模块的内容（富文本 HTML，摘要展示时剥掉标签） */
function contentOf(item: IMaterialItem): string {
  const data = item.data as { content?: string } | undefined
  return String(data?.content || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim()
}

/** 取条目上的字段值，用于卡片摘要 */
function fieldOf(entry: Record<string, unknown>, key: string): string {
  const value = entry[key]
  if (Array.isArray(value))
    return value.filter(Boolean).join(' ')
  return value ? String(value) : ''
}

/** 条目卡片第一行 */
function entryPrimary(entry: Record<string, unknown>, model: ModelName): string {
  return fieldOf(entry, ENTRY_PRIMARY[model] || '') || '未填写'
}

/** 条目卡片第二行：把有值的副字段用 · 连起来 */
function entrySecondary(entry: Record<string, unknown>, model: ModelName): string {
  return (ENTRY_SECONDARY[model] || []).map(key => fieldOf(entry, key)).filter(Boolean).join(' · ')
}

function open(url: string) {
  uni.navigateTo({ url })
}

/** 打开列表类模块的某一条：index 传 -1 表示新增 */
function openEntry(item: IMaterialItem, index: number) {
  open(`/pages/resume-experience/resume-experience?keyId=${item.keyId}&index=${index}`)
}

/** 打开文本类模块 */
function openText(item: IMaterialItem) {
  open(`/pages/resume-text/resume-text?keyId=${item.keyId}`)
}

/** 打开基本信息 */
function openBase() {
  if (baseInfo.value)
    open(`/pages/resume-basic/resume-basic?keyId=${baseInfo.value.keyId}`)
}

/** 打开简历标题 / 求职意向 */
function openForm(item: IMaterialItem) {
  open(`/pages/resume-form/resume-form?keyId=${item.keyId}`)
}

/** 清空文本类模块的内容 */
function clearContent(item: IMaterialItem) {
  const data = item.data as { content?: string } | undefined
  if (data)
    data.content = ''
  autoSave()
}

/** 删除列表类模块的一条 */
function removeEntry(item: IMaterialItem, index: number) {
  listOf(item).splice(index, 1)
  autoSave()
}

/** 进预览页：先落库，预览页读的仍是 store 里这份 JSON */
function preview() {
  autoSave()
  uni.navigateTo({ url: '/pages/resume-preview/resume-preview' })
}

/** 打开名称编辑弹窗，带入当前名称 */
function openNameSheet() {
  showEditSheet.value = false
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

/** 删除当前简历，回不到编辑页就退回上一页 */
function confirmDelete() {
  const id = resume.value?.ID
  showEditSheet.value = false
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
      uni.showToast({ title: '已删除', icon: 'none' })
      setTimeout(() => uni.navigateBack(), 300)
    },
  })
}

/** 显示 / 隐藏模块 */
function toggleModule(item: IMaterialItem) {
  store.toggleModule(item.keyId)
  autoSave()
}

/** 上移 / 下移模块 */
function moveModule(from: number, to: number) {
  store.moveModule(from, to)
  autoSave()
}

/** 删除模块 */
function removeModule(item: IMaterialItem) {
  store.removeModule(item.keyId)
  autoSave()
}

/** 新增模块 */
function addModule(model: ModelName) {
  store.addModule(model)
  autoSave()
}
</script>

<template>
  <scroll-view scroll-y class="page">
    <view v-if="resume" class="modules">
      <view v-if="resumeTitle" class="section">
        <view class="section-head">
          <view class="section-bar" />
          <text class="section-name">简历标题</text>
        </view>
        <view class="card" hover-class="card-press" @click="openForm(resumeTitle)">
          <view class="item-main">
            <text class="primary">{{ titleData?.title || '点击填写简历大标题' }}</text>
            <text class="secondary">通常填姓名，会显示在简历顶部</text>
          </view>
          <text class="arrow">›</text>
        </view>
      </view>

      <view v-if="baseInfo" class="section">
        <view class="section-head">
          <view class="section-bar" />
          <text class="section-name">基本信息</text>
        </view>
        <view class="card" hover-class="card-press" @click="openBase">
          <view class="item-main">
            <text class="primary">{{ baseData?.name || '点击填写个人信息' }}</text>
            <text v-for="line in baseSummary" :key="line" class="secondary">{{ line }}</text>
            <text v-if="!baseData?.name && !baseSummary.length" class="secondary">姓名、电话、邮箱等</text>
          </view>
          <text class="arrow">›</text>
        </view>
      </view>

      <view v-if="jobIntention" class="section">
        <view class="section-head">
          <view class="section-bar" />
          <text class="section-name">求职意向</text>
        </view>
        <view class="card" hover-class="card-press" @click="openForm(jobIntention)">
          <view class="item-main">
            <text class="primary">{{ intentionData?.intendedPositions || '点击填写求职意向' }}</text>
            <text class="secondary">{{ intentionSummary || '期望职位、城市、薪资等' }}</text>
          </view>
          <text class="arrow">›</text>
        </view>
      </view>

      <view v-for="item in contentModules" :key="item.keyId" class="section">
        <view class="section-head">
          <view class="section-bar" />
          <text class="section-name">{{ materialTitle(item) }}</text>
          <text
            v-if="isTextModel(item.model) && contentOf(item)"
            class="section-action danger"
            @click.stop="clearContent(item)"
          >
            删除
          </text>
          <text
            v-else-if="isListModel(item.model)"
            class="section-action"
            @click.stop="openEntry(item, -1)"
          >
            ＋ 添加
          </text>
        </view>

        <template v-if="isListModel(item.model)">
          <view
            v-for="(entry, i) in listOf(item)"
            :key="i"
            class="card"
            hover-class="card-press"
            @click="openEntry(item, i)"
          >
            <view class="item-main">
              <text class="primary">{{ entryPrimary(entry, item.model) }}</text>
              <text v-if="entrySecondary(entry, item.model)" class="secondary">{{ entrySecondary(entry, item.model) }}</text>
            </view>
            <view class="item-actions">
              <text class="chip-danger" @click.stop="removeEntry(item, i)">删除</text>
              <text class="arrow">›</text>
            </view>
          </view>
          <view
            v-if="!listOf(item).length"
            class="card empty-card"
            hover-class="card-press"
            @click="openEntry(item, -1)"
          >
            ＋ 添加{{ materialTitle(item) }}
          </view>
        </template>

        <view v-else class="card" hover-class="card-press" @click="openText(item)">
          <text class="excerpt">{{ contentOf(item) || `点击填写${materialTitle(item)}` }}</text>
          <text class="arrow">›</text>
        </view>
      </view>
    </view>

    <view v-if="resume" class="footer">
      <view class="tab" hover-class="tab-press" @click="preview">
        <view class="i-carbon-view tab-icon" />
        <text class="tab-text">简历预览</text>
      </view>
      <view class="tab" hover-class="tab-press" @click="showModuleSheet = true">
        <view class="i-carbon-list-boxes tab-icon" />
        <text class="tab-text">模块管理</text>
      </view>
      <view class="tab" hover-class="tab-press" @click="showEditSheet = true">
        <view class="i-carbon-edit tab-icon" />
        <text class="tab-text">编辑</text>
      </view>
    </view>

    <view v-if="showEditSheet" class="mask" @click="showEditSheet = false">
      <view class="sheet" @click.stop>
        <text class="sheet-title">简历设置</text>
        <view class="sheet-item" hover-class="sheet-item-press" @click="openNameSheet">
          <view class="i-carbon-pen sheet-icon" />
          <text class="sheet-text">编辑名称</text>
        </view>
        <view class="sheet-item danger" hover-class="sheet-item-press" @click="confirmDelete">
          <view class="i-carbon-trash-can sheet-icon" />
          <text class="sheet-text">删除简历</text>
        </view>
        <view class="sheet-cancel" hover-class="sheet-cancel-press" @click="showEditSheet = false">
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
          <view class="sheet-btn ghost" hover-class="sheet-cancel-press" @click="showNameSheet = false">
            取消
          </view>
          <view class="sheet-btn primary" hover-class="sheet-btn-press" @click="confirmName">
            确定
          </view>
        </view>
      </view>
    </view>

    <view v-if="showModuleSheet" class="mask" @click="showModuleSheet = false">
      <view class="sheet module-sheet" @click.stop>
        <text class="sheet-title">模块管理</text>
        <scroll-view scroll-y class="sheet-scroll">
          <view v-for="(item, i) in components" :key="item.keyId" class="module-row" :class="{ off: !item.show }">
            <view class="module-main">
              <view class="module-name">
                {{ materialTitle(item) }}
              </view>
              <text class="module-state">{{ item.show ? '显示中' : '已隐藏' }}</text>
            </view>
            <view class="module-acts">
              <view class="icon-btn" hover-class="icon-btn-press" @click="moveModule(i, i - 1)">
                <view class="i-carbon-arrow-up" />
              </view>
              <view class="icon-btn" hover-class="icon-btn-press" @click="moveModule(i, i + 1)">
                <view class="i-carbon-arrow-down" />
              </view>
              <view class="icon-btn" hover-class="icon-btn-press" @click="toggleModule(item)">
                <view :class="item.show ? 'i-carbon-view' : 'i-carbon-view-off'" />
              </view>
              <view class="icon-btn danger" hover-class="icon-btn-press" @click="removeModule(item)">
                <view class="i-carbon-trash-can" />
              </view>
            </view>
          </view>
          <view v-if="addableModels.length" class="add-grid">
            <view
              v-for="model in addableModels"
              :key="model"
              class="add-chip"
              hover-class="add-chip-press"
              @click="addModule(model)"
            >
              ＋ {{ MODEL_TITLE[model] }}
            </view>
          </view>
          <text v-else class="module-empty">14 类模块都已添加</text>
        </scroll-view>
      </view>
    </view>
  </scroll-view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: rgb(244, 244, 244);
}
.modules {
  box-sizing: border-box;
  padding: 14px 16px 96px;
}
.head-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
}
.head-press {
  background: #f6f9ff;
}
.head-main {
  min-width: 0;
  flex: 1;
}
.head-name {
  overflow: hidden;
  color: #172b4d;
  font-size: 18px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.head-sub {
  display: block;
  margin-top: 6px;
  color: #94a3b8;
  font-size: 11px;
}
.head-edit {
  display: flex;
  flex: none;
  align-items: center;
  margin-left: 12px;
  padding: 5px 12px;
  border-radius: 13px;
  background: #eff6ff;
}
.head-pen {
  color: #2563eb;
  font-size: 13px;
}
.head-edit-text {
  margin-left: 4px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
}
.section {
  margin-top: 20px;
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
  background: #2563eb;
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
  background: #e8f0ff;
  color: #2563eb;
  font-size: 12px;
}
.section-action.danger {
  background: #fef2f2;
  color: #ef4444;
}
.card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 15px 16px;
  background: #fff;
  border-radius: 8px;
}
.card + .card {
  margin-top: 10px;
}
.card-press {
  background: #f6f9ff;
}
.item-main {
  min-width: 0;
  flex: 1;
}
.primary,
.secondary {
  display: block;
}
.primary {
  overflow: hidden;
  color: #172b4d;
  font-size: 15px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.secondary {
  margin-top: 6px;
  overflow: hidden;
  color: #8290a5;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item-actions {
  display: flex;
  align-items: center;
  margin-left: 12px;
}
.chip-danger {
  padding: 3px 10px;
  border-radius: 11px;
  background: #fef2f2;
  color: #ef4444;
  font-size: 12px;
}
.arrow {
  margin-left: 10px;
  color: #c0c9d6;
  font-size: 22px;
  line-height: 1;
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
.empty-card {
  justify-content: center;
  border: 1px dashed #bfd7f7;
  background: #f7faff;
  color: #2563eb;
  font-size: 13px;
}
.footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  padding: 8px 8px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
  background: #fff;
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
}
.tab-press {
  background: #f1f5f9;
}
.tab-icon {
  color: #64748b;
  font-size: 22px;
}
.tab-text {
  margin-top: 3px;
  color: #64748b;
  font-size: 10px;
}
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  background: rgb(15 23 42 / 45%);
}
.sheet {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  padding: 20px 16px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
  border-radius: 20px 20px 0 0;
  background: #fff;
  animation: sheet-up 0.24s ease-out;
}
.sheet-title {
  display: block;
  color: #172b4d;
  font-size: 16px;
  font-weight: 700;
}
.sheet-sub {
  display: block;
  margin-top: 6px;
  color: #94a3b8;
  font-size: 12px;
}
.sheet-item {
  display: flex;
  align-items: center;
  margin-top: 12px;
  padding: 15px 14px;
  border-radius: 12px;
  background: #f8fafc;
}
.sheet-item-press {
  background: #eef4ff;
}
.sheet-icon {
  color: #2563eb;
  font-size: 18px;
}
.sheet-text {
  margin-left: 10px;
  color: #172b4d;
  font-size: 15px;
  font-weight: 600;
}
.sheet-item.danger .sheet-icon,
.sheet-item.danger .sheet-text {
  color: #ef4444;
}
.sheet-cancel {
  margin-top: 14px;
  height: 46px;
  border-radius: 23px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 15px;
  line-height: 46px;
  text-align: center;
}
.sheet-cancel-press {
  background: #e2e8f0;
}
.sheet-input {
  box-sizing: border-box;
  width: 100%;
  height: 46px;
  margin-top: 14px;
  padding: 0 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  color: #172b4d;
  font-size: 15px;
}
.sheet-placeholder {
  color: #94a3b8;
}
.sheet-actions {
  display: flex;
  margin-top: 16px;
}
.sheet-btn {
  flex: 1;
  height: 46px;
  border-radius: 23px;
  font-size: 15px;
  font-weight: 600;
  line-height: 46px;
  text-align: center;
}
.sheet-btn + .sheet-btn {
  margin-left: 12px;
}
.sheet-btn.ghost {
  background: #f1f5f9;
  color: #64748b;
}
.sheet-btn.primary {
  background: linear-gradient(135deg, #2563eb 0%, #4f8df7 100%);
  box-shadow: 0 6px 16px rgb(37 99 235 / 26%);
  color: #fff;
}
.sheet-btn-press {
  opacity: 0.86;
}
.module-sheet {
  padding-bottom: calc(14px + env(safe-area-inset-bottom));
}
.sheet-scroll {
  max-height: 52vh;
  margin-top: 6px;
}
.module-row {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  border-radius: 12px;
  background: #f8fafc;
}
.module-row + .module-row {
  margin-top: 8px;
}
.module-row.off {
  opacity: 0.55;
}
.module-main {
  min-width: 0;
  flex: 1;
}
.module-name {
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
  border-radius: 9px;
  background: #fff;
  color: #64748b;
  font-size: 15px;
}
.icon-btn + .icon-btn {
  margin-left: 8px;
}
.icon-btn.danger {
  color: #ef4444;
}
.icon-btn-press {
  background: #e2e8f0;
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
  background: #eff6ff;
  color: #2563eb;
  font-size: 12px;
}
.add-chip-press {
  background: #dbeafe;
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
