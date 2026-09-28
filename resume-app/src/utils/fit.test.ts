import { describe, expect, it } from 'vitest'
import { findFitRatio, FIT_MIN_RATIO, FIT_STEPS } from './fit'

describe('整理成一页：找能装下的最大压缩比例', () => {
  it('二分找到「刚好装下」的最大比例，不白压', async () => {
    const applied: number[] = []
    // 比例 > 0.8 时装不下（1400px），≤ 0.8 时装得下（1100px）
    const ratio = await findFitRatio(
      (r) => {
        applied.push(r)
      },
      async () => (applied[applied.length - 1] > 0.8 ? 1400 : 1100),
      1125,
    )

    expect(ratio).not.toBeNull()
    // 找到的是「装得下的最大比例」：贴着 0.8 的下沿，不会一路压到 0.5
    expect(ratio!).toBeGreaterThan(0.8 - 1 / 2 ** FIT_STEPS)
    expect(ratio!).toBeLessThanOrEqual(0.8)
    // 第一档先试最低比例：装不下就没必要再二分
    expect(applied[0]).toBe(FIT_MIN_RATIO)
  })

  it('压到最低档也装不下时返回 null，不做无谓的测量', async () => {
    let count = 0
    const ratio = await findFitRatio(
      () => {
        count += 1
      },
      async () => 1600,
      1125,
    )

    expect(ratio).toBeNull()
    expect(count).toBe(1)
  })

  it('量不到高度（0）时按装不下处理，不误判成「刚好一页」', async () => {
    const ratio = await findFitRatio(() => {}, async () => 0, 1125)
    expect(ratio).toBeNull()
  })
})
