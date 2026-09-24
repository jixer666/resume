/**
 * 简历 JSON 的类型定义。
 *
 * 一份简历 = 一个 JSON 对象：LAYOUT（布局模式）+ COMPONENTS（模块数组）+ GLOBAL_STYLE（全局主题）。
 * 渲染时把 COMPONENTS 里的 cptName 映射到 src/material 下的物料组件，用动态 <component :is> 渲染。
 */

/** 简历模块名，与 src/material 下的目录一一对应 */
export type ModelName
  = | 'RESUME_TITLE'
    | 'BASE_INFO'
    | 'JOB_INTENTION'
    | 'EDU_BACKGROUND'
    | 'WORK_EXPERIENCE'
    | 'PROJECT_EXPERIENCE'
    | 'INTERNSHIP_EXPERIENCE'
    | 'CAMPUS_EXPERIENCE'
    | 'SKILL_SPECIALTIES'
    | 'AWARDS'
    | 'HOBBIES'
    | 'SELF_EVALUATION'
    | 'WORKS_DISPLAY'
    | 'CUSTOM'

/** 布局模式：传统上下流 / 左右两列 / 导入 JSON */
export type ResumeLayout = 'classical' | 'leftRight' | 'custom'

/** 模块归属栏位：左右两列布局下决定模块落在哪一栏 */
export type ModelSide = 'left' | 'right' | 'main'

/** 分区标题样式，由 GLOBAL_STYLE.titleStyle 下发到每个模块 */
export type TitleStyle = 'bar' | 'underline' | 'dot' | 'chip' | 'num' | 'diamond' | 'softChip' | 'plain'

/** 头像形状 */
export type AvatarShape = 'circle' | 'square'

/** 分区标题对齐方式：居中标题用于正式/居中版式的模板 */
export type TitleAlign = 'left' | 'center'

/** 模块外观：普通流式 / 整块白卡（一个分区一张卡） */
export type ModuleCard = 'none' | 'card'

/**
 * 条目外观：模块内部每条记录（一段经历 / 一所学校 / 一个奖项）的形态。
 * 与 titleStyle 一样由 GLOBAL_STYLE 下发，是模板之间「形态差异」的落点。
 */
export type EntryStyle = 'plain' | 'divider' | 'card' | 'band'

/**
 * 栏位色调：模块所在栏位是深色底时，模块内的文字/分隔线要反白，
 * 否则深色侧边栏上会出现深灰字压深蓝底、几乎看不清的问题。
 */
export type SideTone = 'light' | 'dark'

/**
 * 模块级样式 token：由 GLOBAL_STYLE 下发，物料组件只读。
 * 物料组件把 token 转成 CSS 变量挂到根节点，样式表里用 var(--rs-xxx) 消费，
 * 因此改 GLOBAL_STYLE 一处即可让整份简历跟随变化。
 */
export interface IModelStyle {
  /** 主题色：标题、分隔线、强调文字 */
  themeColor: string
  /** 一级标题（模块标题）字号 */
  firstTitleFontSize: string
  /** 二级标题（条目标题）字号 */
  titleFontSize: string
  titleColor: string
  titleFontWeight: number
  /** 正文字号 */
  textFontSize: string
  textColor: string
  textFontWeight: number
  /** 模块底色 */
  backgroundColor: string
  /** 左右内边距 */
  pLeftRight: string
  /** 上内边距 */
  pTop: string
  /** 下内边距 */
  pBottom: string
  /** 与上一模块的间距 */
  mTop: string
  /** 与下一模块的间距 */
  mBottom: string
  /** 行高倍数，如 '1.6' */
  lineHeight: string
  /** 分区标题样式 */
  titleStyle: TitleStyle
  /** 分区标题对齐 */
  titleAlign: TitleAlign
  /** 头像形状 */
  avatarShape: AvatarShape
  /** 模块外观：是否整块卡片化 */
  moduleCard: ModuleCard
  /** 条目外观 */
  entryStyle: EntryStyle
  /** 条目之间的间距 */
  entryGap: string
  /** 卡片圆角，card / band 形态使用 */
  cardRadius: string
  /** 柔和底色（主题色淡化而来），替代原先写死的浅灰 */
  accentSoft: string
  /** 分隔线颜色 */
  dividerColor: string
  /** 卡片底色 */
  cardBg: string
  /** 所在栏位的色调，深色栏位上文字与线条要反白 */
  sideTone: SideTone
}

/** 全局主题：整份简历的样式源头 */
export interface IGlobalStyle extends IModelStyle {
  /** 字体族 */
  fontFamily: string
  /** 左右布局：左栏宽度 */
  leftWidth: string
  /** 左右布局：右栏宽度 */
  rightWidth: string
  /** 左右布局：左栏底色 */
  leftThemeColor: string
  /** 左右布局：右栏底色 */
  rightThemeColor: string
  /** 纸张底色 */
  pageBackground: string
  /** 纸张顶部色条高度，'0px' 表示没有 */
  topBarHeight: string
}

// ---------------- 各模块业务数据 ----------------

/** 简历标题（姓名 / 大标题） */
export interface IResumeTitleData {
  title: string
}

/** 基本信息 */
export interface IBaseInfoShow {
  avatar: boolean
  age: boolean
  gender: boolean
  address: boolean
  workService: boolean
  degree: boolean
  phoneNumber: boolean
  email: boolean
  abstract: boolean
}
export interface IBaseInfoData {
  title: string
  name: string
  gender: string
  age: string
  phoneNumber: string
  email: string
  address: string
  workService: string
  degree: string
  intention: string
  abstract: string
  avatar: string
  isShow: IBaseInfoShow
}

