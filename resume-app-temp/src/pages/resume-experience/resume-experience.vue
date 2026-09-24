<script setup lang="ts">
import type {
  IAwardsItem,
  ICampusExperienceItem,
  IEduBackgroundItem,
  IExperienceItem,
  IMaterialItem,
  ISkillSpecialtiesItem,
  IWorksDisplayItem,
  ModelName,
} from '@/schema/types'
import { cleanHtml, plainToHtml } from '@/schema/modelData'
import { useResumeStore } from '@/store/resume'

/**
 * 列表类模块的单条编辑：教育 / 工作 / 项目 / 实习 / 校园 / 技能 / 荣誉 / 作品。
 * 按 keyId 定位 store 里的模块，index 为 -1 表示新增一条。
 */
const store = useResumeStore()
const keyId = ref('')
const index = ref(-1)

/** 表单字段，按模块取用其中的一部分 */
const form = reactive({
  date: '',
  schoolName: '',
  specialized: '',
  degree: '',
  majorCourse: '',
  companyName: '',
  posts: '',
  jobContent: '',
  campusBriefly: '',
  campusDuty: '',
  campusContent: '',
  skillName: '',
  proficiency: '',
  introduce: '',
  awardsName: '',
  awardsGrade: '',
  worksName: '',
  worksLink: '',
  worksIntroduce: '',
})

const EMPTY_FORM = {
  date: '',
  schoolName: '',
  specialized: '',
  degree: '',
  majorCourse: '',
  companyName: '',
  posts: '',
  jobContent: '',
  campusBriefly: '',
  campusDuty: '',
  campusContent: '',
  skillName: '',
  proficiency: '',
  introduce: '',
  awardsName: '',
  awardsGrade: '',
  worksName: '',
  worksLink: '',
  worksIntroduce: '',
}

const detailPlaceholder = `采用STAR法则描述你的工作内容、项目成果或负责事项，例如：
1、针对 XX 问题，负责 XX 目标，通过 XX 方法（做了 XX、XX、XX），最终实现 XX 结果，XX 指标提升/降低 XX%。
2、针对 XX 区域客户基础薄弱问题，制定分级跟进策略并联合 XX 部门演示，将月成交从 XX 单提升至 XX 单，超额完成 XX%。
3、针对 XX 产品初期日活仅 XX 的问题，负责 XX 个月增长目标，策划 XX 裂变活动并联合 XX 个社群推广，最终日活提升至 XX，获客成本降低 XX%。`

/** 列表类模块的条目：各条目结构按模块取用其中一个子集 */
type EntryItem = Partial<
  IEduBackgroundItem
  & IExperienceItem
  & ISkillSpecialtiesItem
  & ICampusExperienceItem
  & IAwardsItem
  & IWorksDisplayItem
>

const item = computed<IMaterialItem | undefined>(() => store.current?.COMPONENTS.find(com => com.keyId === keyId.value))
const model = computed<ModelName | undefined>(() => item.value?.model)

/** 该模块的条目集合 */
function listOf(): EntryItem[] {
  const data = item.value?.data as { LIST?: EntryItem[] } | undefined
  return data?.LIST || []
}

/** 把条目数据摊平到表单 */
function fillForm(entry: EntryItem) {
  // 兼容旧数据：jobContent 曾是按行拆分的数组，拼接后转成富文本 HTML
  const content = entry.jobContent
  form.jobContent = Array.isArray(content)
    ? content.filter(Boolean).join('<br>')
    : plainToHtml(String(content || ''))
  Object.assign(form, {
    date: String(entry.date || ''),
    schoolName: String(entry.schoolName || ''),
    specialized: String(entry.specialized || ''),
    degree: String(entry.degree || ''),
    majorCourse: String(entry.majorCourse || ''),
    companyName: String(entry.companyName || ''),
    posts: String(entry.posts || ''),
    campusBriefly: String(entry.campusBriefly || ''),
    campusDuty: String(entry.campusDuty || ''),
    campusContent: plainToHtml(String(entry.campusContent || '')),
    skillName: String(entry.skillName || ''),
    proficiency: String(entry.proficiency || ''),
    introduce: plainToHtml(String(entry.introduce || '')),
    awardsName: String(entry.awardsName || ''),
    awardsGrade: String(entry.awardsGrade || ''),
    worksName: String(entry.worksName || ''),
    worksLink: String(entry.worksLink || ''),
    worksIntroduce: plainToHtml(String(entry.worksIntroduce || '')),
  })
}

