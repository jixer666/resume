<script lang="ts" setup>
import type { IMATERIALITEM } from '@/interface/material'
import { useResumeStore } from '@/store/resume'
import { cleanHtml, plainToHtml } from '@/utils/richText'

/**
 * 列表类模块的单条编辑：教育 / 工作 / 项目 / 实习 / 校园 / 技能 / 荣誉 / 作品。
 * 按 keyId 定位 store 里的模块，index 为 -1 表示新增一条。
 *
 * 字段名对齐 resume-design 的数据模型（`src/interface/model.ts`），与 temp 的 ENTRY 字段不同：
 * 时间区间的 `date` 是 `[开始, 结束]` 数组（荣誉是单个字符串），
 * 经历描述在 WORK / INTERNSHIP 里叫 `jobContent`、PROJECT 里叫 `projectContent`，
 * 两者都是 `Array<{ content }>`（每条一个 bullet），这里统一用表单里的 `detail` 承接。
 */
defineOptions({ name: 'ResumeEditExperience' })
definePage({
  style: {
    navigationBarTitleText: '编辑经历',
  },
})

/** 技能熟练度：与 utils/common 的 textToNumber 取值一一对应 */
const PROFICIENCY = ['了解', '一般', '熟悉', '精通']

const store = useResumeStore()
const keyId = ref('')
const index = ref(-1)

interface IEntryForm {
  dateStart: string
  dateEnd: string
  toNow: boolean
  schoolName: string
  specialized: string
  degree: string
  companyName: string
  posts: string
  campusBriefly: string
  campusDuty: string
  skillName: string
  proficiency: string
  awardsName: string
  awardsGrade: string
  worksName: string
  worksLink: string
  /** 富文本描述，按模块落到 majorCourse / introduce / campusContent / jobContent / projectContent / worksIntroduce */
  detail: string
}

function createForm(): IEntryForm {
  return {
    dateStart: '',
    dateEnd: '',
    toNow: false,
    schoolName: '',
    specialized: '',
    degree: '',
    companyName: '',
    posts: '',
    campusBriefly: '',
    campusDuty: '',
    skillName: '',
    proficiency: '',
    awardsName: '',
    awardsGrade: '',
    worksName: '',
    worksLink: '',
    detail: '',
  }
}

const form = reactive<IEntryForm>(createForm())

const item = computed<IMATERIALITEM | undefined>(() => store.current?.COMPONENTS.find(com => com.keyId === keyId.value))
const model = computed(() => String(item.value?.model || ''))

/** 带时间区间的模块 */
const HAS_DATE_RANGE = ['EDU_BACKGROUND', 'CAMPUS_EXPERIENCE', 'INTERNSHIP_EXPERIENCE', 'WORK_EXPERIENCE', 'PROJECT_EXPERIENCE']
const hasDateRange = computed(() => HAS_DATE_RANGE.includes(model.value))
/** 时间存单个字符串的模块（荣誉奖项） */
const hasSingleDate = computed(() => model.value === 'AWARDS')
/** 用富文本描述「经历内容」的模块及其字段名 */
const RICH_FIELDS: Record<string, string> = {
  EDU_BACKGROUND: 'majorCourse',
  SKILL_SPECIALTIES: 'introduce',
  CAMPUS_EXPERIENCE: 'campusContent',
  INTERNSHIP_EXPERIENCE: 'jobContent',
  WORK_EXPERIENCE: 'jobContent',
  PROJECT_EXPERIENCE: 'projectContent',
  WORKS_DISPLAY: 'worksIntroduce',
}
const richField = computed(() => RICH_FIELDS[model.value] || '')
/** 项目经历用「项目名称」，其余用「公司名称」 */
const ORG_LABEL: Record<string, { label: string, placeholder: string }> = {
  WORK_EXPERIENCE: { label: '公司名称', placeholder: '请输入公司名称' },
  INTERNSHIP_EXPERIENCE: { label: '公司名称', placeholder: '请输入公司名称' },
  PROJECT_EXPERIENCE: { label: '项目名称', placeholder: '请输入项目名称' },
}
const orgLabel = computed(() => ORG_LABEL[model.value] || { label: '名称', placeholder: '请输入名称' })

const DETAIL_PLACEHOLDER = `用 STAR 法则描述你的内容与结果，例如：
1、针对 XX 问题，负责 XX 目标，通过 XX 方法（做了 XX、XX、XX），最终实现 XX 结果，指标提升 XX%。
2、联合 XX 部门演示并制定跟进策略，将月成交从 XX 提升至 XX，超额完成 XX%。`

/** 该模块的条目集合 */
function listOf(): Record<string, unknown>[] {
  const data = item.value?.data as { LIST?: Record<string, unknown>[] } | undefined
  return data?.LIST || []
}

