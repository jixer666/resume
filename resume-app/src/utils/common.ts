import dayjs from 'dayjs'

/**
 * 材质（material）渲染层共用的纯函数工具。
 *
 * 这里的函数会被大量皮肤组件引用，因此必须满足两条约束：
 * 1. 不依赖 DOM / Node API（微信小程序端没有 window、document）
 * 2. 不引入体积敏感或平台不兼容的三方库（lodash / moment / image-conversion 等一律不用）
 */

/** px 字符串转数字，非 `xxxpx` 或空值返回 0 */
export function pxTonumber(value?: string): number {
  if (!value)
    return 0
  const num = Number.parseFloat(value)
  return Number.isNaN(num) ? 0 : num
}

/** 熟练度文字转数值（进度条宽度用） */
export function textToNumber(value: string): number {
  const map: Record<string, number> = {
    了解: 25,
    一般: 50,
    熟悉: 75,
    精通: 100,
  }
  return map[value] ?? 0
}

/** 数值转熟练度文字 */
export function numberToText(value: number): string {
  if (value <= 25)
    return '一般'
  if (value <= 50)
    return '掌握'
  if (value <= 75)
    return '熟练'
  return '精通'
}

/** 生成 32 位十六进制 id（模块 keyId / 简历 ID 用，小程序端无 crypto.randomUUID） */
export function getUuid(): string {
  const chars = '0123456789abcdef'
  let id = ''
  for (let i = 0; i < 32; i++)
    id += chars[Math.floor(Math.random() * 16)]
  return id
}

const isValidYmd = /^\d{4}-\d{1,2}$/

/**
 * 单个时间值格式化：只有 `YYYY-M` 才走 dayjs，其余（`至今`、`2021年`、空串）原样返回。
 *
 * 不能直接丢给 dayjs —— `dayjs('至今').format()` 会输出字符串 `Invalid Date`，
 * 而「至今」开关在没选开始时间时正好会写出这种值（见 experience.vue 的 buildEntry）。
 */
function formatDateValue(value: unknown): string {
  const text = String(value || '').trim()
  if (!text)
    return ''
  return isValidYmd.test(text) ? dayjs(text).format('YYYY.MM') : text
}

/**
 * 时间区间格式化：`['2015-5', '2019-6']` → `2015.05-2019.06`
 *
 * 开始 / 结束分开兜底：结束时间为「至今」这类非 `YYYY-M` 文案时原样输出，
 * 只有一端有值时只输出那一端；单值入参直接格式化。
 */
export function formatDate(date: string | string[] | undefined): string {
  if (Array.isArray(date)) {
    const [start, end] = date
    const startText = formatDateValue(start)
    const endText = formatDateValue(end)
    if (!endText)
      return startText
    return startText ? `${startText}-${endText}` : endText
  }
  return formatDateValue(date)
}
