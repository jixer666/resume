import { FIT_TOLERANCE } from './fit'

/**
 * 内容高度 → A4 页数（与渲染无关的纯逻辑，量高由预览页负责）。
 *
 * 为什么不直接 `ceil`：`boundingClientRect` 量到的是**缩放后**的高度，
 * 除回缩放比会把取整误差放大到 1px 上下（缩放比越小放得越大）。
 * 内容刚好一张纸时，这点误差就会让页数多出一页 —— 预览里多出一张空白纸，
 * 而且每重新分页一次就再叠一张（量到的 min-height 又成了新的基准）。
 * 所以取整前先扣掉一个容差：压线不足容差的高度不再算溢出。
 *
 * 容差直接复用「整理成一页」的 `FIT_TOLERANCE`：两处判定必须同尺度，
 * 否则会出现「整理成一页」说装得下、分页却仍多一张空白纸的矛盾。
 */
export function countPages(contentHeight: number, paperHeight: number, tolerance = FIT_TOLERANCE): number {
  if (!(contentHeight > 0) || !(paperHeight > 0))
    return 1
  return Math.max(1, Math.ceil((contentHeight - tolerance) / paperHeight))
}
