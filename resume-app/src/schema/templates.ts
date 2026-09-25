import type IGlobalStyle from '@/interface/globalStyle'
import RESUME_JSON from '@/schema/resume'

/**
 * 简历模板 = 一份「全局样式 + 布局」预设。
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
    desc: '左侧色块承载基本信息与技能，右侧留给经历正文',
    layout: 'leftRight',
    style: {
      themeColor: '#0b63ce',
      leftWidth: '36%',
      rightWidth: '64%',
      leftThemeColor: '#eef4ff',
      rightThemeColor: '#ffffff',
      secondTitleColor: '#23304a',
      textFontColor: '#5b6b82',
      textFontWeight: 400,
      modelMarginBottom: '32px',
    },
    columns: { left: ['BASE_INFO', 'SKILL_SPECIALTIES', 'HOBBIES', 'SELF_EVALUATION'] },
  },
  {
    id: 'minimal',
    name: '极简留白',
    desc: '大字号标题配大面积留白，干净利落，适合设计类岗位',
    layout: 'classical',
    style: {
      themeColor: '#111827',
      firstTitleFontSize: '22px',
      secondTitleColor: '#111827',
      textFontColor: '#4b5563',
      secondTitleWeight: 600,
      textFontWeight: 400,
      pLeftRight: '18px',
      modelMarginBottom: '52px',
    },
  },
  {
    id: 'split',
    name: '双栏分栏',
    desc: '青绿点缀的左右双栏，信息密度更高，一页装下更多内容',
    layout: 'leftRight',
    style: {
      themeColor: '#0f766e',
      leftWidth: '38%',
      rightWidth: '62%',
      leftThemeColor: '#f0fdfa',
      rightThemeColor: '#ffffff',
      secondTitleColor: '#134e4a',
      textFontColor: '#4b5563',
      textFontWeight: 400,
      modelMarginBottom: '30px',
    },
    columns: { left: ['BASE_INFO', 'SKILL_SPECIALTIES', 'AWARDS', 'HOBBIES'] },
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
  },
  {
    id: 'banner',
    name: '横幅头图',
    desc: '超大标题配红色点缀，视觉冲击强，适合运营与市场岗位',
    layout: 'classical',
    style: {
      themeColor: '#dc2626',
      firstTitleFontSize: '26px',
      secondTitleFontSize: '15px',
      secondTitleColor: '#7f1d1d',
      textFontColor: '#5b6b82',
      secondTitleWeight: 700,
      textFontWeight: 400,
      modelMarginBottom: '44px',
    },
  },
  {
    id: 'compact',
    name: '紧凑列表',
    desc: '小字号高密度排布，经历多也能压在一页之内',
    layout: 'classical',
    style: {
      themeColor: '#374151',
      secondTitleFontSize: '13px',
      textFontSize: '12px',
      secondTitleColor: '#1f2937',
      textFontColor: '#4b5563',
      secondTitleWeight: 700,
      textFontWeight: 400,
      modelMarginBottom: '24px',
    },
  },
  {
    id: 'formal',
    name: '正式文书',
    desc: '靛蓝加粗标题、行距舒展，适合体制内与国企投递',
    layout: 'classical',
    style: {
      themeColor: '#1e3a8a',
      firstTitleFontSize: '21px',
      secondTitleColor: '#1e3a8a',
      textFontColor: '#374151',
      secondTitleWeight: 700,
      textFontWeight: 400,
      modelMarginBottom: '38px',
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
