import type IGlobalStyle from '@/interface/globalStyle'
import RESUME_JSON from '@/schema/resume'

/**
 * 简历模板 = 一份「全局样式 + 布局 + 模块皮肤」预设。
 *
 * 字段名对齐后端 `ResumeTemplateListVO` / `ResumeTemplateVO`（code / name / description / cover），
 * 后端把模板明细放在 `templateDetail` / `resumeTemplateDetail` 节点里，
 * 由 `@/api/template` 统一摊平成下面这层扁平结构后再给页面消费。
 *
 * 这里只存差异部分：套模板时把 style 合并进出厂 GLOBAL_STYLE 再扇出到各模块，
 * 所以模板不需要（也不应该）复制整份 RESUME_JSON，改基线时全部模板自动跟随。
 */
export interface IResumeTemplate {
  /** 模板编号（后端 code，走 URL query 传给编辑页） */
  code: string
  /** 模板名，卡片与详情页展示 */
  name: string
  /** 一句话说明（后端 description），详情页展示 */
  description: string
  /** 封面（后端 cover），未生成时为空串 */
  cover: string
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

/** 模板主题色：模板没配时回退出厂默认色 */
export function templateTheme(template: IResumeTemplate): string {
  return template.style?.themeColor || RESUME_JSON.GLOBAL_STYLE.themeColor
}

/** 双列模板的左栏底色，单列模板用中性浅灰（只影响封面预览） */
export function templateSideColor(template: IResumeTemplate): string {
  return template.style?.leftThemeColor || '#eef4ff'
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
