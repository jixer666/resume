<script lang="ts" setup>
import type { IResumeTemplate } from '@/schema/templates'
import { coverBackdrop, templateSideColor, templateTheme } from '@/schema/templates'
import { useTemplateStore } from '@/store/template'

/**
 * 首页 ≡ 模板库。
 *
 * 「我的简历」列表挪到了「我的」页，首页只负责让用户挑一个版式开始；
 * 点卡片先进模板详情确认，再从详情页「使用该模板」生成简历 ——
 * 否则挨个点一遍就会攒出一堆空简历。
 *
 * 模板数据全部来自后端 `/resume/template/page`：首次进入走骨架屏，
 * 下滑到底部自动翻页，失败给重试入口。
 */
defineOptions({ name: 'Home' })
definePage({
  type: 'home',
  style: {
    enablePullDownRefresh: true,
  },
})

const templateStore = useTemplateStore()
const templates = computed(() => templateStore.list)
const loading = computed(() => templateStore.loading)
const loadingMore = computed(() => templateStore.loadingMore)
const hasMore = computed(() => templateStore.hasMore)
const error = computed(() => templateStore.error)
/**
 * 骨架屏 =「正在加载 且 还没有数据」。
 *
 * 直接跟 loading 走（不看 loaded / error）：只要还在拉且没数据就铺骨架屏，
 * loading 结束前不可能出现空态；刷新时因已有数据，自动只走顶部进度条。
 */
const showSkeleton = computed(() => loading.value && !templates.value.length)
/** 头部角标：首次加载显示「加载中」，否则显示后端返回的模板数量 */
const badgeText = computed(() => (showSkeleton.value ? '加载中' : `${templates.value.length} 款`))

// 进入页面立即拉第一页：fetchList 是同步先把 loading 置 true 的，
// 所以首帧渲染就是骨架屏，不会先闪一下空态
templateStore.fetchList()

onShow(() => {
  // 首次加载失败时回到本页自动重试；已加载过则不重置列表，避免从详情页返回被清空
  if (!templateStore.loaded)
    templateStore.fetchList()
})

/** 触底翻页 */
onReachBottom(() => {
  templateStore.fetchMore()
})

/** 下拉刷新：重置回第一页 */
onPullDownRefresh(async () => {
  await templateStore.fetchList()
  uni.stopPullDownRefresh()
})

/** 封面衬底：主题色兑白的极浅渐变，让白纸封面在卡片里不显得空 */
function coverBg(item: IResumeTemplate): string {
  return coverBackdrop(templateTheme(item))
}

function openTemplate(code: string) {
  uni.navigateTo({ url: `/pages/template-detail/index?id=${code}` })
}

function reload() {
  templateStore.fetchList()
}
</script>

<template>
  <view class="page">
    <view class="hero">
      <view class="glow glow-a" />
      <view class="glow glow-b" />
      <view class="hero-top">
        <text class="hero-title">模板库</text>
        <view class="hero-badge">
          {{ badgeText }}
        </view>
      </view>
      <text class="hero-sub">选一个版式开始，内容结构已为你铺好</text>
      <!-- 顶部进度条：刷新（已有数据）时提示还在拉取 -->
      <view v-if="loading && templates.length" class="loading-track">
        <view class="loading-thumb" />
      </view>
    </view>

    <!-- 首次加载：骨架屏 -->
    <view v-if="showSkeleton" class="grid">
      <view v-for="n in 4" :key="n" class="template-card">
        <view class="cover-wrap">
          <view class="cover-box">
            <view class="skeleton skeleton-cover">
              <view class="skeleton-shine" />
            </view>
          </view>
        </view>
        <view class="card-body">
          <view class="skeleton skeleton-line">
            <view class="skeleton-shine" />
          </view>
        </view>
      </view>
    </view>

    <!-- 加载失败：给重试入口，不回退写死数据 -->
    <view v-else-if="error && !templates.length" class="state">
      <view class="state-icon">
        !
      </view>
      <text class="state-title">模板加载失败</text>
      <text class="state-desc">{{ error }}</text>
      <view class="retry" hover-class="retry-press" @click="reload">
        重新加载
      </view>
    </view>

    <!-- 后端返回空 -->
    <view v-else-if="!templates.length" class="state">
      <text class="state-title">暂无模板</text>
      <text class="state-desc">稍后再来看看吧</text>
    </view>

    <template v-else>
      <view class="grid">
        <view
          v-for="item in templates"
          :key="item.code"
          class="template-card"
          hover-class="card-press"
          @click="openTemplate(item.code)"
        >
          <view class="cover-wrap" :style="{ background: coverBg(item) }">
            <view class="cover-box">
              <resume-cover
                :layout="item.layout"
                :theme-color="templateTheme(item)"
                :side-color="templateSideColor(item)"
              />
            </view>
          </view>
          <view class="card-body">
            <view class="name-row">
              <view class="name">
                {{ item.name }}
              </view>
              <text class="arrow">›</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 翻页状态 -->
      <view class="list-footer">
        <view v-if="loadingMore" class="footer-loading">
          <view class="footer-spinner" />
          <text class="footer-text">加载中...</text>
        </view>
        <text v-else-if="!hasMore" class="footer-text">
          没有更多了
        </text>
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.page {
  /* 自定义 tabbar 在文档流里占 50px + 底部安全区，页面按剩余高度铺满，
     模板少时正好一屏不出现滚动条，模板多了内容撑开才滚动 */
  min-height: calc(100vh - 50px - env(safe-area-inset-bottom));
  /* 滚到底时最后一张卡片与固定 tabbar 之间的呼吸空隙 */
  padding-bottom: 24px;
  background-color: #f4f4f4;
}

