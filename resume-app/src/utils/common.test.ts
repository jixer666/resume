import { describe, expect, it } from 'vitest'
import { formatDate } from './common'

/**
 * `formatDate` 是全部皮肤与编辑页共用的时间格式化入口，
 * 这里锁住三类输入的输出：「至今」等文案原样透传、`YYYY-M` 归一成 `YYYY.MM`、单端缺失只输出一端。
 */
describe('formatDate', () => {
  it('时间区间：两个月份都归一成 YYYY.MM 并用 - 连接', () => {
    expect(formatDate(['2015-5', '2019-06'])).toBe('2015.05-2019.06')
  })

  it('时间区间：结束为「至今」时原样输出，不再走 dayjs', () => {
    expect(formatDate(['2015-5', '至今'])).toBe('2015.05-至今')
  })

  it('时间区间：只有「至今」时输出「至今」，不输出 Invalid Date', () => {
    expect(formatDate(['至今'])).toBe('至今')
  })

  it('时间区间：只有开始时间时只输出开始时间', () => {
    expect(formatDate(['2015-5', ''])).toBe('2015.05')
  })

  it('时间区间：空数组输出空串', () => {
    expect(formatDate([])).toBe('')
  })

  it('单值：YYYY-M 归一成 YYYY.MM', () => {
    expect(formatDate('2019-6')).toBe('2019.06')
  })

  it('单值：「至今」这类文案原样输出', () => {
    expect(formatDate('至今')).toBe('至今')
  })

  it('单值：空值输出空串', () => {
    expect(formatDate(undefined)).toBe('')
    expect(formatDate('')).toBe('')
  })
})