/** 求职意向 */
export interface IJobIntentionShow {
  intendedPositions: boolean
  intendedCity: boolean
  expectSalary: boolean
  jobStatus: boolean
  jobSearchType: boolean
}
export interface IJobIntentionData {
  title: string
  intendedPositions: string
  intendedCity: string
  expectSalary: string
  jobStatus: string
  jobSearchType: string
  isShow: IJobIntentionShow
}

/** 教育经历 */
export interface IEduBackgroundShow {
  date: boolean
  schoolName: boolean
  specialized: boolean
  degree: boolean
  majorCourse: boolean
}
export interface IEduBackgroundItem {
  date: string
  schoolName: string
  specialized: string
  degree: string
  majorCourse: string
}
export interface IEduBackgroundData {
  title: string
  LIST: IEduBackgroundItem[]
  isShow: IEduBackgroundShow
}

/** 工作 / 项目 / 实习经历共用条目结构 */
export interface IExperienceShow {
  date: boolean
  companyName: boolean
  posts: boolean
}
export interface IExperienceItem {
  date: string
  companyName: string
  posts: string
  /** 富文本 HTML（旧数据为按行拆分的字符串数组，读取时兼容） */
  jobContent: string
}
export interface IExperienceData {
  title: string
  LIST: IExperienceItem[]
  isShow: IExperienceShow
}

/** 校园经历 */
export interface ICampusExperienceShow {
  date: boolean
  campusBriefly: boolean
  campusDuty: boolean
  campusContent: boolean
}
export interface ICampusExperienceItem {
  date: string
  campusBriefly: string
  campusDuty: string
  campusContent: string
}
export interface ICampusExperienceData {
  title: string
  LIST: ICampusExperienceItem[]
  isShow: ICampusExperienceShow
}

/** 技能特长 */
export interface ISkillSpecialtiesItem {
  skillName: string
  proficiency: string
  introduce: string
}
export interface ISkillSpecialtiesData {
  title: string
  LIST: ISkillSpecialtiesItem[]
}

/** 荣誉奖项 */
export interface IAwardsShow {
  date: boolean
  awardsName: boolean
  awardsGrade: boolean
}
export interface IAwardsItem {
  date: string
  awardsName: string
  awardsGrade: string
}
export interface IAwardsData {
  title: string
  LIST: IAwardsItem[]
  isShow: IAwardsShow
}

/** 兴趣爱好 */
export interface IHobbiesData {
  title: string
  content: string
}

/** 自我评价 */
export interface ISelfEvaluationData {
  title: string
  content: string
}

/** 作品展示 */
export interface IWorksDisplayItem {
  worksName: string
  worksLink: string
  worksIntroduce: string
}
export interface IWorksDisplayData {
  title: string
  LIST: IWorksDisplayItem[]
}

/** 自定义文本模块 */
export interface ICustomData {
  title: string
  content: string
}

/** 所有模块业务数据的联合类型 */
export type IModelData
  = | IResumeTitleData
    | IBaseInfoData
    | IJobIntentionData
    | IEduBackgroundData
    | IExperienceData
    | ICampusExperienceData
    | ISkillSpecialtiesData
    | IAwardsData
    | IHobbiesData
    | ISelfEvaluationData
    | IWorksDisplayData
    | ICustomData

// ---------------- JSON 结构 ----------------

/** 一个模块（物料实例）：COMPONENTS 数组的元素 */
export interface IMaterialItem {
  /** 实例唯一 id，拖拽/选中/编辑时定位用 */
  keyId: string
  /** 模块名 */
  model: ModelName
  /** 物料组件名，形如 WORK_EXPERIENCE_1，对应 ModuleRenderer.vue 分支渲染的组件 */
  cptName: string
  /** 物料显示名，用于模块管理列表 */
  cptTitle: string
  /** 归属栏位 */
  layout: ModelSide
  /** 是否显示 */
  show: boolean
  /** 模块级样式 token */
  style: IModelStyle
  /** 模块业务数据 */
  data: IModelData
}

/** 一份简历的完整 JSON */
export interface IResumeJson {
  /** 简历实例 id */
  ID: string
  /** 简历名称（用户可改，列表页展示） */
  NAME: string
  /** 简历大标题，通常是姓名 */
  TITLE: string
  /** 使用的模板 id，换模板时更新 */
  templateId: string
  /** 布局模式 */
  LAYOUT: ResumeLayout
  /** 模块列表 */
  COMPONENTS: IMaterialItem[]
  /** 全局主题 */
  GLOBAL_STYLE: IGlobalStyle
  /** 最后更新时间，列表页展示用 */
  updatedAt: string
}

/** 物料变体：一个模块样式变体的元信息 */
export interface IMaterialVariant {
  /** 物料组件名，如 WORK_EXPERIENCE_1 */
  cptName: string
  /** 变体显示名 */
  cptTitle: string
  /** 该变体的样式 token 覆盖 */
  style?: Partial<IModelStyle>
  /** 默认栏位 */
  layout?: ModelSide
}

/** 模板组合：模块顺序 + 栏位归属，模板由「部件 JSON」组合而成 */
export interface IComposition {
  layout: ResumeLayout
  /** 模块清单：model + 选用哪个物料变体 + 落在哪一栏 */
  modules: Array<{ model: ModelName, cptName?: string, side?: ModelSide }>
}

/** 模板元信息：模板库列表与预览页模板选择器使用 */
export interface IResumeTemplate {
  id: string
  name: string
  description: string
  cover: string
  /** 使用的组合 */
  composition: string
  /** GLOBAL_STYLE 覆盖 */
  style?: Partial<IGlobalStyle>
}
