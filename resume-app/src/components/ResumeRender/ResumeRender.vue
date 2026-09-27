<script lang="ts" setup>
import type { IMATERIALITEM } from '@/interface/material'
import type IRESUMEJSON from '@/interface/resume'
import RenderItem from './RenderItem.vue'
import { computed } from 'vue'
import { lightenColor } from '@/schema/templates'

/**
 * 简历渲染容器：吃一份简历 JSON，按 LAYOUT 分发到单列 / 双列，再逐模块交给 RenderItem。
 *
 * 编辑预览、H5 导出预览共用这一层，所以「所见即所得」不需要两套渲染代码。
 * 不读 store，只认 props，方便 H5 预览页（P5 puppeteer 出 PDF）直接复用。
 */
const props = defineProps<{
  json: IRESUMEJSON
  /**
   * 页面最小高度（px）。默认一张 A4（1123px）；预览页分页时传「页数 * A4 高」，
   * 让双列模板第 2 页起的左栏底色也能铺到纸张底部。
   */
  minHeight?: number
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
  minHeight: props.minHeight ? `${props.minHeight}px` : '',
}))
const leftColumnStyle = computed(() => ({
  width: globalStyle.value.leftWidth || '35%',
  backgroundColor: globalStyle.value.leftThemeColor || '',
}))
const rightColumnStyle = computed(() => ({
  backgroundColor: globalStyle.value.rightThemeColor || '',
}))

/**
 * 整页背景：`GLOBAL_STYLE.resumeBackgroundCom` 存预设名，空值就是纯白纸。
 *
 * 底色一律用「主题色兑白」的实色，纹理才用纯 CSS 渐变 —— 小程序端不支持本地图片背景，
 * 渐变不被支持时只是纹理不显示，底色仍在，版面不会塌。
 */
const backgroundStyle = computed(() => {
  const preset = String(globalStyle.value.resumeBackgroundCom || '')
  const themeColor = String(globalStyle.value.themeColor || '#079cfa')
  if (preset === 'tint')
    return { backgroundColor: lightenColor(themeColor, 0.94) }
  if (preset === 'warm')
    return { backgroundColor: '#faf7f2' }
  if (preset === 'dot') {
    return {
      backgroundColor: lightenColor(themeColor, 0.97),
      backgroundImage: `radial-gradient(circle, ${lightenColor(themeColor, 0.72)} 1px, transparent 1px)`,
      backgroundSize: '16px 16px',
    }
  }
  if (preset === 'grid') {
    const line = lightenColor(themeColor, 0.82)
    return {
      backgroundColor: '#fff',
      backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
      backgroundSize: '22px 22px',
    }
  }
  return {}
})
</script>

<template>
  <view class="rs-page" :style="[rootStyle, backgroundStyle]">
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
