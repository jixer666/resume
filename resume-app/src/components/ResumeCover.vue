<script lang="ts" setup>
/**
 * 简历封面预览：纯 CSS 画的迷你版式缩略图，不依赖任何图片资源。
 *
 * 卡片网格里当封面、详情页放大复用 —— `size` 只切换基准字号，内部尺寸全用 em，
 * 加档位不用改样式；整体靠 `padding-top: 141.4%` 撑出 A4 纸比例（1 : 1.414）。
 */
defineOptions({ name: 'ResumeCover' })

const props = withDefaults(defineProps<{
  /** 简历布局：'leftRight' 画成左右双栏，其余画成单栏 */
  layout?: string
  /** 主题色，用于头像与模块色条 */
  themeColor?: string
  /** 双列布局的左栏底色 */
  sideColor?: string
  /** 尺寸档位：列表缩略图用 xs，卡片网格用 sm，详情页用 md */
  size?: 'xs' | 'sm' | 'md'
}>(), {
  layout: '',
  themeColor: '#079cfa',
  sideColor: '#eef4ff',
  size: 'sm',
})

/** 重复渲染的模块块（数量固定，不做可变结构） */
const BLOCKS = [1, 2, 3]

const split = computed(() => props.layout === 'leftRight')
const rootStyle = computed(() => ({
  '--cover-theme': props.themeColor,
  '--cover-side': props.sideColor,
}))
</script>

<template>
  <view class="cover-stage" :class="`cover-stage--${size}`" :style="rootStyle">
    <view class="cover">
      <view v-if="split" class="cover__side">
        <view class="cover__avatar cover__avatar--side" />
        <view class="cover__line cover__line--side" />
        <view class="cover__line cover__line--side-short" />
        <view class="cover__line cover__line--side" />
        <view class="cover__line cover__line--side-short" />
      </view>

      <view class="cover__main">
        <view class="cover__head">
          <view v-if="!split" class="cover__avatar" />
          <view class="cover__head-lines" :class="{ 'cover__head-lines--plain': split }">
            <view class="cover__line cover__line--name" />
            <view class="cover__line cover__line--sub" />
          </view>
        </view>

        <view v-for="block in BLOCKS" :key="block" class="cover__block">
          <view class="cover__bar" />
          <view class="cover__line cover__line--full" />
          <view class="cover__line cover__line--full" />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.cover-stage {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding-top: 141.4%;
  border-radius: 6px;
}

.cover-stage--xs {
  font-size: 8px;
}
.cover-stage--sm {
  font-size: 12px;
}
.cover-stage--md {
  font-size: 22px;
}

.cover {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  background-color: #fff;
  box-shadow: inset 0 0 0 1px rgb(23 43 77 / 6%);
}

.cover__side {
  display: flex;
  width: 36%;
  flex: none;
  flex-direction: column;
  box-sizing: border-box;
  padding: 1.1em 0.8em;
  background-color: var(--cover-side, #eef4ff);
}

.cover__main {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  box-sizing: border-box;
  padding: 1em;
}

.cover__head {
  display: flex;
  align-items: center;
}

.cover__avatar {
  width: 2.2em;
  height: 2.2em;
  flex: none;
  border-radius: 50%;
  background-color: var(--cover-theme, #079cfa);
}

.cover__avatar--side {
  margin-bottom: 0.7em;
}

.cover__head-lines {
  min-width: 0;
  flex: 1;
  margin-left: 0.7em;
}

/* 双列布局里头像已在左栏，正文首行不再缩进 */
.cover__head-lines--plain {
  margin-left: 0;
}

.cover__bar {
  width: 3.2em;
  height: 0.5em;
  margin-bottom: 0.5em;
  border-radius: 0.25em;
  background-color: var(--cover-theme, #079cfa);
}

.cover__line {
  width: 85%;
  height: 0.4em;
  margin-bottom: 0.4em;
  border-radius: 0.2em;
  background-color: #e3e8f0;
}

.cover__line--full {
  width: 100%;
}

.cover__line--name {
  width: 62%;
  height: 0.6em;
  background-color: #c8d2e0;
}

.cover__line--sub {
  width: 40%;
  height: 0.32em;
}

.cover__line--side,
.cover__line--side-short {
  margin-bottom: 0.5em;
}

.cover__line--side {
  width: 100%;
}

.cover__line--side-short {
  width: 68%;
}

.cover__block {
  margin-top: 0.85em;
}
</style>
