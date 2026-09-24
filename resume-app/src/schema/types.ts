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
 */
export type EntryStyle = 'plain' | 'divider' | 'card' | 'band'

/**
 * 栏位色调：模块所在栏位是深色底时，模块内的文字/分隔线要反白，
 * 否则深色侧边栏上会出现深灰字压深蓝底、几乎看不清的问题。
 */
export type SideTone = 'light' | 'dark'

// 基础模块样式
export interface IBaseModelStyle {
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
export interface IGlobalStyle extends IBaseModelStyle {
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


// 简历标题
export interface IResumeTitleData {
  /** 简历标题 */
  title: string
}

// 基本信息
export interface IBaseInfoData {
  name: string
  gender: string
  age: string
  phone: string
  qq: string
  wx: string
  email: string
  /** 籍贯  */
  nativePlace: string 
  /** 学历 */
  degree: string
  avatar: string
}

// 教育经历
export interface IEduBackgroundItem {
  date: string
  schoolName: string
  major: string
  degree: string
  /** 课程  */
  course: string
  /** 获奖经历  */
  awards: string
}
export interface IEduBackgroundData {
  title: string
  LIST: IEduBackgroundItem[]
}

// 工作 / 项目 / 实习经历
export interface IExperienceItem {
  date: string
  companyName: string
  /** 职位  */
  position: string
  jobContent: string
}
export interface IExperienceData {
  title: string
  LIST: IExperienceItem[]
}

// 专业技能 / 自我评价
export interface IContentData {
  title: string
  content: string
}


/** 一个模块 */
export interface IMaterialItem {
  /** 实例唯一 id，拖拽/选中/编辑时定位用 */
  keyId: string
  /** 模块名 */
  model: string
  /** 物料组件名，形如 WORK_EXPERIENCE_1，对应 ModuleRenderer.vue 分支渲染的组件 */
  cptName: string
  /** 物料显示名，用于模块管理列表 */
  cptTitle: string
  /** 归属栏位 */
  layout: ModelSide
  /** 是否显示 */
  show: boolean
  /** 模块级样式 token */
  style: IBaseModelStyle
  /** 模块业务数据 */
  data: IResumeTitleData
    | IBaseInfoData
    | IEduBackgroundData
    | IExperienceData
    | IContentData
}

/** 简历 */
export interface IResumeData {
  /** 简历实例id */
  id: string
  /** 简历名称 */
  name: string
  /** 使用的模板id */
  templateId: string
  /** 布局模式 */
  layout: ResumeLayout
  /** 模块列表 */
  components: IMaterialItem[]
  /** 全局主题 */
  globalStyle: IGlobalStyle
  /** 最后更新时间，列表页展示用 */
  updatedAt: string
}


