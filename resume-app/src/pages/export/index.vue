<script lang="ts" setup>
import ResumeRender from '@/components/ResumeRender/ResumeRender.vue'
import { useResumeStore } from '@/store/resume'
import { useTokenStore } from '@/store/token'

/**
 * H5 导出预览页：只给后端无头浏览器（Playwright）打开用，不是给用户点的页面。
 *
 * 后端导出接口把当前请求的 JWT 拼进 URL（`?id=xxx&token=xxx`），Playwright 打开本页；
 * 本页用该 token 调 `GET /resume/detail/{id}` 自取详情，再用编辑预览同一套 ResumeRender 渲染 ——
 * 渲染代码零重写，导出的 PDF 与小程序预览所见完全一致。
 *
 * 所以本页必须「干净」：无导航栏、无按钮、无缩放、无黑底，A4 宽 794px 原尺寸直出。
 */
defineOptions({ name: 'ResumeExport' })
definePage({
  style: {
    // 全局是蓝底导航栏，必须换成自定义，否则蓝条会印进 PDF
    navigationStyle: 'custom',
    navigationBarTitleText: '简历导出',
  },
})

const resumeStore = useResumeStore()
const tokenStore = useTokenStore()
const resume = computed(() => resumeStore.current)

onLoad(async (query) => {
  const id = query?.id ? String(query.id) : ''
  const token = query?.token ? String(query.token) : ''
  // Playwright 每次都是全新上下文，storage 为空，必须先把 URL 里的 token 灌进 store，
  // 否则下面取详情时请求头不带 Authorization，会被鉴权拦掉
  if (token)
    tokenStore.setTokenInfo({ token, expiresIn: 3600 })
  if (id)
    await resumeStore.loadResume(id)
})
</script>

<template>
  <view class="export-page">
    <ResumeRender v-if="resume" :json="resume" />
  </view>
</template>

<style lang="scss" scoped>
/* A4 纸宽：与物料层字号 / 间距同一坐标系，不缩放，出 PDF 时才不会被二次拉伸 */
.export-page {
  box-sizing: border-box;
  width: 794px;
  min-height: 1123px;
  background-color: #fff;
}
</style>
