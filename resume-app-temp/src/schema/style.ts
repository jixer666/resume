import type { EntryStyle, IGlobalStyle, IModelStyle, ModelSide, SideTone, TitleStyle } from './types'

/** 把 '#rrggbb' 解析成 rgb 三元组，解析失败返回 null */
function parseHex(color: string): [number, number, number] | null {
  const text = String(color || '').trim().replace('#', '')
  const full = text.length === 3 ? text.split('').map(c => c + c).join('') : text
  if (full.length !== 6 || !/^[\da-f]{6}$/i.test(full))
    return null
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ]
}

/** 主题色向白色混合，得到柔和底色；非 hex 颜色回退到浅灰 */
export function softenColor(color: string, ratio = 0.9): string {
  const rgb = parseHex(color)
  if (!rgb)
    return '#f1f5f9'
  const mixed = rgb.map(channel => Math.round(channel + (255 - channel) * ratio))
  return `rgb(${mixed.join(', ')})`
}

/**
 * 主题色向白色混合，得到分隔线颜色。
 * 分隔线要比柔和底色略深一档，才能在两块浅底之间被看见，所以 ratio 取小值。
 */
export function dividerColorOf(color: string): string {
  return softenColor(color, 0.74)
}

/**
 * 给颜色叠一层透明度，用来做「弱化文字」的层次。
 *
 * 原先各处直接写 opacity: 0.6~0.9，值域散乱且会连带把子元素一起淡化；
 * 改成预先把透明度烘进颜色里，物料只管用 var(--rs-muted) / var(--rs-subtle) / var(--rs-faint)，
 * 层次就由这一处统一决定，也便于深色栏位上的浅色文字同样适用。
 */
export function withAlpha(color: string, alpha: number): string {
  const text = String(color || '').trim()
  const hex = parseHex(text)
  if (hex)
    return `rgb(${hex.join(' ')} / ${alpha})`
  // 已是 rgb()/rgba() 形式（深色栏位下发的是半透明白），替换掉原有 alpha
  const matched = text.match(/^rgba?\(([^)]+)\)$/i)
  if (matched) {
    const channels = matched[1].split(/[,\s/]+/).filter(Boolean).slice(0, 3)
    if (channels.length === 3)
      return `rgb(${channels.join(' ')} / ${alpha})`
  }
  return text
}

/** 颜色是否偏深：按感知亮度加权，用于判断栏位要不要反白 */
function isDarkColor(color: string): boolean {
  const rgb = parseHex(color)
  if (!rgb)
    return false
  const [r, g, b] = rgb
  return (r * 299 + g * 587 + b * 114) / 1000 < 140
}

/** 取某个栏位的底色：主栏看模块底色与纸张底色，两栏看栏位自己的底色 */
function sideBackground(style: IGlobalStyle, side: ModelSide): string {
  if (side === 'left')
    return style.leftThemeColor
  if (side === 'right')
    return style.rightThemeColor
  return style.backgroundColor || style.pageBackground
}

/**
 * 判断栏位色调：深色栏位（如侧边栏模板的深蓝左栏）需要反白文字，
 * 否则会得到「深灰字压深蓝底」这种几乎看不清的组合。
 */
export function resolveSideTone(style: IGlobalStyle, side: ModelSide): SideTone {
  return isDarkColor(sideBackground(style, side)) ? 'dark' : 'light'
}

/** 深色栏位上的取色：标题反白、正文与线条改半透明白，主题色提亮到看得清 */
function darkTone(themeColor: string) {
  return {
    themeColor: softenColor(themeColor, 0.45),
    titleColor: '#ffffff',
    textColor: 'rgb(255 255 255 / 82%)',
    accentSoft: 'rgb(255 255 255 / 14%)',
    dividerColor: 'rgb(255 255 255 / 24%)',
    cardBg: 'rgb(255 255 255 / 8%)',
  }
}

