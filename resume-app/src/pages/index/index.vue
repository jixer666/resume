<script lang="ts" setup>
import type { IResumeTemplate } from '@/schema/templates'
import { coverBackdrop, TEMPLATES, templateSideColor, templateTheme } from '@/schema/templates'
import { safeAreaInsets } from '@/utils/systemInfo'

/**
 * 首页 ≡ 模板库。
 *
 * 「我的简历」列表挪到了「我的」页，首页只负责让用户挑一个版式开始；
 * 点卡片先进模板详情确认，再从详情页「使用该模板」生成简历 ——
 * 否则挨个点一遍就会攒出一堆空简历。
 */
defineOptions({ name: 'Home' })
definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '简历模板',
  },
})

/** 自绘导航栏要自己避开状态栏 */
const topInset = computed(() => safeAreaInsets?.top || 0)

/** 封面衬底：主题色兑白的极浅渐变，让白纸封面在卡片里不显得空 */
function coverBg(item: IResumeTemplate): string {
  return coverBackdrop(templateTheme(item))
}

function openTemplate(id: string) {
  uni.navigateTo({ url: `/pages/template-detail/index?id=${id}` })
}
</script>

<template>
  <view class="page">
    <view class="hero" :style="{ paddingTop: `${24 + topInset}px` }">
      <view class="glow glow-a" />
      <view class="glow glow-b" />
      <view class="hero-top">
        <text class="hero-title">模板库</text>
        <view class="hero-badge">
          {{ TEMPLATES.length }} 款
        </view>
      </view>
      <text class="hero-sub">选一个版式开始，内容结构已为你铺好</text>
    </view>

    <view class="grid">
      <view
        v-for="item in TEMPLATES"
        :key="item.id"
        class="template-card"
        hover-class="card-press"
        @click="openTemplate(item.id)"
      >
        <view class="cover-wrap" :style="{ background: coverBg(item) }">
          <resume-cover
            :layout="item.layout"
            :theme-color="templateTheme(item)"
            :side-color="templateSideColor(item)"
          />
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
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  /* tabbar 自带 50px 流式占位 + 固定条，这里只补一点呼吸位 */
  padding-bottom: 20px;
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
  box-sizing: border-box;
  justify-content: center;
  padding: 12px 16px 0;
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
  flex: none;
  margin-left: 6px;
  color: #c0c9d6;
  font-size: 16px;
  line-height: 1;
}
</style>
