/**
 * 「整理成一页」的压缩比例搜索：与渲染无关的纯逻辑，量高由调用方回调（编辑预览页）。
 *
 * 先把比例压到最低档：连它都装不下就直接放弃（省掉后面几次测量）；
 * 装得下再二分逼近 —— 下界始终是「装得下」的一档，收完就是能装下的最大比例。
 * 这样字与留白只收到「刚好够」的程度，不会为了装下而白压一大截。
 */

/** 压缩下限：再往下字号就压到 10px 档位、间距也挤成一团，不如让用户自己调 */
export const FIT_MIN_RATIO = 0.5
/** 二分次数：6 次后区间约 1%，字号本身是 2px 一档，再细没有意义 */
export const FIT_STEPS = 6
/** 内容恰好等于纸高也算装得下，留 2px 给亚像素误差 */
export const FIT_TOLERANCE = 2

/**
 * 找「能装进 limit 的最大压缩比例」。
 *
 * @param apply   套用某个压缩比例（含重渲染）
 * @param measure 量当前内容高度（px），量不到返回 0
 * @param limit   内容高度的上限（一张 A4 高 + 容差）
 * @returns 装得下时返回最大比例（≤ 1），压到最低档也装不下时返回 null
 *
 * 调用方必须先量过「不压缩（比例 1）」且确认装不下：二分拿它当上界。
 */
export async function findFitRatio(
  apply: (ratio: number) => void | Promise<void>,
  measure: () => Promise<number>,
  limit: number,
): Promise<number | null> {
  const fits = (height: number): boolean => height > 0 && height <= limit
  await apply(FIT_MIN_RATIO)
  if (!fits(await measure()))
    return null
  let low = FIT_MIN_RATIO // 已知「装得下」
  let high = 1 // 已知「装不下」（调用方量过原比例）
  for (let step = 0; step < FIT_STEPS; step++) {
    const mid = (low + high) / 2
    await apply(mid)
    if (fits(await measure()))
      low = mid
    else
      high = mid
  }
  return low
}
