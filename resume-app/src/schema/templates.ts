import type IGlobalStyle from '@/interface/globalStyle'
import RESUME_JSON from '@/schema/resume'

/**
 * 简历模板 = 一份「全局样式 + 布局 + 模块皮肤」预设。
 *
 * 这里只存差异部分：套模板时把 style 合并进出厂 GLOBAL_STYLE 再扇出到各模块，
 * 所以模板不需要（也不应该）复制整份 RESUME_JSON，改基线时全部模板自动跟随。
 */
export interface IResumeTemplate {
  /** 模板标识，走 URL query 传给编辑页 */
  id: string
  /** 模板名，卡片与详情页展示 */
  name: string
  /** 一句话说明，详情页展示 */
  desc: string
  /** 布局：'leftRight' 双列，其余按单列渲染（与 ResumeRender 的约定一致） */
  layout: string
  /** 全局样式覆盖值，未写的字段沿用出厂默认 */
  style: Partial<IGlobalStyle>
  /**
   * 模块名 → 皮肤 cptName（如 `WORK_EXPERIENCE: 'WORK_EXPERIENCE_8'`）。
   *
   * 光靠 style 与 layout 无法让模板产生真正的差异，皮肤才是版式的分水岭：
   * 未列出的模块沿用物料清单首套皮肤，所以只需要写出想换掉的那几个。
   */
  variants?: Partial<Record<string, string>>
  /** 双列布局下模块的左右栏归属，未列出的模块通栏 */
  columns?: { left?: string[], right?: string[] }
  /**
   * 初始不渲染的模块。
   *
   * 模块清单与渲染顺序是全工程统一的，模板只负责把它们关掉：图片版式里没有简历标题栏
   * （姓名已经进了顶部名片带），标题栏留着会和名片带打架，所以由模板声明隐藏。
   * 隐藏只是把 `show` 置 false，用户在编辑页仍可自行打开。
   */
  hidden?: string[]
}

export const TEMPLATES: IResumeTemplate[] = [
  {
    id: 'classic',
    name: '经典商务',
    desc: '顶部通栏名片带配主题色章节条，投递绝大多数岗位都不会出错',
    layout: 'classical',
    style: {
      themeColor: '#0b63ce',
      firstTitleFontSize: '18px',
      secondTitleFontSize: '14px',
      textFontSize: '14px',
      secondTitleColor: '#23304a',
      textFontColor: '#5b6b82',
      secondTitleWeight: 600,
      textFontWeight: 400,
      modelMarginTop: '0px',
      modelMarginBottom: '32px',
      // 各皮肤自带的上下内边距在 30~40px 不等，叠加 32px 的模块间距会把版式撑散；
      // 收成 0 后间距只由 modelMarginBottom 决定，章节节奏才和设计稿一致
      pTop: '0px',
      pBottom: '0px',
      // 刻意不写 pLeftRight：名片带要通栏（皮肤自带 0px），正文各模块靠自带 30px 留白
    },
    // 换成 _9 家族：整行浅主题色底纹条 + 左侧主题色竖条，对应设计稿里的章节标题
    variants: {
      BASE_INFO: 'BASE_INFO_10',
      JOB_INTENTION: 'JOB_INTENTION_9',
      EDU_BACKGROUND: 'EDU_BACKGROUND_10',
      SKILL_SPECIALTIES: 'SKILL_SPECIALTIES_13',
      CAMPUS_EXPERIENCE: 'CAMPUS_EXPERIENCE_9',
      INTERNSHIP_EXPERIENCE: 'INTERNSHIP_EXPERIENCE_9',
      WORK_EXPERIENCE: 'WORK_EXPERIENCE_9',
      PROJECT_EXPERIENCE: 'PROJECT_EXPERIENCE_9',
      AWARDS: 'AWARDS_9',
      HOBBIES: 'HOBBIES_9',
      SELF_EVALUATION: 'SELF_EVALUATION_9',
      WORKS_DISPLAY: 'WORKS_DISPLAY_9',
    },
    // 设计稿没有简历标题栏，姓名已经在名片带里，标题栏留着会叠在名片带上方
    hidden: ['RESUME_TITLE'],
  },
  {
    id: 'sidebar',
    name: '侧栏简历',
    desc: '亮蓝侧栏压白字，右侧橙棕章节线贯穿全宽，经历正文独占四分之三版面',
    layout: 'leftRight',
    /**
     * 双色方案：themeColor 只驱动右栏章节标题与下划线，栏底色另有 leftThemeColor。
     *
     * 这两个字段都不在 GLOBAL_STYLE_MAP 里，只被 ResumeRender 直接消费，所以蓝色栏底
     * 不会被扇出到模块的 style 上，橙棕标题也不会污染左栏底色。
     */
    style: {
      themeColor: '#c37530',
      leftWidth: '25%',
      rightWidth: '75%',
      leftThemeColor: '#4184ff',
      rightThemeColor: '#ffffff',
      firstTitleFontSize: '16px',
      secondTitleFontSize: '14px',
      textFontSize: '14px',
      secondTitleColor: '#23304a',
      textFontColor: '#4a4a4a',
      secondTitleWeight: 600,
      textFontWeight: 400,
      // 左栏只剩 198px，右栏 595px，沿用物料自带的 30~40px 内边距会把正文挤窄，收到 22px
      pLeftRight: '22px',
      // 章节之间靠「上一模块的 modelMarginBottom + 下一模块的 pTop」叠加成 34px，
      // 同时 pTop 也给右栏首屏留出一点起手空档，避免标题贴住页面顶边
      pTop: '14px',
      pBottom: '0px',
      modelMarginTop: '0px',
      modelMarginBottom: '20px',
    },
    /**
     * 左栏压白字的两件套是专用皮肤，右栏十个模块统一换成 ModelTitle11 薄包装：
     * 章节标题风格由皮肤里硬编码的 ModelTitle 决定，没有可配置的标题变体。
     */
    variants: {
      BASE_INFO: 'BASE_INFO_11',
      JOB_INTENTION: 'JOB_INTENTION_11',
      EDU_BACKGROUND: 'EDU_BACKGROUND_13',
      SKILL_SPECIALTIES: 'SKILL_SPECIALTIES_18',
      CAMPUS_EXPERIENCE: 'CAMPUS_EXPERIENCE_11',
      INTERNSHIP_EXPERIENCE: 'INTERNSHIP_EXPERIENCE_11',
      WORK_EXPERIENCE: 'WORK_EXPERIENCE_11',
      PROJECT_EXPERIENCE: 'PROJECT_EXPERIENCE_11',
      AWARDS: 'AWARDS_11',
      HOBBIES: 'HOBBIES_11',
      SELF_EVALUATION: 'SELF_EVALUATION_11',
      WORKS_DISPLAY: 'WORKS_DISPLAY_11',
    },
    /**
     * 左栏只放「头像+姓名+联系方式」与「求职意向」，其余全部显式归入右栏。
     *
     * 右栏的模块一个都不能漏：漏掉的会掉进通栏、占满整页宽，把左栏从第一条经历处顶到页底。
     */
    columns: {
      left: ['BASE_INFO', 'JOB_INTENTION'],
      right: [
        'EDU_BACKGROUND',
        'SKILL_SPECIALTIES',
        'CAMPUS_EXPERIENCE',
        'INTERNSHIP_EXPERIENCE',
        'WORK_EXPERIENCE',
        'PROJECT_EXPERIENCE',
        'AWARDS',
        'HOBBIES',
        'SELF_EVALUATION',
        'WORKS_DISPLAY',
      ],
    },
    // 版式顶部没有简历标题栏，姓名已经在左栏名片里，标题栏留着会横在蓝栏上把版式切断
    hidden: ['RESUME_TITLE'],
  },
  {
    id: 'timeline',
    name: '时间轴',
    desc: '紫色分区标题，模块之间留白充足，适合项目经历较多的人',
    layout: 'classical',
    style: {
      themeColor: '#6d28d9',
      firstTitleFontSize: '21px',
      secondTitleColor: '#4c1d95',
      textFontColor: '#5b6b82',
      secondTitleWeight: 600,
      textFontWeight: 400,
      modelMarginBottom: '42px',
    },
    // 全部换成 _8 时间轴家族（主题色竖线 + 圆点时间轴），这是模板名「时间轴」的来源
    variants: {
      JOB_INTENTION: 'JOB_INTENTION_8',
      EDU_BACKGROUND: 'EDU_BACKGROUND_8',
      SKILL_SPECIALTIES: 'SKILL_SPECIALTIES_10',
      CAMPUS_EXPERIENCE: 'CAMPUS_EXPERIENCE_8',
      INTERNSHIP_EXPERIENCE: 'INTERNSHIP_EXPERIENCE_8',
      WORK_EXPERIENCE: 'WORK_EXPERIENCE_8',
      PROJECT_EXPERIENCE: 'PROJECT_EXPERIENCE_8',
      AWARDS: 'AWARDS_8',
      HOBBIES: 'HOBBIES_8',
      SELF_EVALUATION: 'SELF_EVALUATION_8',
      WORKS_DISPLAY: 'WORKS_DISPLAY_8',
    },
  },
]

