<script lang="ts" setup>
import type { IMATERIALITEM } from '@/interface/material'
import type IRESUMEJSON from '@/interface/resume'
import RenderItem from './RenderItem.vue'

/**
 * 简历渲染容器：吃一份简历 JSON，按 LAYOUT 分发到单列 / 双列，再逐模块交给 RenderItem。
 *
 * 编辑预览、H5 导出预览共用这一层，所以「所见即所得」不需要两套渲染代码。
 * 不读 store，只认 props，方便 H5 预览页（P5 puppeteer 出 PDF）直接复用。
 */
const props = defineProps<{
  json: IRESUMEJSON
}>()

const components = computed<IMATERIALITEM[]>(() => props.json?.COMPONENTS || [])

/** 左右两列布局 */
const isTwoColumn = computed(() => props.json?.LAYOUT === 'leftRight')

/**
 * 通栏模块：单列布局下就是全部模块；
 * 双列布局下是没归属左右栏的模块（顶部名片、横幅等），排在两列之上，避免被漏渲染。
 */
const mainList = computed(() =>
  isTwoColumn.value
    ? components.value.filter(item => item.layout !== 'left' && item.layout !== 'right')
    : components.value,
)
const leftList = computed(() => components.value.filter(item => item.layout === 'left'))
const rightList = computed(() => components.value.filter(item => item.layout === 'right'))

const globalStyle = computed(() => props.json?.GLOBAL_STYLE || {})

const rootStyle = computed(() => ({
  fontFamily: globalStyle.value.fontFamily || '',
}))
const leftColumnStyle = computed(() => ({
  width: globalStyle.value.leftWidth || '35%',
  backgroundColor: globalStyle.value.leftThemeColor || '',
}))
const rightColumnStyle = computed(() => ({
  backgroundColor: globalStyle.value.rightThemeColor || '',
}))
</script>

<template>
  <view class="rs-page" :style="rootStyle">
    <view v-if="mainList.length" class="rs-page__main">
      <RenderItem v-for="item in mainList" :key="item.keyId" :item="item" />
    </view>
    <view v-if="isTwoColumn" class="rs-page__columns">
      <view class="rs-page__col rs-page__col--left" :style="leftColumnStyle">
        <RenderItem v-for="item in leftList" :key="item.keyId" :item="item" />
      </view>
      <view class="rs-page__col rs-page__col--right" :style="rightColumnStyle">
        <RenderItem v-for="item in rightList" :key="item.keyId" :item="item" />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/*
 * 内容不足一张 A4 时也要撑满整张纸（1123px），否则左栏主题色底色只铺到内容高度，
 * 纸面底部会露出大片白底。这里用 flex 纵向撑开，把余量分给主区 / 两列区。
 */
.rs-page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  min-height: 1123px;
  background-color: #fff;
}

.rs-page__main {
  flex: none;
}

.rs-page__columns {
  display: flex;
  flex: 1;
  align-items: stretch;
  box-sizing: border-box;
  width: 100%;
}

.rs-page__col {
  box-sizing: border-box;
}

.rs-page__col--left {
  flex: none;
}

.rs-page__col--right {
  flex: 1;
  min-width: 0;
}
</style>