/** 全局主题默认值：所有模板的样式基线 */
export const DEFAULT_GLOBAL_STYLE: IGlobalStyle = {
  themeColor: '#2563eb',
  firstTitleFontSize: '18px',
  titleFontSize: '14px',
  titleColor: '#172033',
  titleFontWeight: 600,
  textFontSize: '13px',
  textColor: '#4b5563',
  textFontWeight: 400,
  backgroundColor: '#ffffff',
  pLeftRight: '40px',
  // 页面级上下留白：由 ResumeRenderer 消费，保证首个模块不贴纸张顶边
  pTop: '24px',
  pBottom: '24px',
  mTop: '0px',
  mBottom: '16px',
  lineHeight: '1.6',
  fontFamily: '',
  leftWidth: '270px',
  rightWidth: 'auto',
  leftThemeColor: '',
  rightThemeColor: '',
  pageBackground: '#ffffff',
  topBarHeight: '0px',
  titleStyle: 'bar',
  titleAlign: 'left',
  avatarShape: 'circle',
  moduleCard: 'none',
  entryStyle: 'plain',
  entryGap: '9px',
  cardRadius: '6px',
  // 留空表示按 themeColor 自动推导，模板只改主题色就能连带换掉柔和底与分隔线
  accentSoft: '',
  dividerColor: '',
  cardBg: '',
  sideTone: 'light',
}

/** 模块级样式 token 的默认值：未单独配置时由 GLOBAL_STYLE 下发 */
export const DEFAULT_MODEL_STYLE: IModelStyle = {
  themeColor: DEFAULT_GLOBAL_STYLE.themeColor,
  firstTitleFontSize: DEFAULT_GLOBAL_STYLE.firstTitleFontSize,
  titleFontSize: DEFAULT_GLOBAL_STYLE.titleFontSize,
  titleColor: DEFAULT_GLOBAL_STYLE.titleColor,
  titleFontWeight: DEFAULT_GLOBAL_STYLE.titleFontWeight,
  textFontSize: DEFAULT_GLOBAL_STYLE.textFontSize,
  textColor: DEFAULT_GLOBAL_STYLE.textColor,
  textFontWeight: DEFAULT_GLOBAL_STYLE.textFontWeight,
  backgroundColor: 'transparent',
  pLeftRight: DEFAULT_GLOBAL_STYLE.pLeftRight,
  pTop: DEFAULT_GLOBAL_STYLE.pTop,
  pBottom: DEFAULT_GLOBAL_STYLE.pBottom,
  mTop: DEFAULT_GLOBAL_STYLE.mTop,
  mBottom: DEFAULT_GLOBAL_STYLE.mBottom,
  lineHeight: DEFAULT_GLOBAL_STYLE.lineHeight,
  titleStyle: DEFAULT_GLOBAL_STYLE.titleStyle,
  titleAlign: DEFAULT_GLOBAL_STYLE.titleAlign,
  avatarShape: DEFAULT_GLOBAL_STYLE.avatarShape,
  moduleCard: DEFAULT_GLOBAL_STYLE.moduleCard,
  entryStyle: DEFAULT_GLOBAL_STYLE.entryStyle,
  entryGap: DEFAULT_GLOBAL_STYLE.entryGap,
  cardRadius: DEFAULT_GLOBAL_STYLE.cardRadius,
  accentSoft: DEFAULT_GLOBAL_STYLE.accentSoft,
  dividerColor: DEFAULT_GLOBAL_STYLE.dividerColor,
  cardBg: DEFAULT_GLOBAL_STYLE.cardBg,
  sideTone: DEFAULT_GLOBAL_STYLE.sideTone,
}

/**
 * 把 GLOBAL_STYLE 拍平成模块级样式 token，再用模块自身的覆盖值盖在上面。
 *
 * accentSoft / dividerColor / cardBg 允许留空，留空时按主题色自动推导，
 * 于是「换主题色」能连带把柔和底、分隔线一起换掉，不必逐个模板手写灰阶。
 *
 * side 决定模块落在哪一栏：深色侧边栏上的模块会被整体反白，
 * 免得深灰正文压在深蓝底上。两栏布局下模块底色一律透明，
 * 否则模块会铺一层白底把栏位自己的底色盖掉。
 */
