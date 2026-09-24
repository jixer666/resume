<script setup lang="ts">
import type { IModelStyle } from '@/schema/types'
import { MODULE_INDEX_KEY } from './context'

/**
 * 分区标题：由 modelStyle.titleStyle 决定 8 种样式变体。
 * 换标题样式只需改 GLOBAL_STYLE.titleStyle，所有模块的标题同步变化。
 * index 由渲染容器按模块顺序 provide，供"编号"样式使用。
 */
const props = defineProps<{ title: string, modelStyle: IModelStyle }>()

const moduleIndex = inject(MODULE_INDEX_KEY, computed(() => 0))
const numText = computed(() => String(moduleIndex.value + 1).padStart(2, '0'))
</script>

<template>
  <view class="rs-title" :class="`rs-title--${props.modelStyle.titleStyle}`">
    <text v-if="props.modelStyle.titleStyle === 'num'" class="rs-title__num">{{ numText }}</text>
    <text class="rs-title__text">{{ props.title }}</text>
  </view>
</template>

<style scoped lang="scss">
/* 基线：所有变体共用的字号/字色/下边距，变体只改「标记」与「外框」。
   对齐由 GLOBAL_STYLE.titleAlign 下发（formal 等居中版式用 center） */
.rs-title {
  display: flex;
  align-items: center;
  justify-content: var(--rs-title-justify, flex-start);
  margin-bottom: calc(var(--rs-text-size) * 0.6);
  color: var(--rs-title-color);
  font-size: var(--rs-1title-size);
  font-weight: var(--rs-title-weight);
  line-height: 1.4;
  letter-spacing: 0.02em;
}

/* 编号：斜体大字压在最前，字号略大于标题，与文字基线对齐 */
.rs-title__num {
  flex: none;
  margin-right: calc(var(--rs-text-size) * 0.55);
  color: var(--rs-mark);
  font-size: calc(var(--rs-1title-size) * 1.22);
  font-weight: 800;
  font-style: italic;
  line-height: 1;
  letter-spacing: 0;
}

/* 色条：左侧竖条，高度贴合行高，宽度约等于 2px 视觉厚度 */
.rs-title--bar {
  padding-left: calc(var(--rs-text-size) * 0.75);
  border-left: calc(var(--rs-text-size) * 0.26) solid var(--rs-mark);
}

/* 下划线：整条底边，用主题色的淡化线（封面里紧凑/正式模板的下划线带主题色调） */
.rs-title--underline {
  padding-bottom: calc(var(--rs-text-size) * 0.45);
  border-bottom: 1px solid var(--rs-accent-line);
}

/* 圆点 */
.rs-title--dot::before {
  width: calc(var(--rs-text-size) * 0.42);
  height: calc(var(--rs-text-size) * 0.42);
  margin-right: calc(var(--rs-text-size) * 0.5);
  border-radius: 50%;
  background-color: var(--rs-mark);
  content: '';
}

/* 胶囊：浅色栏位是主题色实底反白字，深色栏位换成半透明白底，避免白字压浅底。
   fit-content 让底色只包住文字；原先用 align-self 在非 flex 父级上不生效，底色会拉满整行 */
.rs-title--chip {
  width: fit-content;
  padding: calc(var(--rs-text-size) * 0.28) calc(var(--rs-text-size) * 0.95);
  border-radius: var(--rs-radius-pill);
  background-color: var(--rs-chip-bg);
  color: var(--rs-chip-text);
  letter-spacing: 0.04em;
}

/* 菱形 */
.rs-title--diamond::before {
  width: calc(var(--rs-text-size) * 0.46);
  height: calc(var(--rs-text-size) * 0.46);
  margin-right: calc(var(--rs-text-size) * 0.52);
  background-color: var(--rs-mark);
  content: '';
  transform: rotate(45deg);
}

/* 软标签：浅底 + 主题色文字，深色栏位文字反白 */
.rs-title--softChip {
  width: fit-content;
  padding: calc(var(--rs-text-size) * 0.28) calc(var(--rs-text-size) * 0.9);
  border-radius: var(--rs-radius-sm);
  background-color: var(--rs-accent-soft);
  color: var(--rs-soft-chip-text);
  letter-spacing: 0.04em;
}

/* 极简：只有加粗文字 + 拉开字距，靠留白建立层级 */
.rs-title--plain {
  letter-spacing: 0.12em;
}
</style>
