<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { compactResume, darken, exportCanvasPdf, fontFamilyOptions, fontScaleOptions, getResumes, getTemplateLayout, getThemeColor, lighten, lineScaleOptions, ls, normalizeTemplateId, saveResume, setLineScale, styleThemeColors, templates } from '@/utils/resume'
import { getExtraDrawer } from '@/utils/resume-layouts'
import type { ResumeData, ResumeStyle } from '@/utils/resume'

const source = ref<ResumeData | null>(null)
const paperScale = ref(0.45)
const autoExport = ref(false)
const canvasReady = ref(false)
const showTemplatePicker = ref(false)
const showStyleEditor = ref(false)
const activeThemeColor = computed(() => source.value?.style?.themeColor || '')
const activeFontScale = computed(() => source.value?.style?.fontScale || 1)
const activeLineScale = computed(() => source.value?.style?.lineScale || 1)
const resume = computed(() => source.value ? compactResume({ avatar: '', ...source.value }) : null)

onLoad((query) => { autoExport.value = query?.export === '1' })
onShow(() => {
  source.value = uni.getStorageSync('resume-preview') || null
  paperScale.value = Math.min(1, Math.max(0.35, (uni.getSystemInfoSync().windowWidth - 28) / 794))
  canvasReady.value = false
  nextTick(() => setTimeout(() => drawExportCanvas(), 180))
})

/** 先按手动换行拆段，整个段落能放下则直接放，否则按 maxWidth 逐字折行，保证不超出 A4 边界。 */
function wrapText(ctx: UniApp.CanvasContext, value: string, maxWidth: number): string[] {
  const lines: string[] = []
  value.split(/\r?\n/).forEach((para) => {
    if (!para) return
    if (ctx.measureText(para).width <= maxWidth) { lines.push(para); return }
    let line = ''
    for (const ch of para) {
      if (line && ctx.measureText(line + ch).width > maxWidth) { lines.push(line); line = ch } else line += ch
    }
    if (line) lines.push(line)
  })
  return lines.length ? lines : ['']
}

/** 包一层画布上下文：setFontSize 按倍率缩放并附加用户选择的字体/字重，其余方法原样透传。 */
function createScaledContext(ctx: UniApp.CanvasContext, style: ResumeStyle): UniApp.CanvasContext {
  const scale = style.fontScale || 1
  const family = style.fontFamily || ''
  const weight = style.bold ? 'bold' : ''
  const methods = ['scale', 'fillRect', 'strokeRect', 'setTextAlign', 'fillText', 'setFillStyle', 'setStrokeStyle', 'beginPath', 'moveTo', 'lineTo', 'stroke', 'fill', 'arc', 'rect', 'closePath', 'clip', 'save', 'restore', 'drawImage', 'draw', 'measureText']
  const target = ctx as unknown as Record<string, (...args: unknown[]) => unknown>
  const wrapper: Record<string, unknown> = {}
  methods.forEach((method) => { wrapper[method] = (...args: unknown[]) => target[method](...args) })
  wrapper.setFontSize = (size: number) => {
    const finalSize = Math.round(size * scale * 2) / 2
    ctx.setFontSize(finalSize)
    // 字体/加粗通过 font 属性设置，个别平台不支持时静默忽略，保持默认字体
    if (weight || family) {
      try {
        (ctx as unknown as { font: string }).font = `${weight ? `${weight} ` : ''}${finalSize}px${family ? ` ${family}` : ''}`
      }
      catch { /* 平台不支持 font 属性，忽略 */ }
    }
  }
  return wrapper as unknown as UniApp.CanvasContext
}

function drawExportCanvas() {
  if (!resume.value) return
  // Keep the export renderer in lock-step with the A4 preview CSS (794 x 1123 px).
  const data = resume.value
  const style = data.style || {}
  const ctx = createScaledContext(uni.createCanvasContext('resumeCanvas'), style)
  // 行距档位写入共享状态，内置与扩展模板的绘制函数都会通过 ls() 读取
  setLineScale(style.lineScale)
  // 画布位图为 2 倍尺寸（1588x2246），这里按 794 坐标系绘制，保证导出 PDF 文字清晰不模糊。
  ctx.scale(2, 2)
  ctx.setFillStyle('#fff'); ctx.fillRect(0, 0, 794, 1123)

  const layout = getTemplateLayout(normalizeTemplateId(data.templateId))
  // 扩展模板（resume-layouts.ts）优先分发，未命中回落到内置模板
  const extraDrawer = getExtraDrawer(layout)
  if (extraDrawer) extraDrawer(ctx, data)
  else if (layout === 'sidebar') drawSidebar(ctx, data)
  else if (layout === 'minimal') drawMinimal(ctx, data)
  else if (layout === 'split') drawSplit(ctx, data)
  else if (layout === 'timeline') drawTimeline(ctx, data)
  else if (layout === 'banner') drawBanner(ctx, data)
  else if (layout === 'compact') drawCompact(ctx, data)
  else if (layout === 'card') drawCard(ctx, data)
  else if (layout === 'formal') drawFormal(ctx, data)
  else if (layout === 'creative') drawCreative(ctx, data)
  else drawClassic(ctx, data)

  ctx.draw(false, () => {
    canvasReady.value = true
    if (autoExport.value) setTimeout(() => exportPdf(), 120)
  })
}

