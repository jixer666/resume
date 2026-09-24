import type { IModelStyle } from '@/schema/types'
import { withAlpha } from '@/schema/style'

/**
 * 物料组件的样式注入：把模块级样式 token 转成 CSS 变量挂到根节点。
 *
 * 物料组件自身不感知 GLOBAL_STYLE，只消费 var(--rs-xxx)；
 * 于是 GLOBAL_STYLE 改一处，所有模块的 CSS 变量跟着变，整份简历同步更新。
 *
 * 条目形态（entryStyle）也在这里被翻译成一组 --rs-entry-* 变量：
 * 物料组件写一次「卡片长什么样」，11 款模板通过换 token 得到不同外观。
 */

/** 按倍率缩放 '14px' 形式的尺寸值 */
function scale(value: string, ratio: number): string {
  const size = Number.parseFloat(value)
  if (Number.isNaN(size))
    return value
  return `${Math.round(size * ratio * 2) / 2}px`
}

/** 按倍率缩放 '6px' 形式的圆角，并给出不小于 2px 的下限 */
function radius(value: string, ratio: number): string {
  const size = Number.parseFloat(value)
  if (Number.isNaN(size))
    return value
  return `${Math.max(2, Math.round(size * ratio))}px`
}

/** 样式 token → CSS 变量对象，供 :style 绑定 */
export function toCssVars(style: IModelStyle): Record<string, string> {
  const entry = entryVars(style)
  // 弱化层次：把透明度烘进颜色，物料只管取 muted / subtle / faint 三档，
  // 不再各处手写 opacity，深浅栏位都能得到同一套相对层次。
  const muted = withAlpha(style.textColor, 0.72)
  const subtle = withAlpha(style.textColor, 0.55)
  const faint = withAlpha(style.textColor, 0.38)
  // 整块卡片化：一个分区一张白卡（边框 + 圆角 + 内边距），普通流式时全部归零
  const carded = style.moduleCard === 'card'
  return {
    '--rs-theme': style.themeColor,
    '--rs-1title-size': style.firstTitleFontSize,
    '--rs-2title-size': style.titleFontSize,
    '--rs-hero-size': scale(style.firstTitleFontSize, 1.7),
    '--rs-title-color': style.titleColor,
    '--rs-title-weight': String(style.titleFontWeight),
    // 分区标题对齐：flex 容器的 justify 值
    '--rs-title-justify': style.titleAlign === 'center' ? 'center' : 'flex-start',
    '--rs-text-size': style.textFontSize,
    '--rs-text-color': style.textColor,
    '--rs-text-weight': String(style.textFontWeight),
    '--rs-bg': style.backgroundColor,
    '--rs-px': style.pLeftRight,
    '--rs-pt': style.pTop,
    '--rs-pb': style.pBottom,
    '--rs-mt': style.mTop,
    '--rs-mb': style.mBottom,
    '--rs-lh': style.lineHeight,
    // 弱化文字三档：日期/等级用 muted，标签用 subtle，装饰性文字用 faint
    '--rs-muted': muted,
    '--rs-subtle': subtle,
    '--rs-faint': faint,
    '--rs-avatar-radius': style.avatarShape === 'square' ? radius(style.cardRadius, 1.2) : '50%',
    '--rs-accent-soft': style.accentSoft,
    // 软标签描边与进度条底：比 accentSoft 稍实一点，浅底上才看得见边界
    '--rs-accent-line': withAlpha(style.themeColor, 0.32),
    '--rs-divider': style.dividerColor,
    '--rs-card-bg': style.cardBg,
    '--rs-card-radius': style.cardRadius,
    // 圆角族：由 cardRadius 派生，换卡片圆角即整份简历的圆角同步变化
    '--rs-radius-xs': radius(style.cardRadius, 0.4),
    '--rs-radius-sm': radius(style.cardRadius, 0.65),
    '--rs-radius-md': style.cardRadius,
    '--rs-radius-lg': radius(style.cardRadius, 1.5),
    '--rs-radius-pill': '999px',
    // 整块卡片化（moduleCard = 'card'）：外壳的边框/圆角/内边距由这三个变量表达
    '--rs-module-pad': carded ? `calc(${style.textFontSize} * 1.05) calc(${style.textFontSize} * 1.2)` : '0px',
    '--rs-module-border': carded ? `1px solid ${style.dividerColor}` : '0px solid transparent',
    '--rs-module-radius': carded ? radius(style.cardRadius, 1.4) : '0px',
    // 深色栏位（如深蓝侧边栏）上，标题色条与圆点这类实心标记要反白才看得见
    '--rs-mark': style.sideTone === 'dark' ? 'rgb(255 255 255 / 70%)' : style.themeColor,
    // 胶囊标题：浅色栏位是主题色实底，深色栏位主题色已被提亮成浅色，改用半透明白底
    '--rs-chip-bg': style.sideTone === 'dark' ? 'rgb(255 255 255 / 16%)' : style.themeColor,
    // 胶囊文字始终反白：两种底色都是深色系，白字才压得住
    '--rs-chip-text': '#ffffff',
    // 软标签文字：浅色栏位用主题色，深色栏位主题色偏淡，直接反白
    '--rs-soft-chip-text': style.sideTone === 'dark' ? '#ffffff' : style.themeColor,
    ...entry,
  }
}

