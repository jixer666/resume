/**
 * 样式面板（StyleSheet）的共享选项：全局样式栏与组件样式栏共用，
 * 避免两栏各自维护同一批色板 / 字号档位 / 字重档位。
 */

/** 主题色色板：覆盖物料里出现过的主题色，保证换肤后仍能点回接近的色 */
export const THEME_COLORS = ['#079cfa', '#0b70bd', '#254665', '#333333', '#da180f', '#000000']

/** 文字色板：标题与正文共用 */
export const TEXT_COLORS = ['#121c26', '#333333', '#666666', '#757575', '#8c8c8c', '#b0b0b0']

/** 字号档位：与 resume-design 的 useFontSizeList 对齐（10px 起、步长 2px、到 60px） */
export const FONT_SIZES = Array.from({ length: 26 }, (_, index) => `${10 + index * 2}px`)

/** 字重档位：font-weight 标准 9 档；picker 的 range 只吃字符串，故另存一份 */
export const FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900]
export const WEIGHT_RANGE = FONT_WEIGHTS.map(String)

/** 字号在档位里的下标，找不到回落到第一档 */
export function fontSizeIndex(value?: string): number {
  const index = FONT_SIZES.indexOf(String(value || ''))
  return index >= 0 ? index : 0
}

/** 字重在档位里的下标，找不到回落到 400 */
export function weightIndex(value?: number): number {
  const index = FONT_WEIGHTS.indexOf(Number(value))
  return index >= 0 ? index : 4
}
