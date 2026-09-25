<script lang="ts" setup>
import ResumeRender from '@/components/ResumeRender/ResumeRender.vue'
import { useResumeStore } from '@/store/resume'

/**
 * 简历预览：全屏只读，同一份 JSON + 同一套物料，用 ResumeRender 以 HTML/CSS 渲染 —— 所见即所得，
 * 不需要为预览另写一套渲染代码（P5 的导出页同理，H5 侧复用同一个容器）。
 *
 * A4 纸宽 794px 是物料层字号 / 间距的同一坐标系，手机上放不下，
 * 所以按窗口宽度整体 `scale`，并用未缩放高度撑开外层占位，避免留下大片空白。
 */
defineOptions({ name: 'ResumeEditPreview' })
definePage({
  style: {
    navigationBarTitleText: '简历预览',
  },
})

/** A4 纸宽（px） */
const PAPER_WIDTH = 794
/** A4 纸高（px）：内容不足一页时也保持整页高度 */
const PAPER_HEIGHT = 1123

const store = useResumeStore()
const resume = computed(() => store.current)

const paperScale = ref(1)
const contentHeight = ref(PAPER_HEIGHT)
/** 缩放后的占位高度，保证滚动条长度正确 */
const frameHeight = computed(() => contentHeight.value * paperScale.value)
const paperStyle = computed(() => ({ transform: `scale(${paperScale.value})` }))

onShow(() => {
  syncPaperScale()
  nextTick(() => setTimeout(measurePaper, 60))
})

/** 按窗口宽度算缩放比，保证 A4 整页横向放得下 */
function syncPaperScale() {
  const width = uni.getSystemInfoSync().windowWidth || PAPER_WIDTH
  paperScale.value = Math.min(1, Math.max(0.35, (width - 24) / PAPER_WIDTH))
}

/** 量一次未缩放的内容高度：内容超出 A4 时按实际高度撑开，不足时保持 A4 */
function measurePaper() {
  uni.createSelectorQuery()
    .select('#resumePaper')
    .boundingClientRect((rect) => {
      const info = Array.isArray(rect) ? rect[0] : rect
      const height = info && 'height' in info ? Number(info.height) : 0
      if (height)
        contentHeight.value = Math.max(PAPER_HEIGHT, height / paperScale.value)
    })
    .exec()
}
</script>

<template>
  <view class="page">
    <scroll-view v-if="resume" scroll-y class="page__scroll">
      <view class="frame" :style="{ height: `${frameHeight}px` }">
        <view id="resumePaper" class="paper" :style="paperStyle">
          <ResumeRender :json="resume" />
        </view>
      </view>
    </scroll-view>
    <view v-else class="empty">
      <text class="empty-text">暂无可预览内容</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page {
  height: 100vh;
  background-color: #e9edf3;
}

.page__scroll {
  height: 100%;
}

.frame {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.paper {
  position: absolute;
  top: 12px;
  left: 50%;
  box-sizing: border-box;
  width: 794px;
  min-height: 1123px;
  margin-left: -397px;
  transform-origin: top center;
  background-color: #fff;
  box-shadow: 0 6px 24px rgb(23 43 77 / 16%);
}

.empty {
  padding-top: 240rpx;
  text-align: center;
}

.empty-text {
  color: #909399;
  font-size: 28rpx;
}
</style>
