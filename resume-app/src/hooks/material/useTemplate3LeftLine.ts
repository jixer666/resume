import type IMODELSTYLE from '@/interface/modelStyle'
import { pxTonumber } from '@/utils/common'

/**
 * 3 号模板系皮肤左侧竖线的定位：
 * 竖线贴在模块内容左边缘向外偏移 `num` 像素处。
 */
export default function useGetLineLeft(modelStyle: IMODELSTYLE, num = 15) {
  const left = computed(() => `${pxTonumber(modelStyle.pLeftRight) - num}px`)
  return {
    left,
  }
}
