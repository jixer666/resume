<script lang="ts" setup>
import type { IResumeTemplate } from '@/schema/templates'
import { coverBackdrop, TEMPLATES, templateSideColor, templateTheme } from '@/schema/templates'

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
})

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
    <view class="hero">
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
</style>
