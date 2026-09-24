<script setup lang="ts">
import type { IBaseInfoData, IResumeJson } from '@/schema/types'
import { DEFAULT_GLOBAL_STYLE, softenColor } from '@/schema/style'
import { DEFAULT_TEMPLATE_ID, getTemplate } from '@/schema/templates'
import { useResumeStore } from '@/store/resume'

const store = useResumeStore()
const list = computed(() => store.list)

/** 最近一次更新的时间，用于头部摘要 */
const latestText = computed(() => list.value[0]?.updatedAt || '')

function edit(id: string) {
  uni.navigateTo({ url: `/pages/resume-edit/resume-edit?id=${id}` })
}

function create() {
  const json = store.createResume(DEFAULT_TEMPLATE_ID)
  uni.navigateTo({ url: `/pages/resume-edit/resume-edit?id=${json.ID}` })
}

/** 求职意向取自基本信息模块，没有则回退提示文案 */
function intentionOf(item: IResumeJson): string {
  const base = item.COMPONENTS.find(com => com.model === 'BASE_INFO')
  const data = base?.data as IBaseInfoData | undefined
  return data?.intention || '尚未填写求职意向'
}

/** 简历所用模板：名称与主题色都从模板清单取，缺省回退到默认值 */
function templateOf(item: IResumeJson) {
  return getTemplate(item.templateId)
}

function themeOf(item: IResumeJson): string {
  return templateOf(item).style?.themeColor || DEFAULT_GLOBAL_STYLE.themeColor
}

/** 缩略图衬底：主题色的极浅渐变，白底封面图不会在卡片里显得空 */
function thumbBg(item: IResumeJson): string {
  const color = themeOf(item)
  return `linear-gradient(160deg, ${softenColor(color, 0.88)} 0%, ${softenColor(color, 0.96)} 100%)`
}

function exportPdf(item: IResumeJson) {
  uni.navigateTo({ url: `/pages/resume-preview/resume-preview?id=${item.ID}` })
}
</script>

<template>
  <view class="page">
    <view class="hero">
      <view class="glow glow-a" />
      <view class="glow glow-b" />
      <view class="hero-top">
        <text class="hero-title">我的简历</text>
        <view class="hero-badge">
          {{ list.length }} 份
        </view>
      </view>
      <text class="hero-sub">
        {{ latestText ? `最近更新于 ${latestText}` : '从模板开始，创建你的第一份简历' }}
      </text>
    </view>

    <view v-if="list.length" class="list">
      <view
        v-for="item in list"
        :key="item.ID"
        class="card"
        hover-class="card-press"
        @click="edit(item.ID)"
      >
        <view class="card-main">
          <view class="thumb" :style="{ background: thumbBg(item) }">
            <image :src="templateOf(item).cover" mode="aspectFit" class="thumb-img" />
          </view>
          <view class="info">
            <view class="name-row">
              <view class="name">
                {{ item.NAME || '未命名简历' }}
              </view>
              <view class="tag" :style="{ background: softenColor(themeOf(item), 0.9), color: themeOf(item) }">
                {{ templateOf(item).name }}
              </view>
            </view>
            <text class="intent">{{ intentionOf(item) }}</text>
          </view>
        </view>
        <view class="card-foot">
          <text class="time">更新于 {{ item.updatedAt }}</text>
          <view class="export" hover-class="export-press" @click.stop="exportPdf(item)">
            导出 PDF
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty">
      <view class="empty-icon">
        ＋
      </view>
      <text class="empty-title">还没有简历</text>
      <text class="empty-sub">从一个模板开始，创建你的第一份简历</text>
      <view class="create" hover-class="create-press" @click="create">
        创建简历
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
.list {
  padding: 16px 16px 0;
}
.card {
  padding: 14px;
  border-radius: 8px;
  background: #fff;
}
.card + .card {
  margin-top: 12px;
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
.thumb-img {
  width: 100%;
  height: 100%;
  border-radius: 6px;
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
.intent {
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
.export {
  padding: 5px 14px;
  border-radius: 13px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
}
.export-press {
  background: #dbeafe;
}
.empty {
  display: flex;
  align-items: center;
  flex-direction: column;
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
