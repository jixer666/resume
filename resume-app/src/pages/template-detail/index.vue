<script lang="ts" setup>
import { templateSideColor, templateTheme } from '@/schema/templates'
import { pxTonumber } from '@/utils/common'
import { useResumeStore } from '@/store/resume'
import { useTemplateStore } from '@/store/template'
import { useTokenStore } from '@/store/token'
import { toLoginPage } from '@/utils/toLoginPage'

/**
 * 模板详情：先看版式再决定用不用。
 *
 * 首页卡片直接生成简历的话，用户挨个点一遍就会攒出一堆空简历，所以中间加一层确认页。
 *
 * 排版走极简：浅灰底的 A4 预览 + 白底信息卡与参数行 + 底部「使用模板」按钮，
 * 去掉渐变头部、光晕与主题色相框；详情接口没回来之前铺骨架屏。
 */
defineOptions({ name: 'TemplateDetail' })
definePage({
  style: {
    navigationBarTitleText: '模板详情',
  },
})

const tokenStore = useTokenStore()
const templateStore = useTemplateStore()
const resumeStore = useResumeStore()
/** 当前模板，id 非法时为 null（据此渲染兜底态） */
const tpl = computed(() => templateStore.current)
/** 正在按模板创建简历：期间锁住按钮，避免连点建出多份 */
const creating = ref(false)
/** 列表里已有这份模板时直接渲染内容，只有「还没有数据」才铺骨架屏 */
const showSkeleton = computed(() => templateStore.detailLoading && !tpl.value)
const theme = computed(() => (tpl.value ? templateTheme(tpl.value) : '#2563eb'))
const side = computed(() => (tpl.value ? templateSideColor(tpl.value) : '#eef4ff'))

/** 模块间距 = 模块上内边距 + 模块下间距：两者相加才是模块之间真正的留白 */
const moduleGap = computed(() => `${(pxTonumber(tpl.value?.style?.pTop) || 0) + (pxTonumber(tpl.value?.style?.modelMarginBottom) || 0)}px`)

/** 参数行：固定四项，窄屏也不会换行错位 */
const metaList = computed(() => {
  const style = tpl.value?.style || {}
  return [
    { label: '版式', value: tpl.value?.layout === 'leftRight' ? '左右双栏' : '单栏通排' },
    { label: '一级标题', value: style.firstTitleFontSize || '20px' },
    { label: '正文字号', value: style.textFontSize || '14px' },
    { label: '模块间距', value: moduleGap.value },
  ]
})

onLoad(async (query) => {
  const id = query?.id ? String(query.id) : ''
  await templateStore.fetchDetail(id)
  if (tpl.value)
    uni.setNavigationBarTitle({ title: tpl.value.name })
})

/**
 * 套用该模板：未登录先去登录（回来后仍停在详情页，再点一次即可）；
 * 已登录则先在后端创建简历，拿到主键再进编辑页。
 *
 * 创建必须发生在跳转之前 —— 失败（超出简历数上限 / 网络错误）时用户还留在本页，
 * 不会像旧流程那样先跳进编辑页、留下一份没有主键的草稿反复重试落库。
 */
async function useTemplate() {
  if (!tpl.value || creating.value)
    return
  if (!tokenStore.updateNowTime().hasLogin) {
    toLoginPage()
    return
  }
  creating.value = true
  try {
    const brief = await resumeStore.createFromTemplate(tpl.value.code)
    uni.navigateTo({ url: `/pages/edit/index?id=${brief.id}` })
  }
  catch (error) {
    // 错误提示由 http 层统一 toast，这里只记日志
    console.error('使用模板创建简历失败:', error)
  }
  finally {
    creating.value = false
  }
}