.hero {
  position: relative;
  overflow: hidden;
  padding: 24px 18px 26px;
  border-radius: 0 0 24px 24px;
  background: linear-gradient(160deg, #2563eb 0%, #5b8ff7 100%);
}

.glow {
  position: absolute;
  border-radius: 50%;
  background-color: rgb(255 255 255 / 14%);
}

.glow-a {
  top: -76px;
  right: -46px;
  width: 180px;
  height: 180px;
}

.glow-b {
  bottom: -62px;
  left: -30px;
  width: 130px;
  height: 130px;
}

.hero-top {
  position: relative;
  display: flex;
  align-items: center;
}

.hero-title {
  color: #fff;
  font-size: 23px;
  font-weight: 700;
}

.hero-badge {
  margin-left: 10px;
  padding: 3px 10px;
  border-radius: 11px;
  background-color: rgb(255 255 255 / 22%);
  color: #fff;
  font-size: 11px;
}

.hero-sub {
  position: relative;
  display: block;
  margin-top: 9px;
  color: rgb(255 255 255 / 82%);
  font-size: 13px;
}

/* 顶部不定长进度条 */
.loading-track {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  height: 3px;
  background-color: rgb(255 255 255 / 22%);
}

.loading-thumb {
  width: 38%;
  height: 100%;
  border-radius: 2px;
  background-color: #fff;
  animation: loading-slide 1.1s ease-in-out infinite;
}

@keyframes loading-slide {
  0% {
    transform: translateX(-110%);
  }

  100% {
    transform: translateX(375%);
  }
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 16px 14px 0;
}

.template-card {
  overflow: hidden;
  border-radius: 8px;
  background-color: #fff;
}

.card-press {
  opacity: 0.88;
}

.cover-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 190px;
  padding: 10px;
}

/* ResumeCover 按 A4 比例自撑高度，给定宽度即锁定 170px 高的内容区 */
.cover-box {
  width: 120px;
}

.card-body {
  padding: 10px;
}

.name-row {
  display: flex;
  align-items: center;
}

.name {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  color: #172b4d;
  font-size: 15px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow {
  color: #c0c9d6;
  font-size: 16px;
  line-height: 1;
}

/* -------- 骨架屏 -------- */
.skeleton {
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  background-color: #e4e9f0;
}

.skeleton-cover {
  width: 100%;
  height: 170px;
  border-radius: 8px;
}

.skeleton-line {
  width: 62%;
  height: 14px;
}

/* 高光扫过：用 transform 位移，小程序端比 background-position 动画稳 */
.skeleton-shine {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 60%;
  background: linear-gradient(90deg, rgb(255 255 255 / 0%) 0%, rgb(255 255 255 / 92%) 50%, rgb(255 255 255 / 0%) 100%);
  animation: skeleton-shine 1.2s ease-in-out infinite;
}

@keyframes skeleton-shine {
  0% {
    transform: translateX(-130%);
  }

  100% {
    transform: translateX(230%);
  }
}

/* -------- 翻页状态 -------- */
.list-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
}

.footer-loading {
  display: flex;
  align-items: center;
}

.footer-spinner {
  width: 14px;
  height: 14px;
  margin-right: 6px;
  border: 2px solid #d7dee9;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: footer-spin 0.7s linear infinite;
}

@keyframes footer-spin {
  to {
    transform: rotate(360deg);
  }
}

.footer-text {
  color: #9aa7b8;
  font-size: 12px;
}

/* -------- 失败 / 空态 -------- */
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 72px 32px 0;
}

.state-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #e6ecf5;
  color: #8b9bb4;
  font-size: 22px;
  font-weight: 700;
}

.state-title {
  margin-top: 16px;
  color: #172b4d;
  font-size: 16px;
  font-weight: 600;
}

.state-desc {
  margin-top: 8px;
  color: #94a3b8;
  font-size: 13px;
  text-align: center;
}

.retry {
  margin-top: 20px;
  padding: 9px 26px;
  border-radius: 20px;
  background: linear-gradient(135deg, #2563eb 0%, #5b8ff7 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.retry-press {
  opacity: 0.86;
}
</style>
