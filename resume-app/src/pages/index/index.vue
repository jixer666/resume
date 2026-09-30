<script lang="ts" setup>
import { templateSideColor, templateTheme } from '@/schema/templates'
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
 *
 * 排版走极简：白底筛选栏 + 浅灰衬底的双列封面卡，去掉渐变头部与装饰元素。
 * 版式筛选是前端行为（后端分页接口不支持按 layout 过滤），选中筛选时
 * 自动把剩余分页拉完，避免「双栏」只剩当前页里的一两条。
 */
defineOptions({ name: 'Home' })
definePage({
  type: 'home',
  style: {
    navigationBarTitleText: '简历模板',
    enablePullDownRefresh: true,
  },
})

/** 版式筛选：全部 / 单栏 / 双栏（双栏 = 后端 layout 为 leftRight） */
type LayoutFilter = 'all' | 'single' | 'double'
const FILTERS: { label: string, value: LayoutFilter }[] = [
  { label: '全部', value: 'all' },
  { label: '单栏', value: 'single' },
  { label: '双栏', value: 'double' },
]

const templateStore = useTemplateStore()
const templates = computed(() => templateStore.list)
const loading = computed(() => templateStore.loading)
const loadingMore = computed(() => templateStore.loadingMore)
const hasMore = computed(() => templateStore.hasMore)
const error = computed(() => templateStore.error)
const filter = ref<LayoutFilter>('all')
/**
 * 骨架屏 =「正在加载 且 还没有数据」。
 *
 * 直接跟 loading 走（不看 loaded / error）：只要还在拉且没数据就铺骨架屏，
 * loading 结束前不可能出现空态；刷新时因已有数据，自动只走顶部进度条。
 */
const showSkeleton = computed(() => loading.value && !templates.value.length)
/** 筛选后的列表：「全部」不过滤，其余按版式过滤 */
const visibleTemplates = computed(() => {
  if (filter.value === 'all')
    return templates.value
  const twoColumn = filter.value === 'double'
  return templates.value.filter(item => (item.layout === 'leftRight') === twoColumn)
})
/** 右上角数量：跟可见列表走，筛选时不会把别的版式算进来 */
const countText = computed(() => (showSkeleton.value ? '加载中' : `共 ${visibleTemplates.value.length} 款`))

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

/** 切换版式筛选：先切高亮，再把剩余分页补拉完，保证筛选结果完整 */
async function switchFilter(value: LayoutFilter) {
  filter.value = value
  if (value === 'all')
    return
  // 后端分页接口不支持按 layout 过滤，只能把剩余分页拉完再筛；
  // 最多补拉 20 页，接口异常时也不会在这里空转
  for (let i = 0; i < 20 && templateStore.hasMore && !templateStore.loading; i++)
    await templateStore.fetchMore()
}