/** 经典布局：顶部色条 + 居中身份区 + 单栏段落 */
function drawClassic(ctx: UniApp.CanvasContext, data: ResumeData) {
  const color = getThemeColor(data.templateId, data.style?.themeColor)
  const left = 54; const right = 740; let y = 42
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
  if (contactText) { ctx.setFillStyle('#64748b'); ctx.setFontSize(11); ctx.fillText(contactText, textX, ty) }
  y += 10 + (data.avatar ? 76 : Math.max(25, ty - (y + 10))) + 28
  ctx.setStrokeStyle('#dbe2ec'); ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke()

  const drawLines = (value: string, x: number, maxW: number, size: number, lineHeight: number, fill: string) => {
    ctx.setFillStyle(fill); ctx.setFontSize(size)
    wrapText(ctx, value, maxW).forEach(line => { ctx.fillText(line, x, y); y += lineHeight })
  }
  const section = (title: string, rows: string[]) => {
    if (!rows.length) return
    y += 25; ctx.setFillStyle(color); ctx.setFontSize(16); ctx.fillText(title, left, y); y += 6
    ctx.setFillStyle(color); ctx.fillRect(left, y, right - left, 2); y += 20
    rows.forEach((row) => { drawLines(row, left, right - left, 12, ls(20), '#475569'); y += ls(12) })
  }
  section('个人简介', data.summary ? [data.summary] : [])
  section('教育经历', data.education.map(item => [item.school, item.major].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : '')))
  section('工作经历', data.work.flatMap(item => [[item.company, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
  section('项目经历', data.projects.flatMap(item => [[item.name, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
  section('技能特长', data.skills ? [data.skills] : [])
}

/** 侧边栏布局：左侧深色栏放头像/联系方式/技能，右侧主体放经历 */
function drawSidebar(ctx: UniApp.CanvasContext, data: ResumeData) {
  const color = '#ffffff'
  const bg = data.style?.themeColor || '#0f2747'
  const accent = data.style?.themeColor ? lighten(bg, 0.5) : '#8aa8cc'
  const barW = 260
  const mainX = barW + 50
  const mainW = 794 - mainX - 54

  // 左侧深色边栏
  ctx.setFillStyle(bg); ctx.fillRect(0, 0, barW, 1123)

  // 边栏：头像 + 姓名 + 求职意向
  let by = 60
  if (data.avatar) {
    ctx.save(); ctx.beginPath(); ctx.arc(barW / 2, by + 45, 45, 0, Math.PI * 2); ctx.clip()
    ctx.drawImage(data.avatar, barW / 2 - 45, by, 90, 90); ctx.restore()
    by += 115
  }
  ctx.setTextAlign('center'); ctx.setFillStyle(color); ctx.setFontSize(20)
  ctx.fillText(data.name || '', barW / 2, by); by += 30
  if (data.intention) { ctx.setFillStyle(accent); ctx.setFontSize(13); ctx.fillText(data.intention, barW / 2, by); by += 28 }

  // 边栏：联系方式 + 技能
  const sideSection = (title: string, rows: string[]) => {
    if (!rows.length) return
    by += 20; ctx.setFillStyle(accent); ctx.setFontSize(13); ctx.fillText(title, barW / 2, by)
    by += 18; ctx.setFillStyle(barW && 0 ? '' : '#dbe2ec'); ctx.fillRect(60, by, barW - 120, 1); by += 22
    ctx.setFillStyle('#c7d4e4'); ctx.setFontSize(11)
    rows.forEach((row) => { ctx.fillText(row, barW / 2, by); by += ls(20) })
  }
  sideSection('联系方式', [data.phone, data.email, data.gender].filter(Boolean))
  sideSection('技能特长', data.skills ? wrapText(ctx, data.skills, barW - 120).map(line => line) : [])

  // 右侧主体：教育/工作/项目/简介
  let y = 70
  ctx.setTextAlign('left')
  const mainSection = (title: string, rows: string[]) => {
    if (!rows.length) return
    y += 10; ctx.setFillStyle('#0f2747'); ctx.setFontSize(16); ctx.fillText(title, mainX, y); y += 6
    ctx.setFillStyle(accent); ctx.fillRect(mainX, y, mainW, 2); y += 22
    rows.forEach((row) => {
      ctx.setFillStyle('#475569'); ctx.setFontSize(12)
      wrapText(ctx, row, mainW).forEach((line) => { ctx.fillText(line, mainX, y); y += ls(20) })
      y += ls(12)
    })
  }
  mainSection('个人简介', data.summary ? [data.summary] : [])
  mainSection('教育经历', data.education.map(item => [item.school, item.major].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : '')))
  mainSection('工作经历', data.work.flatMap(item => [[item.company, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
  mainSection('项目经历', data.projects.flatMap(item => [[item.name, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
}

/** 极简布局：居中无头像排版，细分隔线，大留白 */
function drawMinimal(ctx: UniApp.CanvasContext, data: ResumeData) {
  const center = 397
  const heading = data.style?.themeColor || '#1e293b'
  ctx.setTextAlign('center')
  let y = 80
  if (data.name) { ctx.setFillStyle(heading); ctx.setFontSize(28); ctx.fillText(data.name, center, y); y += 34 }
  if (data.intention) { ctx.setFillStyle('#64748b'); ctx.setFontSize(14); ctx.fillText(data.intention, center, y); y += 26 }
  const contactText = [data.phone, data.email, data.gender].filter(Boolean).join('  ·  ')
  if (contactText) { ctx.setFillStyle('#94a3b8'); ctx.setFontSize(11); ctx.fillText(contactText, center, y); y += 20 }
  y += 26; ctx.setFillStyle(heading); ctx.fillRect(247, y, 300, 1); y += 44

  const section = (title: string, rows: string[]) => {
    if (!rows.length) return
    ctx.setFillStyle(heading); ctx.setFontSize(15); ctx.fillText(title, center, y); y += 26
    ctx.setTextAlign('left'); ctx.setFillStyle('#475569'); ctx.setFontSize(12)
    rows.forEach((row) => { wrapText(ctx, row, 474).forEach((line) => { ctx.fillText(line, 160, y); y += ls(20) }); y += ls(12) })
    ctx.setTextAlign('center')
    y += 16
  }
  section('个人简介', data.summary ? [data.summary] : [])
  section('教育经历', data.education.map(item => [item.school, item.major].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : '')))
  section('工作经历', data.work.flatMap(item => [[item.company, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
  section('项目经历', data.projects.flatMap(item => [[item.name, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
  section('技能特长', data.skills ? [data.skills] : [])
}

/** 双栏布局：顶部横向头部，下方左右两栏 */
function drawSplit(ctx: UniApp.CanvasContext, data: ResumeData) {
  const color = getThemeColor(data.templateId, data.style?.themeColor)
  const barW = 794
  const padX = 50
  const colGap = 40
  const colW = (barW - padX * 2 - colGap) / 2
  const rightX = padX + colW + colGap

  // 顶部头部区
  ctx.setFillStyle(color); ctx.fillRect(0, 0, 794, 150)
  let hx = padX
  if (data.avatar) {
    ctx.save(); ctx.beginPath(); ctx.arc(hx + 35, 75, 35, 0, Math.PI * 2); ctx.clip()
    ctx.drawImage(data.avatar, hx, 40, 70, 70); ctx.restore()
    hx += 90
  }
  ctx.setTextAlign('left')
  if (data.name) { ctx.setFillStyle('#ffffff'); ctx.setFontSize(24); ctx.fillText(data.name, hx, 70) }
  if (data.intention) { ctx.setFillStyle(lighten(color, 0.85)); ctx.setFontSize(13); ctx.fillText(data.intention, hx, 96) }
  const contactText = [data.phone, data.email, data.gender].filter(Boolean).join('  ·  ')
  if (contactText) { ctx.setFillStyle(lighten(color, 0.7)); ctx.setFontSize(11); ctx.fillText(contactText, hx, 120) }

  const colSection = (x: number, w: number, y: number, title: string, rows: string[]) => {
    if (!rows.length) return y
    ctx.setFillStyle(color); ctx.setFontSize(15); ctx.fillText(title, x, y); y += 5
    ctx.setFillStyle(color); ctx.fillRect(x, y, w, 2); y += 20
    ctx.setFillStyle('#475569'); ctx.setFontSize(11)
    rows.forEach((row) => { wrapText(ctx, row, w).forEach((line) => { ctx.fillText(line, x, y); y += ls(18) }); y += ls(10) })
    return y + 14
  }

  // 左栏：简介 + 教育
  let ly = 190
  ly = colSection(padX, colW, ly, '个人简介', data.summary ? [data.summary] : [])
  ly = colSection(padX, colW, ly, '教育经历', data.education.map(item => [item.school, item.major].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : '')))

  // 右栏：工作 + 项目 + 技能
  let ry = 190
  ry = colSection(rightX, colW, ry, '工作经历', data.work.flatMap(item => [[item.company, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
  ry = colSection(rightX, colW, ry, '项目经历', data.projects.flatMap(item => [[item.name, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
  colSection(rightX, colW, ry, '技能特长', data.skills ? [data.skills] : [])
}

/** 时间轴布局：右侧身份信息，左侧竖向时间线串起各段经历 */
function drawTimeline(ctx: UniApp.CanvasContext, data: ResumeData) {
  const color = getThemeColor(data.templateId, data.style?.themeColor)
  const heading = darken(color, 0.8)
  const lineX = 88; const mainX = 130; let y = 92

  // 顶部身份区
  let hx = 66
  if (data.avatar) {
    ctx.save(); ctx.beginPath(); ctx.arc(hx + 32, y, 32, 0, Math.PI * 2); ctx.clip()
    ctx.drawImage(data.avatar, hx, y - 32, 64, 64); ctx.restore()
    hx += 92
  }
  ctx.setTextAlign('left')
  let ty = y - (data.avatar ? 12 : 0)
  if (data.name) { ctx.setFillStyle(heading); ctx.setFontSize(24); ctx.fillText(data.name, hx, ty); ty += 30 }
  if (data.intention) { ctx.setFillStyle(color); ctx.setFontSize(14); ctx.fillText(data.intention, hx, ty); ty += 24 }
  const contactText = [data.phone, data.email, data.gender].filter(Boolean).join('  ·  ')
  if (contactText) { ctx.setFillStyle('#64748b'); ctx.setFontSize(11); ctx.fillText(contactText, hx, ty) }
  y += 48
  ctx.setStrokeStyle(lighten(color, 0.8)); ctx.beginPath(); ctx.moveTo(66, y); ctx.lineTo(728, y); ctx.stroke()
  y += 16

  const dot = (cy: number) => { ctx.setFillStyle(color); ctx.beginPath(); ctx.arc(lineX, cy, 7, 0, Math.PI * 2); ctx.fill() }
  const timelineSection = (title: string, rows: string[]) => {
    if (!rows.length) return
    ctx.setFillStyle(color); ctx.setFontSize(15); ctx.fillText(title, mainX, y); y += 34
    rows.forEach((row, index) => {
      const isHeader = index % 3 === 0
      if (isHeader) { dot(y - 5); ctx.setFillStyle(heading); ctx.setFontSize(13); }
      else { ctx.setFillStyle('#64748b'); ctx.setFontSize(12) }
      wrapText(ctx, row, 728 - mainX).forEach((line) => { ctx.fillText(line, mainX, y); y += ls(20) })
      y += isHeader ? ls(14) : ls(6)
    })
    y += 16
  }
  ctx.setFillStyle(color); ctx.fillRect(lineX - 1.5, y - 8, 3, 560)
  timelineSection('个人简介', data.summary ? [data.summary] : [])
  timelineSection('教育经历', data.education.map(item => [item.school, item.major].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : '')))
  timelineSection('工作经历', data.work.flatMap(item => [[item.company, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
  timelineSection('项目经历', data.projects.flatMap(item => [[item.name, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
  timelineSection('技能特长', data.skills ? [data.skills] : [])
}

/** 横幅头图布局：顶部大色块承载身份区，下方单栏内容 */
function drawBanner(ctx: UniApp.CanvasContext, data: ResumeData) {
  const color = getThemeColor(data.templateId, data.style?.themeColor)
  ctx.setFillStyle(color); ctx.fillRect(0, 0, 794, 190)
  let y = 196

  // 头图区：头像 + 姓名 + 意向 + 联系方式
  let hx = 60
  if (data.avatar) {
    ctx.save(); ctx.beginPath(); ctx.rect(hx, 48, 84, 84); ctx.clip()
    ctx.drawImage(data.avatar, hx, 48, 84, 84); ctx.restore()
    hx += 110
  }
  ctx.setTextAlign('left')
  let ty = 84
  if (data.name) { ctx.setFillStyle('#ffffff'); ctx.setFontSize(26); ctx.fillText(data.name, hx, ty); ty += 34 }
  if (data.intention) { ctx.setFillStyle(lighten(color, 0.85)); ctx.setFontSize(15); ctx.fillText(data.intention, hx, ty); ty += 28 }
  const contactText = [data.phone, data.email, data.gender].filter(Boolean).join('  ·  ')
  if (contactText) { ctx.setFillStyle(lighten(color, 0.72)); ctx.setFontSize(12); ctx.fillText(contactText, hx, ty) }

  const section = (title: string, rows: string[]) => {
    if (!rows.length) return
    y += 22; ctx.setFillStyle(color); ctx.setFontSize(16); ctx.fillText(title, 60, y); y += 20
    rows.forEach((row) => { ctx.setFillStyle('#475569'); ctx.setFontSize(12); wrapText(ctx, row, 674).forEach((line) => { ctx.fillText(line, 60, y); y += ls(20) }); y += ls(10) })
    y += 10
    ctx.setStrokeStyle(lighten(color, 0.88)); ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(734, y); ctx.stroke()
  }
  section('个人简介', data.summary ? [data.summary] : [])
  section('教育经历', data.education.map(item => [item.school, item.major].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : '')))
  section('工作经历', data.work.flatMap(item => [[item.company, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
  section('项目经历', data.projects.flatMap(item => [[item.name, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
  section('技能特长', data.skills ? [data.skills] : [])
}

/** 紧凑列表布局：姓名紧凑头部 + 双列分区，信息密度高 */
function drawCompact(ctx: UniApp.CanvasContext, data: ResumeData) {
  const color = getThemeColor(data.templateId, data.style?.themeColor)
  const padX = 50; const colGap = 30
  const colW = (794 - padX * 2 - colGap) / 2
  const rightX = padX + colW + colGap

  // 单行紧凑头部
  let y = 62
  let hx = padX
  if (data.avatar) {
    ctx.save(); ctx.beginPath(); ctx.arc(hx + 22, y, 22, 0, Math.PI * 2); ctx.clip()
    ctx.drawImage(data.avatar, hx, y - 22, 44, 44); ctx.restore()
    hx += 60
  }
  ctx.setTextAlign('left')
  ctx.setFillStyle('#172033'); ctx.setFontSize(20)
  ctx.fillText(data.name || '', hx, y + 8)
  const contactText = [data.phone, data.email, data.gender, data.intention].filter(Boolean).join('  ·  ')
  if (contactText) { ctx.setFillStyle('#64748b'); ctx.setFontSize(10); ctx.fillText(contactText, hx, y + 28) }
  y += 54
  ctx.setFillStyle(color); ctx.fillRect(padX, y, 794 - padX * 2, 2); y += 26

  const colSection = (x: number, w: number, yy: number, title: string, rows: string[]) => {
    if (!rows.length) return yy
    ctx.setFillStyle(color); ctx.setFontSize(13); ctx.fillText(title, x, yy); yy += 12
    ctx.setFillStyle(lighten(color, 0.75)); ctx.fillRect(x, yy, w, 1.5); yy += 16
    ctx.setFillStyle('#475069'); ctx.setFontSize(11)
    rows.forEach((row) => { wrapText(ctx, row, w).forEach((line) => { ctx.fillText(line, x, yy); yy += ls(16) }); yy += ls(7) })
    return yy + 11
  }

  // 左列：简介 + 教育经历
  let ly = y
  ly = colSection(padX, colW, ly, '个人简介', data.summary ? wrapText(ctx, data.summary, colW).slice(0, 6) : [])
  ly = colSection(padX, colW, ly, '教育经历', data.education.map(item => [item.school, item.major, item.time].filter(Boolean).join(' · ')))
  colSection(padX, colW, ly, '技能特长', data.skills ? wrapText(ctx, data.skills, colW).slice(0, 8) : [])

  // 右列：工作 + 项目经历
  let ry = y
  ry = colSection(rightX, colW, ry, '工作经历', data.work.flatMap(item => [[item.company, item.role].filter(Boolean).join(' · ') + (item.time ? ` ${item.time}` : ''), item.detail].filter(Boolean)))
  colSection(rightX, colW, ry, '项目经历', data.projects.flatMap(item => [[item.name, item.role].filter(Boolean).join(' · ') + (item.time ? ` ${item.time}` : ''), item.detail].filter(Boolean)))
}

/** 简约卡片布局：各分区以带浅色衬底的圆角卡片呈现 */
function drawCard(ctx: UniApp.CanvasContext, data: ResumeData) {
  const color = getThemeColor(data.templateId, data.style?.themeColor)
  const nameColor = darken(color, 0.75)
  const padX = 45; const cardW = 794 - padX * 2; let y = 58

  // 头部身份区
  let hx = padX
  if (data.avatar) {
    ctx.save(); ctx.beginPath(); ctx.arc(hx + 30, y + 24, 30, 0, Math.PI * 2); ctx.clip()
    ctx.drawImage(data.avatar, hx, y - 6, 60, 60); ctx.restore()
    hx += 76
  }
  ctx.setTextAlign('left')
  let ty = y + 14
  if (data.name) { ctx.setFillStyle(nameColor); ctx.setFontSize(22); ctx.fillText(data.name, hx, ty); ty += 28 }
  const contactText = [data.intention, data.phone, data.email, data.gender].filter(Boolean).join('  ·  ')
  if (contactText) { ctx.setFillStyle('#7c6f96'); ctx.setFontSize(11); ctx.fillText(contactText, hx, ty) }
  y += 86

  const cardSection = (title: string, rows: string[]) => {
    if (!rows.length) return
    const lines: { text: string; title: boolean }[] = [{ text: title, title: true }]
    rows.forEach((row) => wrapText(ctx, row, cardW - 40).forEach(line => lines.push({ text: line, title: false })))
    const height = 34 + lines.length * ls(18) + 24
    ctx.setFillStyle(lighten(color, 0.93)); ctx.fillRect(padX, y, cardW, height)
    // 描边
    ctx.setStrokeStyle(lighten(color, 0.78)); ctx.strokeRect(padX, y, cardW, height)
    let cy = y + 32
    lines.forEach((line) => {
      if (line.title) { ctx.setFillStyle(color); ctx.setFontSize(14); ctx.fillText(line.text, padX + 20, cy) }
      else { ctx.setFillStyle('#57534e'); ctx.setFontSize(11); ctx.fillText(line.text, padX + 20, cy) }
      cy += ls(18)
    })
    y += height + 18
  }
  cardSection('个人简介', data.summary ? [data.summary] : [])
  cardSection('教育经历', data.education.map(item => [item.school, item.major].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : '')))
  cardSection('工作经历', data.work.flatMap(item => [[item.company, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
  cardSection('项目经历', data.projects.flatMap(item => [[item.name, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
  cardSection('技能特长', data.skills ? [data.skills] : [])
}

/** 居中正式布局：居中标题与配线，传统正装简历文风 */
function drawFormal(ctx: UniApp.CanvasContext, data: ResumeData) {
  const color = getThemeColor(data.templateId, data.style?.themeColor)
  const center = 397
  ctx.setTextAlign('center')
  let y = 78
  if (data.name) { ctx.setFillStyle(color); ctx.setFontSize(30); ctx.fillText(data.name, center, y); y += 40 }
  if (typeof data.intention === 'string' && data.intention) { ctx.setFillStyle('#64748b'); ctx.setFontSize(14); ctx.fillText(`求职意向：${data.intention}`, center, y); y += 26 }
  const contactText = [data.phone, data.email, data.gender].filter(Boolean).join('   |   ')
  if (contactText) { ctx.setFillStyle('#64748b'); ctx.setFontSize(12); ctx.fillText(contactText, center, y); y += 18 }
  y += 24; ctx.setFillStyle(color); ctx.fillRect(center - 130, y, 260, 2); y += 40

  const section = (title: string, rows: string[]) => {
    if (!rows.length) return
    ctx.setFillStyle(color); ctx.setFontSize(16)
    ctx.fillText(`— ${title} —`, center, y); y += 28
    ctx.setTextAlign('left'); ctx.setFillStyle('#334155'); ctx.setFontSize(12)
    rows.forEach((row) => { wrapText(ctx, row, 520).forEach((line) => { ctx.fillText(line, 137, y); y += ls(21) }); y += ls(12) })
    ctx.setTextAlign('center'); y += 18
  }
  section('个人简介', data.summary ? [data.summary] : [])
  section('教育经历', data.education.map(item => [item.school, item.major].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : '')))
  section('工作经历', data.work.flatMap(item => [[item.company, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
  section('项目经历', data.projects.flatMap(item => [[item.name, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
  section('技能特长', data.skills ? [data.skills] : [])
  // 底部收尾线
  ctx.setFillStyle(color); ctx.fillRect(160, 1040, 474, 1)
}

/** 创意布局：左上彩色几何角块 + 左列身份/技能卡片 + 右列经历 */
function drawCreative(ctx: UniApp.CanvasContext, data: ResumeData) {
  const color = getThemeColor(data.templateId, data.style?.themeColor)
  const dark = data.style?.themeColor ? darken(color, 0.7) : '#14532d'
  const sideX = 50; const sideW = 170

  // 左上角几何块与右侧三角
  ctx.setFillStyle(color); ctx.fillRect(0, 0, 140, 140)
  ctx.beginPath(); ctx.moveTo(794, 0); ctx.lineTo(794, 96); ctx.lineTo(698, 0); ctx.closePath(); ctx.fill()

  // 左列：头像/姓名/联系方式
  let sy = 176
  if (data.avatar) {
    ctx.save(); ctx.beginPath(); ctx.arc(sideX + 45, sy + 42, 42, 0, Math.PI * 2); ctx.clip()
    ctx.drawImage(data.avatar, sideX + 3, sy, 84, 84); ctx.restore()
    sy += 104
  }
  ctx.setTextAlign('center')
  ctx.setFillStyle(dark); ctx.setFontSize(18); ctx.fillText(data.name || '', sideX + 45, sy); sy += 26
  if (data.intention) { ctx.setFillStyle(color); ctx.setFontSize(12); ctx.fillText(data.intention, sideX + 45, sy); sy += 22 }
  const contactText = [data.phone, data.email, data.gender].filter(Boolean).join('  ·  ')
  if (contactText) { ctx.setFillStyle('#6b7f72'); ctx.setFontSize(10); ctx.fillText(contactText, sideX + 45, sy) }

  // 左列：技能大方卡
  if (data.skills) {
    const lines = wrapText(ctx, data.skills, sideW - 28)
    const boxH = 36 + lines.length * ls(17)
    sy += 30
    ctx.setFillStyle(lighten(color, 0.88)); ctx.fillRect(30, sy, sideW, boxH)
    ctx.setFillStyle(color); ctx.setFontSize(12); ctx.fillText('技能特长', 30 + 14, sy + 26)
    ctx.setFillStyle('#3f4f45'); ctx.setFontSize(10)
    let kby = sy + 52
    lines.forEach((line) => { ctx.fillText(line, 30 + 14, kby); kby += ls(17) })
  }

  // 右列：经历内容卡片
  const rightX = 250; const rightW = 794 - rightX - 50; let ry = 190
  const mainSection = (title: string, rows: string[]) => {
    if (!rows.length) return
    const lines: string[] = []
    rows.forEach((row) => wrapText(ctx, row, rightW - 44).forEach(line => lines.push(line)))
    const boxH = 34 + lines.length * ls(18) + 22
    ctx.setFillStyle('#f1f5f9'); ctx.fillRect(rightX, ry, rightW, boxH)
    ctx.setFillStyle(dark); ctx.setFontSize(14); ctx.fillText(title, rightX + 22, ry + 28)
    let cy = ry + 54
    ctx.setFillStyle('#47525b'); ctx.setFontSize(11)
    lines.forEach((line) => { ctx.fillText(line, rightX + 22, cy); cy += ls(18) })
    ry += boxH + 22
  }
  ctx.setTextAlign('left')
  mainSection('个人简介', data.summary ? [data.summary] : [])
  mainSection('教育经历', data.education.map(item => [item.school, item.major].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : '')))
  mainSection('工作经历', data.work.flatMap(item => [[item.company, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
  mainSection('项目经历', data.projects.flatMap(item => [[item.name, item.role].filter(Boolean).join(' · ') + (item.time ? `    ${item.time}` : ''), item.detail].filter(Boolean)))
}

function exportPdf() {
  if (!resume.value) return
  if (!canvasReady.value) {
    uni.showToast({ title: '预览正在生成，请稍候', icon: 'none' })
    return
  }
  exportCanvasPdf('resumeCanvas', resume.value.name || 'resume')
}

/** 把模板/样式变更同步回预览缓存、编辑草稿与简历列表，避免退出预览后丢失 */
function persistResume(patch: Partial<ResumeData>) {
  if (!source.value) return
  source.value = { ...source.value, ...patch }
  uni.setStorageSync('resume-preview', source.value)
  const draft = uni.getStorageSync('resume-draft') as ResumeData | ''
  if (draft && draft.id === source.value.id)
    uni.setStorageSync('resume-draft', { ...draft, ...patch })
  if (source.value.id && getResumes().some(i => i.id === source.value.id))
    saveResume(source.value)
}

function redraw() {
  canvasReady.value = false
  nextTick(() => setTimeout(() => drawExportCanvas(), 180))
}

function switchTemplate(id: string) {
  if (!source.value) return
  persistResume({ templateId: id })
  showTemplatePicker.value = false
  redraw()
}

function setThemeColor(color: string) {
  if (!source.value) return
  persistResume({ style: { ...source.value.style, themeColor: color } })
  redraw()
}

function setFontScale(value: number) {
  if (!source.value) return
  persistResume({ style: { ...source.value.style, fontScale: value } })
  redraw()
}

/** 样式编辑：持久化行距档位（模块级绘制状态的更新由 drawExportCanvas 里的 setLineScale 完成） */
function applyLineScale(value: number) {
  if (!source.value) return
  persistResume({ style: { ...source.value.style, lineScale: value } })
  redraw()
}

function setFontFamily(value: string) {
  if (!source.value) return
  persistResume({ style: { ...source.value.style, fontFamily: value } })
  redraw()
}

function setBold(value: boolean) {
  if (!source.value) return
  persistResume({ style: { ...source.value.style, bold: value } })
  redraw()
}

function resetStyle() {
  if (!source.value) return
  persistResume({ style: { themeColor: '', fontScale: 1, lineScale: 1, fontFamily: '', bold: false } })
  redraw()
}
</script>

<template>
  <view class="page">
    <scroll-view scroll-y class="scroll">
      <view v-if="resume" class="paper-frame" :style="{height:`${1123 * paperScale}px`}">
        <canvas id="resumeCanvas" canvas-id="resumeCanvas" class="paper-canvas" :style="{ transform: `scale(${paperScale / 2})` }" width="1588" height="2246" />
      </view>
      <view v-else class="empty">暂无可预览内容</view>
    </scroll-view>
    <view v-if="resume" class="actions">
      <button class="export secondary" @click="showTemplatePicker = true">更换模板</button>
      <button class="export secondary" @click="showStyleEditor = true">编辑样式</button>
      <button class="export" @click="exportPdf">导出 PDF</button>
    </view>
    <view v-if="showStyleEditor" class="mask" @click="showStyleEditor = false">
      <view class="picker style-picker" @click.stop>
        <text class="picker-title">编辑样式</text>
        <text class="style-label">主题颜色</text>
        <view class="color-row">
          <view class="color-dot color-default" :class="{ active: !activeThemeColor }" @click="setThemeColor('')" />
          <view
            v-for="c in styleThemeColors"
            :key="c"
            class="color-dot"
            :class="{ active: activeThemeColor === c }"
            :style="{ background: c }"
            @click="setThemeColor(c)"
          />
        </view>
        <text class="style-hint">默认色跟随当前模板的主题配色</text>
        <text class="style-label">字体大小</text>
        <view class="font-row">
          <view
            v-for="opt in fontScaleOptions"
            :key="opt.value"
            class="font-item"
            :class="{ active: activeFontScale === opt.value }"
            @click="setFontScale(opt.value)"
          >
            {{ opt.label }}
          </view>
        </view>
        <text class="style-label">行距</text>
        <view class="font-row">
          <view
            v-for="opt in lineScaleOptions"
            :key="opt.value"
            class="font-item"
            :class="{ active: activeLineScale === opt.value }"
            @click="applyLineScale(opt.value)"
          >
            {{ opt.label }}
          </view>
        </view>
        <text class="style-label">字体</text>
        <view class="font-row">
          <view
            v-for="opt in fontFamilyOptions"
            :key="opt.label"
            class="font-item"
            :class="{ active: (source?.style?.fontFamily || '') === opt.value }"
            @click="setFontFamily(opt.value)"
          >
            {{ opt.label }}
          </view>
        </view>
        <text class="style-label">字重</text>
        <view class="font-row">
          <view class="font-item" :class="{ active: !source?.style?.bold }" @click="setBold(false)">常规</view>
          <view class="font-item" :class="{ active: !!source?.style?.bold }" @click="setBold(true)">加粗</view>
        </view>
        <text class="style-hint">衬线/等宽与加粗在部分设备上可能跟随系统字体回退</text>
        <button class="reset-btn" @click="resetStyle">恢复默认样式</button>
      </view>
    </view>
    <view v-if="showTemplatePicker" class="mask" @click="showTemplatePicker = false">
      <view class="picker" @click.stop>
        <text class="picker-title">选择模板</text>
        <view class="picker-grid">
          <view
            v-for="t in templates"
            :key="t.id"
            class="picker-item"
            :class="{ active: t.id === source?.templateId }"
            @click="switchTemplate(t.id)"
          >
            <image :src="t.cover" mode="aspectFit" class="picker-cover" />
            <text class="picker-name">{{ t.name }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page{min-height:100vh;padding:16px 14px 82px;background:#20242d;box-sizing:border-box}.scroll{height:calc(100vh - 98px)}.paper-frame{position:relative;width:100%;margin:0 auto}.paper-canvas{position:absolute;top:0;left:50%;width:1588px;height:2246px;margin-left:-794px;transform-origin:top center;box-shadow:0 5px 24px rgb(0 0 0 / 24%);background:#fff}.export{flex:1;height:46px;border-radius:23px;background:#2563eb;color:#fff;line-height:46px;font-size:15px}
.actions{position:fixed;right:20px;bottom:18px;left:20px;display:flex;gap:12px}
.export.secondary{background:#fff;color:#2563eb;border:1px solid #2563eb}
.mask{position:fixed;inset:0;z-index:10;background:rgb(15 23 42 / 45%)}
.picker{position:absolute;left:0;right:0;bottom:0;padding:20px 16px 32px;background:#fff;border-radius:20px 20px 0 0}
.picker-title{display:block;margin-bottom:16px;font-size:16px;font-weight:700;color:#172033}
.picker-grid{display:flex;flex-wrap:wrap;gap:14px;max-height:52vh;overflow-y:auto}
.picker-item{width:calc(50% - 7px);padding:10px;border:2px solid #e2e8f0;border-radius:12px;box-sizing:border-box;background:#f8fafc}
.picker-item.active{border-color:#2563eb}
.picker-cover{width:100%;height:150px;background:#e8f0ff;border-radius:8px}
.picker-name{display:block;margin-top:8px;font-size:13px;color:#334155;text-align:center}.empty{padding-top:120px;color:#cbd5e1;text-align:center}
.style-label{display:block;margin:18px 2px 10px;font-size:13px;font-weight:600;color:#334155}
.style-picker{max-height:74vh;overflow-y:auto}
.color-row{display:flex;flex-wrap:wrap;gap:14px;align-items:center}
.color-dot{width:34px;height:34px;border-radius:50%;border:2px solid transparent;box-sizing:border-box}
.color-dot.active{border-color:#172033;box-shadow:inset 0 0 0 2px #fff}
.color-default{background:linear-gradient(135deg,#e2e8f0 50%,#64748b 50%)}
.style-hint{display:block;margin:10px 2px 0;font-size:12px;color:#94a3b8}
.font-row{display:flex;gap:10px}
.font-item{flex:1;height:38px;line-height:34px;text-align:center;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;color:#334155;background:#f8fafc;box-sizing:border-box}
.font-item.active{border-color:#2563eb;color:#2563eb;background:#eff6ff}
.reset-btn{margin-top:24px;height:42px;line-height:42px;border-radius:21px;background:#f1f5f9;color:#64748b;font-size:14px}
</style>