/** `2015-5` / `2019-06` 这类存储值统一成 picker 认识（也是它输出）的 `YYYY-MM` */
function toMonthValue(value: unknown): string {
  const text = String(value || '').trim()
  if (!/^\d{4}-\d{1,2}$/.test(text))
    return ''
  const [year, month] = text.split('-')
  return `${year}-${month.padStart(2, '0')}`
}

/** 富文本描述：多个 bullet 拼成一段 HTML 编辑，单个字段则按纯文本兼容处理 */
function readDetail(entry: Record<string, unknown>, field: string): string {
  const value = entry[field]
  if (Array.isArray(value))
    return value.map(one => String((one as { content?: string })?.content || '')).filter(Boolean).join('<br>')
  return plainToHtml(String(value || ''))
}

function fillForm(entry: Record<string, unknown>) {
  const date = entry.date
  const [start, end] = Array.isArray(date) ? date : [date, '']
  const endText = String(end || '')
  Object.assign(form, {
    dateStart: toMonthValue(start),
    // 结束时间存的是「至今」这类文案时，换算回开关
    dateEnd: toMonthValue(endText),
    toNow: !!endText && !toMonthValue(endText),
    schoolName: String(entry.schoolName || ''),
    specialized: String(entry.specialized || ''),
    degree: String(entry.degree || ''),
    companyName: String(entry.companyName || entry.projectName || ''),
    posts: String(entry.posts || ''),
    campusBriefly: String(entry.campusBriefly || ''),
    campusDuty: String(entry.campusDuty || ''),
    skillName: String(entry.skillName || ''),
    proficiency: String(entry.proficiency || ''),
    awardsName: String(entry.awardsName || ''),
    awardsGrade: String(entry.awardsGrade || ''),
    worksName: String(entry.worksName || ''),
    worksLink: String(entry.worksLink || ''),
    detail: richField.value ? readDetail(entry, richField.value) : '',
  })
}

/** 表单 → 条目数据，按模块只取相关字段 */
function buildEntry(): Record<string, unknown> {
  // 荣誉奖项的 date 是单值，其余是 [开始, 结束]
  const date = hasSingleDate.value
    ? form.dateStart
    : [form.dateStart, form.toNow ? '至今' : form.dateEnd].filter(Boolean)
  const detail = cleanHtml(form.detail)

  switch (model.value) {
    case 'EDU_BACKGROUND':
      return { date, schoolName: form.schoolName, specialized: form.specialized, degree: form.degree, majorCourse: detail }
    case 'SKILL_SPECIALTIES':
      return { skillName: form.skillName, proficiency: form.proficiency, introduce: detail }
    case 'CAMPUS_EXPERIENCE':
      return { date, campusBriefly: form.campusBriefly, campusDuty: form.campusDuty, campusContent: detail }
    case 'AWARDS':
      return { date, awardsName: form.awardsName, awardsGrade: form.awardsGrade }
    case 'WORKS_DISPLAY':
      return { worksName: form.worksName, worksLink: form.worksLink, worksIntroduce: detail }
    case 'PROJECT_EXPERIENCE':
      return { date, projectName: form.companyName, posts: form.posts, projectContent: detail ? [{ content: detail }] : [] }
    default:
      return { date, companyName: form.companyName, posts: form.posts, jobContent: detail ? [{ content: detail }] : [] }
  }
}

onLoad((query) => {
  keyId.value = query?.keyId ? String(query.keyId) : ''
  index.value = query?.index !== undefined ? Number(query.index) : -1
  const entry = listOf()[index.value]
  if (entry)
    fillForm(entry)
})

function pickProficiency(e: { detail: { value: number | string } }) {
  form.proficiency = PROFICIENCY[Number(e.detail.value)] || ''
}

function onStartDate(e: { detail: { value: string } }) {
  form.dateStart = e.detail.value
}

function onEndDate(e: { detail: { value: string } }) {
  form.dateEnd = e.detail.value
}

/** 勾上「至今」就清掉结束时间，避免两个值打架 */
function onToNow(e: { detail: { value: boolean } }) {
  form.toNow = e.detail.value
  if (form.toNow)
    form.dateEnd = ''
}

function save() {
  const list = listOf()
  if (index.value < 0)
    list.push(buildEntry())
  else list.splice(index.value, 1, buildEntry())
  uni.navigateBack()
}

function clear() {
  uni.showModal({
    title: '清空',
    content: '确定清空当前填写的内容吗？',
    success: ({ confirm }) => {
      if (!confirm)
        return
      Object.assign(form, createForm())
    },
  })
}
</script>