export function buildModelStyle(globalStyle: IGlobalStyle, override?: Partial<IModelStyle>, side: ModelSide = 'main'): IModelStyle {
  const { themeColor, firstTitleFontSize, titleFontSize, titleColor, titleFontWeight, textFontSize, textColor, textFontWeight, backgroundColor, pLeftRight, pTop, pBottom, mTop, mBottom, lineHeight, titleStyle, titleAlign, avatarShape, moduleCard, entryStyle, entryGap, cardRadius, accentSoft, dividerColor, cardBg } = globalStyle
  const tone = resolveSideTone(globalStyle, side)
  const dark = tone === 'dark' ? darkTone(themeColor) : null
  return {
    themeColor: dark ? dark.themeColor : themeColor,
    firstTitleFontSize,
    titleFontSize,
    titleColor: dark ? dark.titleColor : titleColor,
    titleFontWeight,
    textFontSize,
    textColor: dark ? dark.textColor : textColor,
    textFontWeight,
    backgroundColor: side === 'main' ? backgroundColor : 'transparent',
    pLeftRight,
    pTop,
    pBottom,
    mTop,
    mBottom,
    lineHeight,
    titleStyle,
    titleAlign,
    avatarShape,
    moduleCard,
    entryStyle,
    entryGap,
    cardRadius,
    accentSoft: dark ? dark.accentSoft : (accentSoft || softenColor(themeColor)),
    dividerColor: dark ? dark.dividerColor : (dividerColor || dividerColorOf(themeColor)),
    cardBg: dark ? dark.cardBg : (cardBg || softenColor(themeColor, 0.94)),
    sideTone: tone,
    ...override,
  }
}

/** 样式编辑：可选主题色 */
export const styleThemeColors = ['#2563eb', '#1e3a5f', '#0d9488', '#7c3aed', '#ea580c', '#16a34a', '#dc2626', '#334155']

/** 样式编辑：字号档位（相对基线的倍率） */
export const fontScaleOptions = [
  { label: '小', value: 0.9 },
  { label: '标准', value: 1 },
  { label: '大', value: 1.1 },
  { label: '特大', value: 1.25 },
]

/** 样式编辑：行距档位（相对基线的倍率） */
export const lineScaleOptions = [
  { label: '紧凑', value: 0.9 },
  { label: '标准', value: 1 },
  { label: '宽松', value: 1.15 },
  { label: '特宽', value: 1.3 },
]

/** 样式编辑：字体族 */
export const fontFamilyOptions = [
  { label: '默认', value: '' },
  { label: '衬线', value: 'serif' },
  { label: '等宽', value: 'monospace' },
]

/** 样式编辑：分区标题样式 */
export const titleStyleOptions: Array<{ label: string, value: TitleStyle }> = [
  { label: '色条', value: 'bar' },
  { label: '下划线', value: 'underline' },
  { label: '圆点', value: 'dot' },
  { label: '胶囊', value: 'chip' },
  { label: '编号', value: 'num' },
  { label: '菱形', value: 'diamond' },
  { label: '软标签', value: 'softChip' },
  { label: '极简', value: 'plain' },
]

/** 样式编辑：条目外观 */
export const entryStyleOptions: Array<{ label: string, value: EntryStyle }> = [
  { label: '无框', value: 'plain' },
  { label: '分隔线', value: 'divider' },
  { label: '卡片', value: 'card' },
  { label: '衬底条', value: 'band' },
]

/** 按倍率缩放一条 '14px' 形式的尺寸值 */
function scaleSize(value: string, scale: number): string {
  const size = Number.parseFloat(value)
  if (Number.isNaN(size))
    return value
  return `${Math.round(size * scale * 2) / 2}px`
}

/** 按字号倍率重算 GLOBAL_STYLE 的字号与间距字段，其余字段保持不变 */
export function scaleGlobalStyle(style: IGlobalStyle, scale: number): IGlobalStyle {
  if (scale === 1)
    return style
  return {
    ...style,
    firstTitleFontSize: scaleSize(style.firstTitleFontSize, scale),
    titleFontSize: scaleSize(style.titleFontSize, scale),
    textFontSize: scaleSize(style.textFontSize, scale),
    entryGap: scaleSize(style.entryGap, scale),
    cardRadius: scaleSize(style.cardRadius, scale),
  }
}

/** 按行距倍率重算 GLOBAL_STYLE 的 lineHeight */
export function scaleLineHeight(style: IGlobalStyle, scale: number): IGlobalStyle {
  const base = Number.parseFloat(style.lineHeight)
  if (Number.isNaN(base))
    return style
  return { ...style, lineHeight: String(Math.round(base * scale * 100) / 100) }
}

/** 判断一份 GLOBAL_STYLE 是否仍是某模板的默认样式（用于"恢复默认样式"） */
export function isSameStyle(a: IGlobalStyle, b: IGlobalStyle): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

/** 生成实例 id，用于模块的 keyId */
export function getUuid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
}
