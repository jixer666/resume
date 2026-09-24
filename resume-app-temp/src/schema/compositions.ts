import type { IComposition, ModelName, ModelSide } from './types'

/**
 * 部件 JSON：把简历拆成一个个模块，每个模块声明「用哪个物料变体、落在哪一栏」。
 *
 * 模板 = 一个部件 JSON（composition）+ 一份 GLOBAL_STYLE 覆盖。
 * 换模板就是换这份 JSON；加模块就是往 modules 里加一项。
 *
 * 组合与封面 SVG（src/static/resume/template-*.svg）一一对应：
 * 两栏组合的第一个参数是通栏模块（排在两栏之上，如顶部横幅/居中名片）。
 */

/**
 * 模块声明：只给模块名就用默认物料变体，给对象则额外指定用哪个变体。
 * 时间轴类模板靠它把经历模块换成时间轴式变体，其余模板沿用默认变体。
 */
type ModuleSpec = ModelName | { model: ModelName, cptName: string }

function toModule(spec: ModuleSpec, side: ModelSide) {
  const { model, cptName } = typeof spec === 'string' ? { model: spec, cptName: undefined } : spec
  return { model, cptName, side }
}

/** 单栏上下流：全部模块通栏排列 */
function classical(...models: ModuleSpec[]): IComposition {
  return {
    layout: 'classical',
    modules: models.map(model => toModule(model, 'main')),
  }
}

/** 两栏组合：main 模块横向通栏排在两栏之上（可为空），再接左右两栏 */
function twoColumn(main: ModuleSpec[], left: ModuleSpec[], right: ModuleSpec[]): IComposition {
  return {
    layout: 'leftRight',
    modules: [
      ...main.map(model => toModule(model, 'main')),
      ...left.map(model => toModule(model, 'left')),
      ...right.map(model => toModule(model, 'right')),
    ],
  }
}

/** 主叙事模块：教育 → 工作 → 项目 → 实习 → 校园 → 荣誉 → 作品 */
const NARRATIVE: ModelName[] = [
  'EDU_BACKGROUND',
  'WORK_EXPERIENCE',
  'PROJECT_EXPERIENCE',
  'INTERNSHIP_EXPERIENCE',
  'CAMPUS_EXPERIENCE',
  'AWARDS',
  'WORKS_DISPLAY',
]

/** 侧栏模块：基本信息 → 求职意向 → 技能 → 兴趣 → 自定义 */
const SIDEBAR: ModelName[] = [
  'BASE_INFO',
  'JOB_INTENTION',
  'SKILL_SPECIALTIES',
  'HOBBIES',
  'CUSTOM',
]

/** 侧栏模块（标签墙版）：技能换成标签墙，深色/浅色窄栏里比熟练度条更好读 */
const SIDEBAR_TAGS: ModuleSpec[] = [
  'BASE_INFO',
  'JOB_INTENTION',
  { model: 'SKILL_SPECIALTIES', cptName: 'SKILL_SPECIALTIES_2' },
  'HOBBIES',
  'CUSTOM',
]

