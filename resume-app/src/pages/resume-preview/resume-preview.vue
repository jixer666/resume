<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { compactResume, exportCanvasPdf } from '@/utils/resume'
import type { ResumeData } from '@/utils/resume'

const source = ref<ResumeData | null>(null)
const paperScale = ref(0.45)
const autoExport = ref(false)
const canvasReady = ref(false)
const resume = computed(() => source.value ? compactResume({ avatar: '', ...source.value }) : null)

onLoad((query) => { autoExport.value = query?.export === '1' })
onShow(() => {
  source.value = uni.getStorageSync('resume-preview') || null
  paperScale.value = Math.min(1, Math.max(0.35, (uni.getSystemInfoSync().windowWidth - 28) / 794))
  canvasReady.value = false
  nextTick(() => setTimeout(() => drawExportCanvas(), 180))
})

function wrap(value: string) { return value.split(/\r?\n/) }
function drawExportCanvas() {
  if (!resume.value) return
  // Keep the export renderer in lock-step with the A4 preview CSS (794 x 1123 px).
  // Every coordinate below corresponds to the same padding, font and line-height
  // used by .paper/.identity/.section, so the PDF is a pixel-sized snapshot of it.
  const data = resume.value
  const color = data.templateId === 'navy' ? '#0f2747' : data.templateId === 'cyan' ? '#0891b2' : '#2563eb'
  const ctx = uni.createCanvasContext('resumeCanvas')
  const left = 54; const right = 740; let y = 42
  ctx.setFillStyle('#fff'); ctx.fillRect(0, 0, 794, 1123)
  ctx.setFillStyle(color); ctx.fillRect(0, 0, 794, 8)

  // identity: flex row, centred as in the preview
  const contactText = [data.phone, data.email, data.gender].filter(Boolean).join('  ·  ')
  const name = data.name || ''
  ctx.setFontSize(25); const nameW = ctx.measureText(name).width
  ctx.setFontSize(14); const intentW = data.intention ? ctx.measureText(data.intention).width : 0
  ctx.setFontSize(11); const contactW = contactText ? ctx.measureText(contactText).width : 0
  const textW = Math.max(nameW, intentW, contactW)
  const groupW = textW + (data.avatar ? 96 : 0)
  const gx = (794 - groupW) / 2; const textX = gx + (data.avatar ? 96 : 0)
  if (data.avatar) {
    ctx.save(); ctx.beginPath(); ctx.arc(gx + 38, y + 48, 38, 0, Math.PI * 2); ctx.clip()
    ctx.drawImage(data.avatar, gx, y + 10, 76, 76); ctx.restore()
  }
  ctx.setTextAlign('left'); let ty = y + 35
  if (name) { ctx.setFillStyle('#172033'); ctx.setFontSize(25); ctx.fillText(name, textX, ty); ty += 32 }
  if (data.intention) { ctx.setFillStyle(color); ctx.setFontSize(14); ctx.fillText(data.intention, textX, ty); ty += 24 }
  if (contactText) { ctx.setFillStyle('#64748b'); ctx.setFontSize(11); ctx.fillText(contactText, textX, ty); }
  y += 10 + (data.avatar ? 76 : Math.max(25, ty - (y + 10))) + 28
  ctx.setStrokeStyle('#dbe2ec'); ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke()

  const drawLines = (value: string, x: number, size: number, lineHeight: number, fill: string) => {
    ctx.setFillStyle(fill); ctx.setFontSize(size); wrap(value).forEach(line => { ctx.fillText(line, x, y); y += lineHeight })
  }
  const section = (title: string, rows: string[]) => {
    if (!rows.length) return
    y += 25; ctx.setFillStyle(color); ctx.setFontSize(16); ctx.fillText(title, left, y); y += 6
    ctx.setFillStyle(color); ctx.fillRect(left, y, right - left, 2); y += 20
    rows.forEach(row => { drawLines(row, left, 12, 20, '#475569'); y += 12 })
  }
  section('个人简介', data.summary ? [data.summary] : [])
  section('教育经历', data.education.map(item => [item.school, item.major].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : '')))
  section('工作经历', data.work.flatMap(item => [[item.company, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
  section('项目经历', data.projects.flatMap(item => [[item.name, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
  section('技能特长', data.skills ? [data.skills] : [])
  ctx.draw(false, () => {
    canvasReady.value = true
    if (autoExport.value) setTimeout(() => exportPdf(), 120)
  })
}

function exportPdf() {
  if (!resume.value) return
  if (!canvasReady.value) {
    uni.showToast({ title: '预览正在生成，请稍候', icon: 'none' })
    return
  }
  exportCanvasPdf('resumeCanvas', resume.value.name || 'resume')
}
</script>

<template>
  <view class="page">
    <scroll-view scroll-y class="scroll">
      <view v-if="resume" class="paper-frame" :style="{height:`${1123 * paperScale}px`}">
        <canvas id="resumeCanvas" canvas-id="resumeCanvas" class="paper-canvas" :style="{ transform: `scale(${paperScale})` }" width="794" height="1123" />
      </view>
      <view v-else class="empty">暂无可预览内容</view>
    </scroll-view>
    <button v-if="resume" class="export" @click="exportPdf">导出 PDF</button>
  </view>
</template>

<style scoped lang="scss">
.page{min-height:100vh;padding:16px 14px 82px;background:#20242d;box-sizing:border-box}.scroll{height:calc(100vh - 98px)}.paper-frame{position:relative;width:100%;margin:0 auto}.paper-canvas{position:absolute;top:0;left:50%;width:794px;height:1123px;margin-left:-397px;transform-origin:top center;box-shadow:0 5px 24px rgb(0 0 0 / 24%);background:#fff}.export{position:fixed;right:20px;bottom:18px;left:20px;height:46px;border-radius:23px;background:#2563eb;color:#fff;line-height:46px}.empty{padding-top:120px;color:#cbd5e1;text-align:center}
</style>
