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
}

export const TEMPLATES: IResumeTemplate[] = [
  {
    id: 'classic',
    name: '经典商务',
    desc: '深蓝主色配加粗小标题，投递绝大多数岗位都不会出错',
    layout: 'classical',
    style: {
      themeColor: '#0b63ce',
      firstTitleFontSize: '20px',
      secondTitleFontSize: '14px',
      textFontSize: '14px',
      secondTitleColor: '#23304a',
      textFontColor: '#5b6b82',
      secondTitleWeight: 600,
      textFontWeight: 400,
      modelMarginTop: '0px',
      modelMarginBottom: '40px',
    },
  },
  {
    id: 'sidebar',
    name: '侧栏简历',
    desc: '顶部通栏放标题与基本信息，左侧色块承载技能与特长，右侧留给经历正文',
    layout: 'leftRight',
    style: {
      themeColor: '#0b63ce',
      leftWidth: '38%',
      rightWidth: '62%',
      leftThemeColor: '#eef4ff',
      rightThemeColor: '#ffffff',
      secondTitleColor: '#23304a',
      textFontWeight: 400,
      // 双列后每栏只剩 300~490px，沿用物料自带的 40px 左右内边距会把正文挤窄，收到 20px
      pLeftRight: '20px',
      modelMarginBottom: '32px',
      // 刻意不写 textFontColor：它会无条件盖到每个模块的 textColor 上，而 RESUME_TITLE
      // 的标题栏是「主题色底 + 白字」，被灰字盖住后基本看不见（对比度 1.05）。
    },
    // 左栏底色偏浅，左栏三件套统一换成「斜角标题 + 主题色竖线」的 _4 系列，和右侧正文拉开层次
    variants: {
      SKILL_SPECIALTIES: 'SKILL_SPECIALTIES_4',
      HOBBIES: 'HOBBIES_4',
      SELF_EVALUATION: 'SELF_EVALUATION_4',
    },
    /**
     * 只把「窄栏友好」的三个模块放进左栏，其余全部显式归入右栏。
     *
     * BASE_INFO 与 RESUME_TITLE 刻意两栏都不列：它们要的宽度远超 300px 的左栏（光头像
     * 118px + 50px 间距就吃掉大半），塞进左栏只会把姓名挤成一行四五个字。不列入任何一栏
     * 时 layoutOf 返回空串，走 ResumeRender 的通栏分支，作为顶部名片带铺满整页宽。
     * 反过来也要注意：该进右栏的模块一个都不能漏，漏掉的会掉进通栏、把左栏顶到页面最底部。
     */
    columns: {
      left: ['SKILL_SPECIALTIES', 'HOBBIES', 'SELF_EVALUATION'],
      right: [
        'JOB_INTENTION',
        'EDU_BACKGROUND',
        'CAMPUS_EXPERIENCE',
        'INTERNSHIP_EXPERIENCE',
        'WORK_EXPERIENCE',
        'PROJECT_EXPERIENCE',
        'AWARDS',
        'WORKS_DISPLAY',
      ],
    },
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