export const COMPOSITIONS: Record<string, IComposition> = {
  /** 经典单栏：居中名片头部 + 色条标题的上下流（封面：顶部色条 + 居中头像姓名） */
  classic: classical(
    { model: 'BASE_INFO', cptName: 'BASE_INFO_3' },
    'JOB_INTENTION',
    'EDU_BACKGROUND',
    'WORK_EXPERIENCE',
    'PROJECT_EXPERIENCE',
    'INTERNSHIP_EXPERIENCE',
    'CAMPUS_EXPERIENCE',
    'SKILL_SPECIALTIES',
    'AWARDS',
    'HOBBIES',
    'SELF_EVALUATION',
  ),

  /**
   * 精简两栏：居中名片通栏，窄栏只放技能/荣誉这类短条目，
   * 教育/工作/项目等长文叙事必须落右宽栏 —— 塞进窄栏会一字一行竖排。
   */
  minimal: twoColumn(
    [{ model: 'BASE_INFO', cptName: 'BASE_INFO_3' }],
    ['SKILL_SPECIALTIES', 'AWARDS'],
    ['EDU_BACKGROUND', 'WORK_EXPERIENCE', 'PROJECT_EXPERIENCE', 'SELF_EVALUATION'],
  ),

  /**
   * 紧凑两栏：文本信息与自评通栏，窄栏只放意向/技能/荣誉这类短条目，
   * 教育/工作/项目等长文经历落右宽栏 —— 窄栏里机构名与日期会挤成两行。
   */
  compact: twoColumn(
    [{ model: 'BASE_INFO', cptName: 'BASE_INFO_2' }, 'SELF_EVALUATION'],
    ['JOB_INTENTION', 'SKILL_SPECIALTIES', 'AWARDS'],
    ['EDU_BACKGROUND', 'WORK_EXPERIENCE', 'PROJECT_EXPERIENCE', 'INTERNSHIP_EXPERIENCE', 'HOBBIES'],
  ),

  /** 时间轴单栏：头像名片在顶部，教育与工作换成时间轴式变体，用竖线把经历串起来 */
  timeline: classical(
    'BASE_INFO',
    'JOB_INTENTION',
    { model: 'EDU_BACKGROUND', cptName: 'EDU_BACKGROUND_2' },
    { model: 'WORK_EXPERIENCE', cptName: 'WORK_EXPERIENCE_2' },
    'PROJECT_EXPERIENCE',
    'INTERNSHIP_EXPERIENCE',
    'CAMPUS_EXPERIENCE',
    'SKILL_SPECIALTIES',
    'AWARDS',
    'SELF_EVALUATION',
  ),

  /** 横幅单栏：顶部主题色横幅承载身份信息，正文上下流（封面：230px 大色带） */
  banner: classical(
    { model: 'BASE_INFO', cptName: 'BASE_INFO_4' },
    'JOB_INTENTION',
    'EDU_BACKGROUND',
    'WORK_EXPERIENCE',
    'PROJECT_EXPERIENCE',
    'SKILL_SPECIALTIES',
    'AWARDS',
    'SELF_EVALUATION',
  ),

  /** 左栏信息 / 右栏叙事：深色左栏用标签墙技能，窄栏里比进度条更清楚 */
  leftSidebar: twoColumn(
    [],
    SIDEBAR_TAGS,
    ['RESUME_TITLE', ...NARRATIVE, 'SELF_EVALUATION'],
  ),

  /** 左栏叙事 / 右栏信息（镜像） */
  rightSidebar: twoColumn(
    [],
    [...NARRATIVE, 'SELF_EVALUATION'],
    SIDEBAR,
  ),

  /** 顶部横幅 + 两栏：横幅通栏承载身份，窄栏只放短条目，经历全落右宽栏 */
  split: twoColumn(
    [{ model: 'BASE_INFO', cptName: 'BASE_INFO_4' }],
    ['JOB_INTENTION', 'SKILL_SPECIALTIES'],
    ['EDU_BACKGROUND', 'WORK_EXPERIENCE', 'PROJECT_EXPERIENCE', 'AWARDS', 'SELF_EVALUATION'],
  ),

  /** 侧栏为主：侧栏放名片/技能/兴趣，主栏放全部经历（封面：左窄栏卡片 + 右栏灰卡） */
  showcase: twoColumn(
    [],
    ['BASE_INFO', 'SKILL_SPECIALTIES', 'HOBBIES'],
    ['JOB_INTENTION', ...NARRATIVE, 'SELF_EVALUATION'],
  ),
}

/** 默认组合 id */
export const DEFAULT_COMPOSITION = 'classic'

/** 取一份组合，id 非法时回退到默认组合 */
export function getComposition(id: string): IComposition {
  return COMPOSITIONS[id] || COMPOSITIONS[DEFAULT_COMPOSITION]
}