/**
 * 条目形态 → 形态变量。plain 不产生任何边框/底色，因此变量值都取中性量。
 *
 * 物料里统一写 `.entry { padding: var(--rs-entry-pad); border-left: var(--rs-entry-accent) ... }`
 * 与 `.entry + .entry { margin-top: var(--rs-entry-gap); padding-top: var(--rs-entry-pad-top); border-top: var(--rs-entry-line) }`，
 * 四种形态的差异全部由这里的变量值表达。
 *
 * 条目间距一律取模板的 entryGap，内边距按字号推导：
 * 间距由模板控制、呼吸感由字号控制，两者互不干扰，换模板才调得动节奏。
 */
function entryVars(style: IModelStyle): Record<string, string> {
  const size = style.textFontSize
  const base = {
    '--rs-entry-gap': style.entryGap,
    '--rs-entry-pad': '0px',
    '--rs-entry-pad-top': '0px',
    '--rs-entry-radius': '0px',
    '--rs-entry-bg': 'transparent',
    '--rs-entry-border': '0px solid transparent',
    '--rs-entry-accent': '0px solid transparent',
    '--rs-entry-line': '0px solid transparent',
  }
  switch (style.entryStyle) {
    // 分隔线：条目之间一条细线，最克制。线只占左侧一段，右侧留白，避免整行横线把版面切碎
    case 'divider':
      return {
        ...base,
        '--rs-entry-pad-top': `calc(${size} * 0.5)`,
        '--rs-entry-line': `1px solid ${style.dividerColor}`,
      }
    // 卡片：条目自带底色与圆角，四周留白
    case 'card':
      return {
        ...base,
        '--rs-entry-pad': `calc(${size} * 0.7) calc(${size} * 0.9)`,
        '--rs-entry-pad-top': `calc(${size} * 0.7)`,
        '--rs-entry-radius': style.cardRadius,
        '--rs-entry-bg': style.cardBg,
        '--rs-entry-border': `1px solid ${style.dividerColor}`,
        // 卡片自身已有完整边框，左侧长手属性与 .entry + .entry 的上边框会覆盖简写，
        // 必须给同色值，否则左边框与第 2 个起卡片的上边框被抹成透明
        '--rs-entry-accent': `1px solid ${style.dividerColor}`,
        '--rs-entry-line': `1px solid ${style.dividerColor}`,
      }
    // 衬底条：左侧一条主题色，像引文。左侧内边距要盖住色条宽度再留一点呼吸
    case 'band':
      return {
        ...base,
        '--rs-entry-pad': `calc(${size} * 0.3) 0 calc(${size} * 0.3) calc(${size} * 0.9)`,
        '--rs-entry-pad-top': `calc(${size} * 0.3)`,
        '--rs-entry-accent': `calc(${size} * 0.2) solid ${style.themeColor}`,
      }
    default:
      return base
  }
}