/** 兜底态回模板库（tab 页只能 switchTab） */
function backToLibrary() {
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<template>
  <view class="page">
    <!-- 详情接口在后台刷新（列表里已有这份模板）时，用细进度条提示 -->
    <view v-if="templateStore.detailLoading && tpl" class="refresh-track">
      <view class="refresh-thumb" />
    </view>

    <view class="body">
      <!-- 加载中（列表里没有这份模板）：骨架屏 -->
      <template v-if="showSkeleton">
        <view class="preview-area">
          <view class="skeleton skeleton--preview" />
        </view>
        <view class="info-card">
          <view class="skeleton skeleton--title" />
          <view class="skeleton skeleton--line" />
          <view class="skeleton skeleton--line skeleton--line-short" />
        </view>
        <view class="meta-card">
          <view v-for="n in 4" :key="n" class="meta-row">
            <view class="skeleton skeleton--label" />
            <view class="skeleton skeleton--value" />
          </view>
        </view>
      </template>

      <template v-else-if="tpl">
        <!-- A4 预览：浅灰底衬白纸 -->
        <view class="preview-area">
          <view class="preview-frame">
            <view class="preview">
              <resume-cover
                :layout="tpl.layout"
                :theme-color="theme"
                :side-color="side"
                size="md"
              />
            </view>
          </view>
        </view>

        <view class="info-card">
          <text class="title">{{ tpl.name }}</text>
          <text class="desc">{{ tpl.description }}</text>
        </view>

        <view class="meta-card">
          <view v-for="meta in metaList" :key="meta.label" class="meta-row">
            <text class="meta-label">{{ meta.label }}</text>
            <text class="meta-value">{{ meta.value }}</text>
          </view>
        </view>
      </template>

      <!-- 模板不存在 -->
      <view v-else class="state">
        <text class="state-title">模板不存在</text>
        <text class="state-desc">链接可能已失效，回模板库重新选一个吧</text>
        <view class="ghost" hover-class="ghost-press" @click="backToLibrary">
          回模板库
        </view>
      </view>
    </view>

    <view v-if="tpl" class="bottom">
      <button
        class="primary"
        :class="{ 'primary--busy': creating }"
        :disabled="creating"
        hover-class="primary-press"
        @click="useTemplate"
      >
        {{ creating ? '正在创建…' : '使用模板' }}
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  /* 底部按钮固定在文档流之外，页面预留出按钮栏的高度 */
  min-height: 100vh;
  padding-bottom: calc(64px + env(safe-area-inset-bottom));
  background-color: #f5f6f8;
}

/* 后台刷新详情时的顶部细进度条 */
.refresh-track {
  position: sticky;
  z-index: 10;
  top: 0;
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

/* -------- A4 预览 -------- */
.preview-area {
  display: flex;
  justify-content: center;
  padding: 20px 0 24px;
}

.preview-frame {
  width: 180px;
  padding: 8px;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 4px 16px rgb(31 35 41 / 8%);
}

.preview {
  overflow: hidden;
  width: 100%;
  border-radius: 3px;
}

/* -------- 信息与参数 -------- */
.info-card {
  padding: 16px;
  background-color: #fff;
}

.title {
  display: block;
  color: #1f2329;
  font-size: 18px;
  font-weight: 600;
}

.desc {
  display: block;
  margin-top: 8px;
  color: #646a73;
  font-size: 13px;
  line-height: 20px;
}

.meta-card {
  margin-top: 10px;
  padding: 0 16px;
  background-color: #fff;
}

.meta-row {
  display: flex;
  align-items: center;
  height: 46px;
  justify-content: space-between;
  border-bottom: 1px solid #f2f3f5;
}

.meta-row:last-child {
  border-bottom: none;
}

.meta-label {
  color: #8f959e;
  font-size: 13px;
}

.meta-value {
  color: #1f2329;
  font-size: 13px;
}

/* -------- 骨架屏 -------- */
.skeleton {
  background-color: #e9ebee;
  animation: skeleton-pulse 1.2s ease-in-out infinite;
}

.skeleton--preview {
  width: 196px;
  height: 277px;
  border-radius: 6px;
}

.skeleton--title {
  width: 42%;
  height: 18px;
  border-radius: 4px;
}

.skeleton--line {
  width: 100%;
  height: 13px;
  margin-top: 12px;
  border-radius: 4px;
}

.skeleton--line-short {
  width: 64%;
}

.skeleton--label {
  width: 56px;
  height: 13px;
  border-radius: 4px;
}

.skeleton--value {
  width: 72px;
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

/* -------- 兜底态 -------- */
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

.ghost {
  margin-top: 20px;
  padding: 8px 24px;
  border: 1px solid #dcdfe4;
  border-radius: 6px;
  color: #646a73;
  font-size: 13px;
}

.ghost-press {
  background-color: #f2f3f5;
}

/* -------- 底部操作 -------- */
.bottom {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 10px 16px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  border-top: 1px solid #eef0f3;
  background-color: #fff;
}

.primary {
  height: 44px;
  border: none;
  border-radius: 6px;
  background-color: #2563eb;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  line-height: 44px;

  &::after {
    border: none;
  }
}

.primary-press {
  opacity: 0.85;
}

/* 创建中：按钮整体降透明度，配合文案「正在创建…」表示请求还在路上 */
.primary--busy {
  opacity: 0.6;
}
</style>
