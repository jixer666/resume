import type {
  IAwardsData,
  IBaseInfoData,
  ICampusExperienceData,
  ICustomData,
  IEduBackgroundData,
  IExperienceData,
  IHobbiesData,
  IJobIntentionData,
  IModelData,
  IResumeTitleData,
  ISelfEvaluationData,
  ISkillSpecialtiesData,
  IWorksDisplayData,
  ModelName,
} from './types'

/**
 * 14 类模块的默认业务数据。
 * 新建模块时按 model 取这里的一份深拷贝，再填入用户数据。
 */

const RESUME_TITLE: IResumeTitleData = {
  title: '',
}

const BASE_INFO: IBaseInfoData = {
  title: '基本信息',
  name: '',
  gender: '',
  age: '',
  phoneNumber: '',
  email: '',
  address: '',
  workService: '',
  degree: '',
  intention: '',
  abstract: '',
  avatar: '',
  isShow: { avatar: true, age: true, gender: true, address: false, workService: false, degree: false, phoneNumber: true, email: true, abstract: true },
}

const JOB_INTENTION: IJobIntentionData = {
  title: '求职意向',
  intendedPositions: '',
  intendedCity: '',
  expectSalary: '',
  jobStatus: '',
  jobSearchType: '',
  isShow: { intendedPositions: true, intendedCity: true, expectSalary: false, jobStatus: false, jobSearchType: false },
}

const EDU_BACKGROUND: IEduBackgroundData = {
  title: '教育经历',
  LIST: [],
  isShow: { date: true, schoolName: true, specialized: true, degree: false, majorCourse: false },
}

const WORK_EXPERIENCE: IExperienceData = {
  title: '工作经历',
  LIST: [],
  isShow: { date: true, companyName: true, posts: true },
}

const PROJECT_EXPERIENCE: IExperienceData = {
  title: '项目经历',
  LIST: [],
  isShow: { date: true, companyName: true, posts: true },
}

const INTERNSHIP_EXPERIENCE: IExperienceData = {
  title: '实习经历',
  LIST: [],
  isShow: { date: true, companyName: true, posts: true },
}

const CAMPUS_EXPERIENCE: ICampusExperienceData = {
  title: '校园经历',
  LIST: [],
  isShow: { date: true, campusBriefly: true, campusDuty: true, campusContent: true },
}

const SKILL_SPECIALTIES: ISkillSpecialtiesData = {
  title: '技能特长',
  LIST: [],
}

const AWARDS: IAwardsData = {
  title: '荣誉奖项',
  LIST: [],
  isShow: { date: true, awardsName: true, awardsGrade: true },
}

const HOBBIES: IHobbiesData = {
  title: '兴趣爱好',
  content: '',
}

const SELF_EVALUATION: ISelfEvaluationData = {
  title: '自我评价',
  content: '',
}

const WORKS_DISPLAY: IWorksDisplayData = {
  title: '作品展示',
  LIST: [],
}

const CUSTOM: ICustomData = {
  title: '自定义模块',
  content: '',
}

/** 模块名 → 默认业务数据 */
export const MODEL_DATA: Record<ModelName, IModelData> = {
  RESUME_TITLE,
  BASE_INFO,
  JOB_INTENTION,
  EDU_BACKGROUND,
  WORK_EXPERIENCE,
  PROJECT_EXPERIENCE,
  INTERNSHIP_EXPERIENCE,
  CAMPUS_EXPERIENCE,
  SKILL_SPECIALTIES,
  AWARDS,
  HOBBIES,
  SELF_EVALUATION,
  WORKS_DISPLAY,
  CUSTOM,
}

/** 模块名 → 中文显示名 */
export const MODEL_TITLE: Record<ModelName, string> = {
  RESUME_TITLE: '简历标题',
  BASE_INFO: '基本信息',
  JOB_INTENTION: '求职意向',
  EDU_BACKGROUND: '教育经历',
  WORK_EXPERIENCE: '工作经历',
  PROJECT_EXPERIENCE: '项目经历',
  INTERNSHIP_EXPERIENCE: '实习经历',
  CAMPUS_EXPERIENCE: '校园经历',
  SKILL_SPECIALTIES: '技能特长',
  AWARDS: '荣誉奖项',
  HOBBIES: '兴趣爱好',
  SELF_EVALUATION: '自我评价',
  WORKS_DISPLAY: '作品展示',
  CUSTOM: '自定义模块',
}

/** 取某类模块的默认数据（深拷贝，避免多处共享同一份引用） */
export function createModelData<T extends IModelData = IModelData>(model: ModelName): T {
  return JSON.parse(JSON.stringify(MODEL_DATA[model])) as T
}

/** 判断富文本是否为空：编辑器空内容会输出 <p><br></p> 这类纯标签，剥掉后没有可显示文本即视为空 */
export function isEmptyHtml(html: unknown): boolean {
  return !String(html || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim()
}

/** 保存前清洗富文本：空白内容归一为空字符串，其余去首尾空白 */
export function cleanHtml(html: string): string {
  const s = String(html || '').trim()
  return isEmptyHtml(s) ? '' : s
}

/** 旧纯文本兼容：不带标签的多行文本按换行转 <br>，已是 HTML 的原样返回 */
export function plainToHtml(text: string): string {
  const s = String(text || '').trim()
  if (!s || /<[a-z][\s\S]*>/i.test(s))
    return s
  return s.replace(/\n/g, '<br>')
}

/** 判断模块是否为空（列表类模块无条目、文本类模块无内容即视为空） */
export function isEmptyModelData(data: IModelData): boolean {
  if ('LIST' in data && Array.isArray(data.LIST)) {
    return data.LIST.every(item => Object.values(item).every(value => !value || (Array.isArray(value) && !value.length)))
  }
  if ('content' in data)
    return isEmptyHtml(data.content)
  if ('abstract' in data) {
    return !data.name && !data.abstract && !data.phoneNumber && !data.email
      && !data.avatar && !data.intention && !data.age && !data.address && !data.gender
  }
  if ('intendedPositions' in data) {
    return !data.intendedPositions && !data.intendedCity && !data.expectSalary
      && !data.jobStatus && !data.jobSearchType
  }
  if ('title' in data)
    return !String(data.title || '').trim()
  return false
}
