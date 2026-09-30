<script lang="ts" setup>
import type { IResumeBrief } from '@/api/types/resume'
import dayjs from 'dayjs'
import { useResumeStore } from '@/store/resume'
import { useTokenStore } from '@/store/token'
import { toLoginPage } from '@/utils/toLoginPage'

/**
 * 「我的」页 ≡ 我的简历列表。
 *
 * 排版走极简：白底概览栏（份数 + 新建按钮，吸顶常驻）+ 白底列表行
 * （名称 + 版式标签 + 更新时间 + 箭头），不再画缩略图 —— 列表只回答「有哪些简历」，
 * 封面交给模板库与详情页；整行可点即进编辑。
 *
 * 首页是模板库，这里只留「已经存在的简历」；新建走首页挑模板那条路。
 * 列表来自后端 `/resume/page`：首次加载铺骨架屏，下拉可刷新。
 * tab 页底部被自定义 tabbar 占着（固定条 z-index 比页面高），所以不做固定底栏。
 */
defineOptions({ name: 'Me' })
definePage({
  style: {
    navigationBarTitleText: '我的简历',
    enablePullDownRefresh: true,
  },
})

const resumeStore = useResumeStore()
const tokenStore = useTokenStore()

const loading = ref(false)
/** 首次是否已经拉过：区分「正在加载」与「登录后确实没有简历」 */
const loaded = ref(false)
/** 登录态是「一次拉取」的快照，放在 onShow 里刷新，避免在 computed 里写 store */
const loggedIn = ref(false)
const list = computed(() => resumeStore.list)
/** 骨架屏 = 已登录、正在加载、且还没有任何数据 */
const showSkeleton = computed(() => loggedIn.value && loading.value && !list.value.length)
/** 空态 = 已登录、拉取结束、列表为空 */
const showEmpty = computed(() => loggedIn.value && loaded.value && !loading.value && !list.value.length)

onShow(() => {
  loggedIn.value = tokenStore.updateNowTime().hasLogin
  if (loggedIn.value)
    loadList()
})

/** 拉简历列表：失败只记日志，页面上保留上一次的数据 */
async function loadList() {
  if (loading.value)
    return
  loading.value = true
  try {
    await resumeStore.fetchList()
  }
  catch (error) {
    console.error('载入简历列表失败:', error)
  }
  finally {
    loading.value = false
    loaded.value = true
  }
}

/** 下拉刷新：重新拉一遍列表 */
async function refresh() {
  await loadList()
  uni.stopPullDownRefresh()
}

onPullDownRefresh(() => {
  if (loggedIn.value)
    refresh()
  else
    uni.stopPullDownRefresh()
})