/** 由表单生成条目数据，按模块只取相关字段 */
function buildEntry(): EntryItem {
  if (model.value === 'EDU_BACKGROUND') {
    return { date: form.date, schoolName: form.schoolName, specialized: form.specialized, degree: form.degree, majorCourse: form.majorCourse }
  }
  if (model.value === 'SKILL_SPECIALTIES') {
    return { skillName: form.skillName, proficiency: form.proficiency, introduce: cleanHtml(form.introduce) }
  }
  if (model.value === 'CAMPUS_EXPERIENCE') {
    return {
      date: form.date,
      campusBriefly: form.campusBriefly,
      campusDuty: form.campusDuty,
      campusContent: cleanHtml(form.campusContent),
    }
  }
  if (model.value === 'AWARDS') {
    return { date: form.date, awardsName: form.awardsName, awardsGrade: form.awardsGrade }
  }
  if (model.value === 'WORKS_DISPLAY') {
    return {
      worksName: form.worksName,
      worksLink: form.worksLink,
      worksIntroduce: cleanHtml(form.worksIntroduce),
    }
  }
  return {
    date: form.date,
    companyName: form.companyName,
    posts: form.posts,
    jobContent: cleanHtml(form.jobContent),
  }
}

onLoad((query) => {
  keyId.value = query?.keyId ? String(query.keyId) : ''
  index.value = Number(query?.index ?? -1)
  const entry = listOf()[index.value]
  if (entry)
    fillForm(entry)
})

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
      Object.assign(form, EMPTY_FORM)
    },
  })
}
</script>

<template>
  <view class="page">
    <view class="card">
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
        <text class="label">掌握程度</text>
        <input v-model="form.proficiency" class="input" placeholder="如：熟练">
        <text class="label">技能说明</text>
        <fg-rich-editor v-model="form.introduce" placeholder="补充说明该项技能的使用场景" height="180px" />
      </template>

      <template v-else-if="model === 'CAMPUS_EXPERIENCE'">
        <text class="label">校园组织/活动名称</text>
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
        <text class="label">{{ model === 'PROJECT_EXPERIENCE' ? '项目名称' : '公司名称' }}</text>
        <input v-model="form.companyName" class="input" :placeholder="model === 'PROJECT_EXPERIENCE' ? '请输入项目名称' : '请输入公司名称'">
        <text class="label">{{ model === 'PROJECT_EXPERIENCE' ? '担任角色' : '职位' }}</text>
        <input v-model="form.posts" class="input" :placeholder="model === 'PROJECT_EXPERIENCE' ? '请输入角色' : '请输入职位'">
      </template>

      <template v-if="model !== 'SKILL_SPECIALTIES' && model !== 'WORKS_DISPLAY'">
        <text class="label">时间</text>
        <input v-model="form.date" class="input" placeholder="如：2021.06 - 至今">
      </template>

      <template v-if="model === 'WORK_EXPERIENCE' || model === 'PROJECT_EXPERIENCE' || model === 'INTERNSHIP_EXPERIENCE'">
        <text class="label">经历描述</text>
        <fg-rich-editor v-model="form.jobContent" :placeholder="detailPlaceholder" height="280px" />
      </template>

      <template v-if="model === 'CAMPUS_EXPERIENCE'">
        <text class="label">经历描述</text>
        <fg-rich-editor v-model="form.campusContent" :placeholder="detailPlaceholder" height="280px" />
      </template>

      <template v-if="model === 'WORKS_DISPLAY'">
        <text class="label">作品说明</text>
        <fg-rich-editor v-model="form.worksIntroduce" placeholder="介绍作品的背景、你的职责与亮点" height="220px" />
      </template>
    </view>
    <view class="footer">
      <button class="btn-clear" @click="clear">
        清空
      </button>
      <button class="btn-save" @click="save">
        保存
      </button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 18px 16px 100px;
  background: rgb(244, 244, 244);
}
.card {
  padding: 18px 16px;
  background: #fff;
  border-radius: 12px;
}
.label {
  display: block;
  margin: 2px 0 8px;
  color: #344054;
  font-size: 13px;
}
.input {
  width: 100%;
  box-sizing: border-box;
  height: 44px;
  margin-bottom: 15px;
  padding: 0 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 14px;
}
.footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  gap: 12px;
  padding: 10px 16px;
  padding-bottom: calc(10px + constant(safe-area-inset-bottom));
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  border-top: 1px solid #f1f5f9;
  background: #fff;
}
.btn-clear,
.btn-save {
  flex: 1;
  height: 44px;
  margin: 0;
  border: none;
  border-radius: 22px;
  line-height: 44px;
  font-size: 15px;

  &::after {
    border: none;
  }
}
.btn-clear {
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;
}
.btn-save {
  background: #2563eb;
  color: #fff;
}
</style>
