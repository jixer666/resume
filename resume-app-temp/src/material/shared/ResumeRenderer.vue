<script setup lang="ts">
import type { IResumeJson } from '@/schema/types'
import { componentsOf, isTwoColumn } from '@/schema/resume'
import ModuleRenderer from './ModuleRenderer.vue'

/**
 * 简历渲染容器：吃一份简历 JSON，按 LAYOUT 分发到单栏/双栏，再逐模块动态渲染物料组件。
 *
 * 编辑、预览、导出复用同一个容器 —— 同一份 JSON + 同一套物料，
 * 所以「所见即所得」不需要两套渲染代码。
 */
const props = defineProps<{ json: IResumeJson }>()

/** 两栏布局：左栏模块 */
const leftList = computed(() => componentsOf(props.json, 'left'))
/** 两栏布局：右栏模块 */
const rightList = computed(() => componentsOf(props.json, 'right'))
/** 单栏布局：全部模块 */
const mainList = computed(() => componentsOf(props.json, 'main'))
/** 是否走左右两列 */
const twoColumn = computed(() => isTwoColumn(props.json))
/** 两栏布局下归属 main 的模块：横向通栏，排在两栏之上（如顶部名片/横幅） */
const topList = computed(() => (twoColumn.value ? componentsOf(props.json, 'main') : []))

/** 模块 keyId → 在 COMPONENTS 中的下标，供标题「编号」样式使用 */
const indexMap = computed(() => {
  const map = new Map<string, number>()
  props.json.COMPONENTS.forEach((item, index) => map.set(item.keyId, index))
  return map
})
function indexOf(keyId: string): number {
  return indexMap.value.get(keyId) ?? 0
}

/** 页面级样式：字体族、纸张底色与页面留白来自 GLOBAL_STYLE */
const pageVars = computed(() => {
  const style = props.json.GLOBAL_STYLE
  return {
    '--rs-font-family': style.fontFamily || 'inherit',
    '--rs-page-bg': style.pageBackground,
    '--rs-page-theme': style.themeColor,
    '--rs-top-bar': style.topBarHeight || '0px',
    '--rs-left-width': style.leftWidth,
    '--rs-right-width': style.rightWidth,
    '--rs-left-bg': style.leftThemeColor || 'transparent',
    '--rs-right-bg': style.rightThemeColor || 'transparent',
    // 页面留白在容器上消费（见样式表），模块自身只负责间距
    '--rs-pt': style.pTop,
    '--rs-pb': style.pBottom,
    '--rs-px': style.pLeftRight,
  }
})
</script>

<template>
  <view class="rs-page" :style="pageVars">
    <view v-if="topList.length" class="rs-page__top">
      <ModuleRenderer
        v-for="item in topList"
        :key="item.keyId"
        :item="item"
        :index="indexOf(item.keyId)"
      />
    </view>
    <view v-if="twoColumn" class="rs-page__columns" :class="{ 'rs-page__columns--offset': topList.length }">
      <view class="rs-page__col rs-page__col--left">
        <ModuleRenderer
          v-for="item in leftList"
          :key="item.keyId"
          :item="item"
          :index="indexOf(item.keyId)"
        />
      </view>
      <view class="rs-page__col rs-page__col--right">
        <ModuleRenderer
          v-for="item in rightList"
          :key="item.keyId"
          :item="item"
          :index="indexOf(item.keyId)"
        />
      </view>
    </view>
    <view v-else class="rs-page__main">
      <ModuleRenderer
        v-for="item in mainList"
        :key="item.keyId"
        :item="item"
        :index="indexOf(item.keyId)"
      />
    </view>
  </view>
</template>

<style scoped lang="scss">
/*
 * 纸张顶部色条：classic 等封面在顶边有一条主题色细带，高度由 topBarHeight 控制
 */
.rs-page::before {
  display: block;
  height: var(--rs-top-bar);
  background-color: var(--rs-page-theme);
  content: '';
}

.rs-page {
  box-sizing: border-box;
  width: 100%;
  background-color: var(--rs-page-bg);
  font-family: var(--rs-font-family);
}

/*
 * 页面留白由容器统一给出，模块自身不再带上下内边距：
 * 单栏看 .rs-page__main，两栏看各栏位，通栏区看 .rs-page__top。
 * 这样首个模块不会贴纸张顶边，而侧边栏的底色又能满铺到纸张边缘。
 * 横幅类模块（BASE_INFO_4）用负 margin 抵消这层留白实现满铺出血。
 */
.rs-page__top {
  box-sizing: border-box;
  width: 100%;
  padding: var(--rs-pt) var(--rs-px) 0;
}

.rs-page__main {
  box-sizing: border-box;
  width: 100%;
  padding: var(--rs-pt) var(--rs-px) var(--rs-pb);
}

.rs-page__columns {
  display: flex;
  align-items: stretch;
  box-sizing: border-box;
  width: 100%;
}

/* 通栏区已经垫了底部间距，两栏不再重复留顶部留白 */
.rs-page__columns--offset {
  padding-top: 0;
}

.rs-page__col {
  box-sizing: border-box;
  padding: var(--rs-pt) var(--rs-px) var(--rs-pb);
}

.rs-page__col--left {
  flex: 0 0 var(--rs-left-width);
  background-color: var(--rs-left-bg);
}

.rs-page__col--right {
  flex: 1 1 var(--rs-right-width);
  background-color: var(--rs-right-bg);
}
</style>