/** 后端时间（yyyy-MM-dd HH:mm:ss）转相对时间，超过一周直接给日期 */
function displayTime(text: string): string {
  if (!text)
    return ''
  const time = dayjs(text)
  if (!time.isValid())
    return text
  const minutes = dayjs().diff(time, 'minute')
  if (minutes < 1)
    return '刚刚'
  if (minutes < 60)
    return `${minutes} 分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24)
    return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  if (days < 7)
    return `${days} 天前`
  return time.format('YYYY-MM-DD')
}

/** 版式文案：双列简历存的是 leftRight，其余都是单栏 */
function layoutText(layout: string): string {
  return layout === 'leftRight' ? '双栏' : '单栏'
}

/** 打开一份已保存的简历继续编辑 */
function openResume(item: IResumeBrief) {
  uni.navigateTo({ url: `/pages/edit/index?id=${item.id}` })
}

/** 去模板库挑一个版式（tab 页之间只能 switchTab） */
function goTemplates() {
  uni.switchTab({ url: '/pages/index/index' })
}

function goLogin() {
  toLoginPage()
}
</script>

<template>
  <view class="page">
    <!-- 概览栏：左侧份数，右侧新建按钮；吸顶常驻，滚到哪都能直接新建 -->
    <view class="header">
      <view class="header-count">
        <template v-if="loggedIn">
          <text class="count-num">{{ list.length }}</text>
          <text class="count-unit">份简历</text>
        </template>
        <text v-else class="count-unit">登录后同步简历</text>
      </view>
      <view v-if="loggedIn" class="new-btn" hover-class="new-btn-press" @click="goTemplates">
        <text class="new-btn-plus">＋</text>
        <text>新建简历</text>
      </view>
      <!-- 重新拉取（已有数据）时，用一条细进度条提示还在请求 -->
      <view v-if="loading && list.length" class="refresh-track">
        <view class="refresh-thumb" />
      </view>
    </view>

    <!-- 未登录 -->
    <view v-if="!loggedIn" class="state">
      <text class="state-title">登录后同步简历</text>
      <text class="state-desc">微信一键登录，简历存在云端，换设备也不会丢</text>
      <view class="primary" hover-class="primary-press" @click="goLogin">
        微信一键登录
      </view>
    </view>

    <!-- 首次加载：骨架屏 -->
    <view v-else-if="showSkeleton" class="list">
      <view v-for="n in 4" :key="n" class="row">
        <view class="row-body">
          <view class="skeleton skeleton--name" />
          <view class="skeleton skeleton--time" />
        </view>
      </view>
    </view>

    <!-- 还没有简历 -->
    <view v-else-if="showEmpty" class="state">
      <text class="state-title">还没有简历</text>
      <text class="state-desc">从模板开始，创建你的第一份简历</text>
      <view class="primary" hover-class="primary-press" @click="goTemplates">
        去模板库挑一个
      </view>
    </view>

    <view v-else class="list">
      <view
        v-for="item in list"
        :key="item.id"
        class="row"
        hover-class="row-press"
        @click="openResume(item)"
      >
        <view class="row-body">
          <view class="row-head">
            <text class="name">{{ item.name || '未命名简历' }}</text>
          </view>
          <text class="time">更新于 {{ displayTime(item.updateTime) }}</text>
        </view>
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- 问题反馈：右边缘竖排标签 + QQ群号弹层（组件见 src/components/fg-feedback），任何登录态下都能用 -->
    <fg-feedback />
  </view>
</template>

<style lang="scss" scoped>
.page {
  /* 自定义 tabbar 在文档流里占 50px + 底部安全区，页面按剩余高度铺满，
     简历少时正好一屏不出现滚动条，简历多了内容撑开才滚动 */
  min-height: calc(100vh - 50px - env(safe-area-inset-bottom));
  /* 滚到底时最后一行与固定 tabbar 之间的呼吸空隙 */
  padding-bottom: 20px;
  background-color: #f5f6f8;
}

/* -------- 概览栏 -------- */
.header {
  position: sticky;
  z-index: 10;
  top: 0;
  display: flex;
  align-items: center;
  height: 52px;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #eef0f3;
  background-color: #fff;
}

/* 份数：数字放大当视觉落点，单位退成小字 */
.header-count {
  display: flex;
  align-items: baseline;
}

.count-num {
  color: #1f2329;
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
}

.count-unit {
  margin-left: 4px;
  color: #8f959e;
  font-size: 13px;
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

/* 实心胶囊按钮：比文字链更明确，吸顶时一直挂在右上角 */
.new-btn {
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 14px;
  border-radius: 15px;
  background-color: #2563eb;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
}

.new-btn-plus {
  margin-right: 2px;
  font-size: 14px;
  line-height: 1;
}

.new-btn-press {
  opacity: 0.85;
}

/* -------- 简历列表 -------- */
.list {
  padding: 12px 12px 0;
}

.row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 14px 16px;
  border-radius: 10px;
  background-color: #fff;
}

.row-press {
  background-color: #f2f3f5;
}

/* 没有缩略图后，名称与时间就是整行唯一的信息列 */
.row-body {
  min-width: 0;
  flex: 1;
}

.row-head {
  display: flex;
  align-items: center;
}

.name {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  color: #1f2329;
  font-size: 15px;
  font-weight: 600;
  line-height: 21px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 版式标签：补回缩略图原本承担的「单栏 / 双栏」信息 */
.badge {
  flex: none;
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: #f2f3f5;
  color: #646a73;
  font-size: 11px;
  line-height: 14px;
}

.time {
  display: block;
  margin-top: 5px;
  color: #8f959e;
  font-size: 12px;
  line-height: 17px;
}

.arrow {
  flex: none;
  margin-left: 10px;
  color: #c9ced6;
  font-size: 18px;
  line-height: 1;
}

/* -------- 骨架屏 -------- */
.skeleton {
  background-color: #e9ebee;
  animation: skeleton-pulse 1.2s ease-in-out infinite;
}

.skeleton--name {
  width: 46%;
  height: 15px;
  border-radius: 4px;
}

.skeleton--time {
  width: 30%;
  height: 11px;
  margin-top: 9px;
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

/* -------- 未登录 / 空态 -------- */
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 32px 0;
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

.primary {
  margin-top: 24px;
  padding: 10px 32px;
  border-radius: 6px;
  background-color: #2563eb;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.primary-press {
  opacity: 0.85;
}
</style>
