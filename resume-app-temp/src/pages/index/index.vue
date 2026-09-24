<script setup lang="ts">
import type { IResumeTemplate } from '@/schema/types'
import { DEFAULT_GLOBAL_STYLE, softenColor } from '@/schema/style'
import { TEMPLATES } from '@/schema/templates'

/** 模板主题色：模板未配置时回退到全局默认色 */
function themeOf(item: IResumeTemplate): string {
  return item.style?.themeColor || DEFAULT_GLOBAL_STYLE.themeColor
}

/** 封面衬底：主题色的极浅渐变，让白底封面图在卡片里不显得空 */
function coverBg(item: IResumeTemplate): string {
  const color = themeOf(item)
  return `linear-gradient(160deg, ${softenColor(color, 0.88)} 0%, ${softenColor(color, 0.96)} 100%)`
}

function openTemplate(id: string) {
  uni.navigateTo({ url: `/pages/template-detail/template-detail?id=${id}` })
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
          <image :src="item.cover" mode="aspectFit" class="cover" />
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

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: rgb(244, 244, 244);
  padding-bottom: 70px;
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
  background: rgb(255 255 255 / 14%);
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
  background: rgb(255 255 255 / 22%);
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
  background: #fff;
  // box-shadow: 0 6px 18px rgb(23 43 77 / 7%);
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
.cover {
  width: 100%;
  height: 100%;
  border-radius: 8px;
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
.theme-dot {
  width: 10px;
  height: 10px;
  margin-left: 8px;
  border-radius: 50%;
}
.desc {
  display: -webkit-box;
  height: 34px;
  margin-top: 7px;
  overflow: hidden;
  color: #8290a5;
  font-size: 11px;
  line-height: 17px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.use-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}
.use {
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
}
.arrow {
  color: #c0c9d6;
  font-size: 16px;
  line-height: 1;
}
</style>
