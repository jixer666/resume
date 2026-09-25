<script lang="ts" setup>
import type { IResumeBrief } from '@/api/types/resume'
import dayjs from 'dayjs'
import { alphaColor, coverBackdrop } from '@/schema/templates'
import RESUME_JSON from '@/schema/resume'
import { useResumeStore } from '@/store/resume'
import { useTokenStore } from '@/store/token'
import { toLoginPage } from '@/utils/toLoginPage'

/**
 * 「我的」页 ≡ 我的简历列表，排版对标 resume-app-temp 的 pages/me/me.vue：
 * 主题渐变头部（份数角标 + 最近更新时间）+ 卡片列表（缩略图 + 名称 + 版式角标 + 底部操作）
 * + 圆形图标空态。
 *
 * 首页已改成模板库，这里只留「已经存在的简历」；新建走首页挑模板那条路。
 * tab 页底部被自定义 tabbar 占着（固定条 z-index 比页面高），所以不做固定底栏。
 */
defineOptions({ name: 'Me' })
definePage({})

const resumeStore = useResumeStore()
const tokenStore = useTokenStore()

/** 列表接口不返回主题色，卡片统一按出厂主题色上色 */
const themeColor = RESUME_JSON.GLOBAL_STYLE.themeColor
/** 角标浅底与缩略图衬底：主题色的极浅渐变，让白纸缩略图在卡片里不显空 */
const themeSoft = alphaColor(themeColor, 0.1)
const thumbBg = coverBackdrop(themeColor)

const loading = ref(false)
/** 登录态是「一次拉取」的快照，放在 onShow 里刷新，避免在 computed 里写 store */
const loggedIn = ref(false)

const list = computed(() => resumeStore.list)
const heroSub = computed(() => {
  if (!loggedIn.value)
    return '登录后简历存在云端，换设备也不会丢'
  const latest = list.value[0]
  return latest ? `最近更新于 ${displayTime(latest.updateTime)}` : '从模板开始，创建你的第一份简历'
})

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
  }
}

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

/** 版式角标：双列模板存的是 leftRight，其余都是单栏 */
function badgeText(layout: string): string {
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
    <view class="hero">
      <view class="glow glow-a" />
      <view class="glow glow-b" />
      <view class="hero-top">
        <text class="hero-title">我的简历</text>
        <view v-if="loggedIn" class="hero-badge">
          {{ list.length }} 份
        </view>
      </view>
      <text class="hero-sub">{{ heroSub }}</text>
    </view>

    <view v-if="!loggedIn" class="empty">
      <text class="empty-title">登录后同步简历</text>
      <text class="empty-sub">微信一键登录，简历存在云端，换设备也不会丢</text>
      <view class="create" hover-class="create-press" @click="goLogin">
        微信一键登录
      </view>
    </view>

    <view v-else-if="loading && !list.length" class="empty">
      <text class="empty-sub">正在加载…</text>
    </view>

    <view v-else-if="!list.length" class="empty">
      <view class="empty-icon">
        ＋
      </view>
      <text class="empty-title">还没有简历</text>
      <text class="empty-sub">从模板开始，创建你的第一份简历</text>
      <view class="create" hover-class="create-press" @click="goTemplates">
        去模板库挑一个
      </view>
    </view>

    <view v-else class="list">
      <view
        v-for="item in list"
        :key="item.id"
        class="card"
        hover-class="card-press"
        @click="openResume(item)"
      >
        <view class="card-main">
          <view class="thumb" :style="{ background: thumbBg }">
            <view class="thumb-img">
              <resume-cover :layout="item.layout" size="xs" />
            </view>
          </view>
          <view class="info">
            <text class="name">{{ item.name || '未命名简历' }}</text>
          </view>
        </view>
        <view class="card-foot">
          <text class="time">更新于 {{ displayTime(item.updateTime) }}</text>
          <view class="action" hover-class="action-press" @click.stop="openResume(item)">
            编辑
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  /* 自定义 tabbar 在文档流里占 50px + 底部安全区，页面按剩余高度铺满，
     内容少时正好一屏不出现滚动条，简历多了内容撑开才滚动 */
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

.list {
  padding: 16px 16px 0;
}

.card {
  margin-bottom: 12px;
  padding: 14px;
  border-radius: 8px;
  background-color: #fff;
}
.card-press {
  opacity: 0.88;
}

.card-main {
  display: flex;
  align-items: center;
}
.thumb {
  display: flex;
  width: 52px;
  height: 68px;
  flex: none;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 10px;
}
/* ResumeCover 按 A4 比例自撑高度，42px 宽 ≈ 60px 高，正好填满衬底内容区 */
.thumb-img {
  width: 42px;
}

.info {
  min-width: 0;
  flex: 1;
  margin-left: 12px;
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
  font-size: 16px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tag {
  flex: none;
  margin-left: 8px;
  padding: 3px 9px;
  border-radius: 10px;
  font-size: 10px;
}

.sub {
  display: block;
  margin-top: 8px;
  overflow: hidden;
  color: #8290a5;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}
.time {
  color: #94a3b8;
  font-size: 11px;
}
.action {
  padding: 5px 14px;
  border-radius: 13px;
  background-color: #eff6ff;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
}
.action-press {
  background-color: #dbeafe;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 96px;
}
.empty-icon {
  display: flex;
  width: 72px;
  height: 72px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(160deg, #dbeafe 0%, #eff6ff 100%);
  color: #2563eb;
  font-size: 38px;
  font-weight: 200;
}
.empty-title {
  margin-top: 18px;
  color: #172b4d;
  font-size: 18px;
  font-weight: 700;
}
.empty-sub {
  margin-top: 8px;
  color: #94a3b8;
  font-size: 13px;
}
.create {
  margin-top: 24px;
  padding: 13px 46px;
  border-radius: 22px;
  background: linear-gradient(135deg, #2563eb 0%, #5b8ff7 100%);
  box-shadow: 0 6px 16px rgb(37 99 235 / 26%);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
}
.create-press {
  opacity: 0.86;
}
</style>