/** 版式文案：双列模板存的是 leftRight，其余都是单栏 */
function layoutText(layout: string): string {
  return layout === 'leftRight' ? '双栏' : '单栏'
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
    <!-- 版式筛选：白底吸顶，右侧跟可见数量 -->
    <view class="toolbar">
      <view class="tabs">
        <view
          v-for="tab in FILTERS"
          :key="tab.value"
          class="tab"
          :class="{ 'tab--on': filter === tab.value }"
          @click="switchFilter(tab.value)"
        >
          {{ tab.label }}
          <view v-if="filter === tab.value" class="tab-line" />
        </view>
      </view>
      <text class="count">
        {{ countText }}
      </text>
      <!-- 刷新（已有数据）时，用一条细进度条提示还在拉取 -->
      <view v-if="loading && templates.length" class="refresh-track">
        <view class="refresh-thumb" />
      </view>
    </view>

    <!-- 首次加载：骨架屏 -->
    <view v-if="showSkeleton" class="grid">
      <view v-for="n in 4" :key="n" class="card">
        <view class="cover-wrap">
          <view class="skeleton skeleton--cover" />
        </view>
        <view class="card-body">
          <view class="skeleton skeleton--name" />
        </view>
      </view>
    </view>

    <!-- 加载失败：给重试入口，不回退写死数据 -->
    <view v-else-if="error && !templates.length" class="state">
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
          v-for="item in visibleTemplates"
          :key="item.code"
          class="card"
          hover-class="card-press"
          @click="openTemplate(item.code)"
        >
          <view class="cover-wrap">
            <view class="cover-box">
              <resume-cover
                :layout="item.layout"
                :theme-color="templateTheme(item)"
                :side-color="templateSideColor(item)"
              />
            </view>
          </view>
          <view class="card-body">
            <text class="name">{{ item.name }}</text>
          </view>
        </view>
      </view>

      <!-- 筛选结果为空 -->
      <view v-if="!visibleTemplates.length" class="state">
        <text class="state-title">暂无该版式模板</text>
        <text class="state-desc">换个筛选条件看看</text>
      </view>

      <!-- 翻页状态 -->
      <view class="list-footer">
        <view v-if="loadingMore" class="footer-loading">
          <view class="footer-spinner" />
          <text class="footer-text">加载中…</text>
        </view>
        <text v-else-if="!hasMore" class="footer-text">没有更多了</text>
      </view>
    </template>

    <!-- 问题反馈：右边缘竖排标签 + QQ群号弹层（组件见 src/components/fg-feedback） -->
    <fg-feedback />
  </view>
</template>

<style lang="scss" scoped>
.page {
  /* 自定义 tabbar 在文档流里占 50px + 底部安全区，页面按剩余高度铺满，
     模板少时正好一屏不出现滚动条，模板多了内容撑开才滚动 */
  min-height: calc(100vh - 50px - env(safe-area-inset-bottom));
  /* 滚到底时最后一张卡片与固定 tabbar 之间的呼吸空隙 */
  padding-bottom: 20px;
  background-color: #f5f6f8;
}

/* -------- 版式筛选栏 -------- */
.toolbar {
  position: sticky;
  z-index: 10;
  top: 0;
  display: flex;
  align-items: center;
  height: 44px;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #eef0f3;
  background-color: #fff;
}

.tabs {
  display: flex;
  align-items: center;
}

.tab {
  position: relative;
  margin-right: 24px;
  color: #646a73;
  font-size: 14px;
  line-height: 44px;
}

.tab--on {
  color: #2563eb;
  font-weight: 600;
}

.tab-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 20px;
  height: 2px;
  border-radius: 1px;
  background-color: #2563eb;
  transform: translateX(-50%);
}

.count {
  color: #8f959e;
  font-size: 12px;
}

/* 顶部不定长进度条 */
.refresh-track {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  height: 2px;
  background-color: #e8eefc;
}

.refresh-thumb {
  width: 36%;
  height: 100%;
  background-color: #2563eb;
  animation: refresh-slide 1.1s ease-in-out infinite;
}

@keyframes refresh-slide {
  0% {
    transform: translateX(-110%);
  }

  100% {
    transform: translateX(390%);
  }
}

/* -------- 模板卡片 -------- */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 12px 12px 0;
}

.card {
  overflow: hidden;
  border-radius: 8px;
  background-color: #fff;
}

.card-press {
  background-color: #f2f3f5;
}

/* 封面衬底：中性浅灰，把白纸封面托出来 */
.cover-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 176px;
  padding: 12px 0;
  background-color: #f7f8fa;
}

/* ResumeCover 按 A4 比例自撑高度，给定宽度即锁定 150px 高的内容区 */
.cover-box {
  width: 106px;
}

.card-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
}

.name {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  color: #1f2329;
  font-size: 13px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.badge {
  flex: none;
  margin-left: 8px;
  color: #8f959e;
  font-size: 11px;
}

/* -------- 骨架屏 -------- */
.skeleton {
  background-color: #e9ebee;
  animation: skeleton-pulse 1.2s ease-in-out infinite;
}

.skeleton--cover {
  width: 106px;
  height: 150px;
  border-radius: 6px;
}

.skeleton--name {
  width: 60%;
  height: 13px;
  border-radius: 4px;
}

@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }
}

/* -------- 翻页状态 -------- */
.list-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
}

.footer-loading {
  display: flex;
  align-items: center;
}

.footer-spinner {
  width: 14px;
  height: 14px;
  margin-right: 6px;
  border: 2px solid #dfe3e8;
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
  color: #8f959e;
  font-size: 12px;
}

/* -------- 失败 / 空态 -------- */
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 96px 32px 0;
}

.state-title {
  color: #1f2329;
  font-size: 15px;
  font-weight: 500;
}

.state-desc {
  margin-top: 8px;
  color: #8f959e;
  font-size: 13px;
  text-align: center;
}

.retry {
  margin-top: 20px;
  padding: 8px 24px;
  border: 1px solid #2563eb;
  border-radius: 6px;
  color: #2563eb;
  font-size: 13px;
}

.retry-press {
  background-color: #f0f5ff;
}
</style>