/** 按 id 取模板，id 非法时返回 undefined（详情页据此兜展示态） */
export function getTemplate(id: string): IResumeTemplate | undefined {
  return TEMPLATES.find(item => item.id === id)
}

/** 模板主题色：模板没配时回退出厂默认色 */
export function templateTheme(template: IResumeTemplate): string {
  return template.style.themeColor || RESUME_JSON.GLOBAL_STYLE.themeColor
}

/** 双列模板的左栏底色，单列模板用中性浅灰（只影响封面预览） */
export function templateSideColor(template: IResumeTemplate): string {
  return template.style.leftThemeColor || '#eef4ff'
}

/** 解析 3 / 6 位 hex，失败返回 null */
function parseHex(color: string): [number, number, number] | null {
  const value = color.trim().replace('#', '')
  const full = value.length === 3 ? value.split('').map(char => char + char).join('') : value
  if (!/^[0-9a-f]{6}$/i.test(full))
    return null
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ]
}

/**
 * 主题色兑白：`ratio` 越大越浅（0.35 约等于提亮一档），用来做渐变的收尾色。
 *
 * 解析失败时原样返回，宁可少一层渐变也不要把颜色写坏。
 */
export function lightenColor(color: string, ratio: number): string {
  const rgb = parseHex(color)
  if (!rgb)
    return color
  const mixed = rgb.map(channel => Math.round(channel + (255 - channel) * ratio)) as [number, number, number]
  const [r, g, b] = mixed
  return `#${[r, g, b].map(channel => channel.toString(16).padStart(2, '0')).join('')}`
}

/**
 * 主题色转半透明：压在白底上当浅色衬底用（标签、提示卡、封面衬底）。
 */
export function alphaColor(color: string, alpha: number): string {
  const rgb = parseHex(color)
  if (!rgb)
    return `rgb(148 163 184 / ${alpha})`
  const [r, g, b] = rgb
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * 封面衬底：主题色兑白后的极浅渐变。
 *
 * 封面本身是白纸，直接放在灰底卡片上会显得很空，垫一层同色系浅底能把主题色透出来。
 */
export function coverBackdrop(color: string): string {
  return `linear-gradient(160deg, ${alphaColor(color, 0.14)} 0%, ${alphaColor(color, 0.04)} 100%)`
}