<template>
  <view class="page">
    <view class="card">
      <template v-if="hasDateRange">
        <text class="label">时间</text>
        <view class="date-row">
          <picker mode="date" fields="month" :value="form.dateStart" @change="onStartDate">
            <view class="picker picker--half">
              <text :class="{ placeholder: !form.dateStart }">{{ form.dateStart || '开始时间' }}</text>
              <text class="arrow">›</text>
            </view>
          </picker>
          <text class="date-sep">至</text>
          <picker mode="date" fields="month" :value="form.dateEnd" :disabled="form.toNow" @change="onEndDate">
            <view class="picker picker--half">
              <text :class="{ placeholder: !form.dateEnd }">{{ form.toNow ? '至今' : (form.dateEnd || '结束时间') }}</text>
              <text class="arrow">›</text>
            </view>
          </picker>
        </view>
        <view class="switch-row">
          <text class="switch-label">至今</text>
          <switch :checked="form.toNow" color="#0957de" @change="onToNow" />
        </view>
      </template>

      <template v-else-if="hasSingleDate">
        <text class="label">获奖时间</text>
        <picker mode="date" fields="month" :value="form.dateStart" @change="onStartDate">
          <view class="picker">
            <text :class="{ placeholder: !form.dateStart }">{{ form.dateStart || '请选择获奖时间' }}</text>
            <text class="arrow">›</text>
          </view>
        </picker>
      </template>

      <template v-if="model === 'EDU_BACKGROUND'">
        <text class="label">学校名称</text>
        <input v-model="form.schoolName" class="input" placeholder="请输入学校">
        <text class="label">专业</text>
        <input v-model="form.specialized" class="input" placeholder="请输入专业">
        <text class="label">学历</text>
        <input v-model="form.degree" class="input" placeholder="如：本科">
      </template>

      <template v-else-if="model === 'SKILL_SPECIALTIES'">
        <text class="label">技能名称</text>
        <input v-model="form.skillName" class="input" placeholder="如：Vue3">
        <text class="label">熟练度</text>
        <picker :range="PROFICIENCY" @change="pickProficiency">
          <view class="picker">
            <text :class="{ placeholder: !form.proficiency }">{{ form.proficiency || '请选择熟练度' }}</text>
            <text class="arrow">›</text>
          </view>
        </picker>
      </template>

      <template v-else-if="model === 'CAMPUS_EXPERIENCE'">
        <text class="label">校园组织 / 活动名称</text>
        <input v-model="form.campusBriefly" class="input" placeholder="如：校学生会">
        <text class="label">担任职务</text>
        <input v-model="form.campusDuty" class="input" placeholder="如：外联部部长">
      </template>

      <template v-else-if="model === 'AWARDS'">
        <text class="label">奖项名称</text>
        <input v-model="form.awardsName" class="input" placeholder="如：国家奖学金">
        <text class="label">奖项等级</text>
        <input v-model="form.awardsGrade" class="input" placeholder="如：国家级">
      </template>

      <template v-else-if="model === 'WORKS_DISPLAY'">
        <text class="label">作品名称</text>
        <input v-model="form.worksName" class="input" placeholder="如：个人博客系统">
        <text class="label">作品链接</text>
        <input v-model="form.worksLink" class="input" placeholder="如：https://github.com/xxx">
      </template>

      <template v-else>
        <text class="label">{{ orgLabel.label }}</text>
        <input v-model="form.companyName" class="input" :placeholder="orgLabel.placeholder">
        <text class="label">{{ model === 'PROJECT_EXPERIENCE' ? '项目职责' : '职位' }}</text>
        <input v-model="form.posts" class="input" :placeholder="model === 'PROJECT_EXPERIENCE' ? '请输入项目职责' : '请输入职位'">
      </template>

      <template v-if="richField">
        <text class="label">{{ model === 'EDU_BACKGROUND' ? '主修课程' : '内容描述' }}</text>
        <rich-text-editor
          v-model="form.detail"
          :placeholder="model === 'EDU_BACKGROUND' || model === 'SKILL_SPECIALTIES' || model === 'WORKS_DISPLAY' ? '请输入内容' : DETAIL_PLACEHOLDER"
          :height="model === 'EDU_BACKGROUND' || model === 'SKILL_SPECIALTIES' ? '180px' : '280px'"
        />
      </template>
    </view>

    <view class="footer">
      <button class="btn btn--ghost" hover-class="btn--press" @click="clear">
        清空
      </button>
      <button class="btn btn--primary" hover-class="btn--press" @click="save">
        保存
      </button>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import '../../style/editor-form.scss';

.date-row {
  display: flex;
  align-items: center;
}

.picker--half {
  flex: 1;
}

.date-sep {
  flex: none;
  margin: 0 10px;
  color: #8290a5;
  font-size: 13px;
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.switch-label {
  color: #344054;
  font-size: 13px;
}
</style>
