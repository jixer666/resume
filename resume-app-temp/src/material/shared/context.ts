import type { ComputedRef, InjectionKey } from 'vue'

/**
 * 物料渲染上下文：渲染容器给每个模块 provide 它在 COMPONENTS 中的下标（响应式），
 * SectionTitle 的"编号"样式靠它生成 01 / 02 / …。
 */
export const MODULE_INDEX_KEY: InjectionKey<ComputedRef<number>> = Symbol('rs-module-index')
