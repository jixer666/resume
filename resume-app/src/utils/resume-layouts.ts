/**
 * 扩展简历模板绘制库（第 2 批，40 款）。
 *
 * 与 resume-preview.vue 内置的 10 款模板并存：
 * - 模板元数据（extraTemplates）由 resume.ts 合并进 templates 数组
 * - 绘制函数通过 getExtraDrawer 分发，未命中时回落到内置模板
 *
 * 所有绘制基于 794x1123（A4 比例）坐标系，导出位图为 2 倍尺寸。
 * 六大布局族：左侧色条 / 顶部色带 / 浅色双栏 / 时间轴变体 / 卡片边框 / 特色居中。
 */
import type { ResumeData, ResumeEntry } from './resume'
import { ls } from './resume'

type Ctx = UniApp.CanvasContext
type DrawFn = (ctx: Ctx, data: ResumeData) => void

// ---------------- 基础工具 ----------------

function wrap(ctx: Ctx, value: string, maxWidth: number): string[] {
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

function clampChannel(value: number) { return Math.max(0, Math.min(255, Math.round(value))) }
function mix(hexA: string, hexB: string, weight: number): string {
  const parse = (hex: string) => { const v = hex.replace('#', ''); return [0, 2, 4].map(i => parseInt(v.slice(i, i + 2), 16) || 0) }
  const a = parse(hexA); const b = parse(hexB)
  return `#${a.map((c, i) => clampChannel(c * weight + b[i] * (1 - weight)).toString(16).padStart(2, '0')).join('')}`
}
/** 掺白提亮：amount 为白色比例（0-1） */
function tint(hex: string, amount: number): string { return mix(hex, '#ffffff', amount) }
/** 掺黑加深：amount 为黑色比例（0-1） */
function shade(hex: string, amount: number): string { return mix(hex, '#000000', amount) }

function circleAvatar(ctx: Ctx, src: string, cx: number, cy: number, r: number) {
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip()
  ctx.drawImage(src, cx - r, cy - r, r * 2, r * 2); ctx.restore()
}
function rectAvatar(ctx: Ctx, src: string, x: number, y: number, w: number, h: number) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip()
  ctx.drawImage(src, x, y, w, h); ctx.restore()
}
/** 圆角矩形路径（uni 旧版画布无 roundRect，用 arc 拼装），调用方自行 fill/stroke */
function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.lineTo(x + w - rr, y); ctx.arc(x + w - rr, y + rr, rr, Math.PI * 1.5, Math.PI * 2)
  ctx.lineTo(x + w, y + h - rr); ctx.arc(x + w - rr, y + h - rr, rr, 0, Math.PI * 0.5)
  ctx.lineTo(x + rr, y + h); ctx.arc(x + rr, y + h - rr, rr, Math.PI * 0.5, Math.PI)
  ctx.lineTo(x, y + rr); ctx.arc(x + rr, y + rr, rr, Math.PI, Math.PI * 1.5)
  ctx.closePath()
}

// ---------------- 内容组装 ----------------

const contactOf = (d: ResumeData) => [d.phone, d.email, d.gender].filter(Boolean).join('  ·  ')
const eduLine = (i: ResumeEntry) => [i.school, i.major].filter(Boolean).join(' · ') + (i.time ? `    ${i.time}` : '')
const jobLine = (i: ResumeEntry) => [i.company, i.role].filter(Boolean).join(' · ') + (i.time ? `    ${i.time}` : '')
const projLine = (i: ResumeEntry) => [i.name, i.role].filter(Boolean).join(' · ') + (i.time ? `    ${i.time}` : '')

interface Section { title: string; rows: string[] }

function sectionsOf(d: ResumeData): Section[] {
  return [
    { title: '个人简介', rows: d.summary ? [d.summary] : [] },
    { title: '教育经历', rows: d.education.map(eduLine) },
    { title: '工作经历', rows: d.work.flatMap(i => [jobLine(i), i.detail].filter(Boolean)) },
    { title: '项目经历', rows: d.projects.flatMap(i => [projLine(i), i.detail].filter(Boolean)) },
    { title: '技能特长', rows: d.skills ? [d.skills] : [] },
  ].filter(s => s.rows.length)
}

/** 正文段落：逐行折行绘制，返回新的 y（行高与行间距跟随"编辑样式"的行距档位缩放） */
function paragraph(ctx: Ctx, rows: string[], x: number, y: number, maxW: number, opts?: { size?: number; lineH?: number; gap?: number; color?: string }): number {
  const size = opts?.size ?? 12; const lineH = opts?.lineH ?? 20; const gap = opts?.gap ?? 10
  ctx.setTextAlign('left'); ctx.setFillStyle(opts?.color ?? '#475569'); ctx.setFontSize(size)
  rows.forEach((row) => { wrap(ctx, row, maxW).forEach((line) => { ctx.fillText(line, x, y); y += ls(lineH) }); y += ls(gap) })
  return y
}

type TitleStyle = 'bar' | 'chip' | 'softChip' | 'dot' | 'num' | 'underline' | 'diamond'

/** 分区标题：在基线 y 处绘制，返回标题到正文起始的纵向增量 */
function sectionTitle(ctx: Ctx, style: TitleStyle, title: string, x: number, y: number, color: string, index: number): number {
  if (style === 'bar') {
    ctx.setFillStyle(color); ctx.fillRect(x, y - 14, 4, 18)
    ctx.setFillStyle('#172033'); ctx.setFontSize(15); ctx.fillText(title, x + 12, y)
    return 26
  }
  if (style === 'chip' || style === 'softChip') {
    ctx.setFontSize(13)
    const w = ctx.measureText(title).width + 22
    ctx.setFillStyle(style === 'chip' ? color : tint(color, 0.86))
    roundRect(ctx, x, y - 15, w, 23, 4); ctx.fill()
    ctx.setFillStyle(style === 'chip' ? '#ffffff' : color)
    ctx.fillText(title, x + 11, y + 2)
    return 30
  }
  if (style === 'dot') {
    ctx.setFillStyle(color); ctx.beginPath(); ctx.arc(x + 4, y - 5, 4, 0, Math.PI * 2); ctx.fill()
    ctx.setFillStyle('#172033'); ctx.setFontSize(15); ctx.fillText(title, x + 16, y)
    return 26
  }
  if (style === 'num') {
    ctx.setFillStyle(tint(color, 0.55)); ctx.setFontSize(17); ctx.fillText(`0${(index % 9) + 1}`, x, y)
    ctx.setFillStyle('#172033'); ctx.setFontSize(15); ctx.fillText(title, x + 34, y)
    return 26
  }
  if (style === 'underline') {
    ctx.setFillStyle('#172033'); ctx.setFontSize(16)
    ctx.fillText(title, x, y)
    const w = ctx.measureText(title).width
    ctx.setFillStyle(color); ctx.fillRect(x, y + 8, w, 3)
    return 30
  }
  // diamond 菱形标
  ctx.setFillStyle(color); ctx.beginPath()
  ctx.moveTo(x + 5, y - 14); ctx.lineTo(x + 10, y - 8); ctx.lineTo(x + 5, y - 2); ctx.lineTo(x, y - 8)
  ctx.closePath(); ctx.fill()
  ctx.setFillStyle('#172033'); ctx.setFontSize(15); ctx.fillText(title, x + 18, y)
  return 26
}

/** 单栏正文：依次绘制全部分区，返回结束 y */
function renderSections(ctx: Ctx, d: ResumeData, x: number, y: number, w: number, color: string, style: TitleStyle): number {
  sectionsOf(d).forEach((s, i) => {
    y += 6
    y += sectionTitle(ctx, style, s.title, x, y, color, i)
    y = paragraph(ctx, s.rows, x, y, w)
  })
  return y
}

// ---------------- 布局族一：左侧色条 ----------------

interface AccentCfg { color: string; style: TitleStyle; avatarSide?: 'right'; footer?: boolean }

function buildAccentBar(cfg: AccentCfg): DrawFn {
  return (ctx, data) => {
    const color = cfg.color
    const left = 56
    const textW = cfg.avatarSide === 'right' && data.avatar ? 560 : 698
    ctx.setFillStyle(color); ctx.fillRect(0, 0, 10, 1123)
    ctx.setTextAlign('left')
    let y = 84
    if (data.name) { ctx.setFillStyle('#172033'); ctx.setFontSize(24); ctx.fillText(data.name, left, y); y += 32 }
    if (data.intention) { ctx.setFillStyle(color); ctx.setFontSize(13); ctx.fillText(data.intention, left, y); y += 24 }
    const contact = contactOf(data)
    if (contact) { ctx.setFillStyle('#64748b'); ctx.setFontSize(11); ctx.fillText(contact, left, y); y += 18 }
    if (cfg.avatarSide === 'right' && data.avatar) circleAvatar(ctx, data.avatar, 700, 96, 42)
    y += 10
    ctx.setStrokeStyle('#e2e8f0'); ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(754, y); ctx.stroke()
    renderSections(ctx, data, left, y + 14, textW, color, cfg.style)
    if (cfg.footer) { ctx.setFillStyle(color); ctx.fillRect(0, 1107, 794, 16) }
  }
}

// ---------------- 布局族二：顶部色带 ----------------

interface BandCfg {
  color: string
  bandH: number
  edge?: 'straight' | 'diagonal'
  avatar?: 'circleOverlap' | 'inBandCircle' | 'inBandRect' | 'centerOverlap' | 'none'
  avatarSideX?: 'left' | 'right'
  center?: boolean
  twoTone?: boolean
  deco?: 'blocks' | 'tri' | 'none'
  darkerStrip?: boolean
  style: TitleStyle
  footer?: 'band' | 'bar' | 'none'
}

function buildHeaderBand(cfg: BandCfg): DrawFn {
  return (ctx, data) => {
    const color = cfg.color
    const bandH = cfg.bandH
    ctx.setFillStyle(color); ctx.fillRect(0, 0, 794, bandH)
    if (cfg.twoTone) { ctx.setFillStyle(shade(color, 0.24)); ctx.fillRect(0, 0, 310, bandH) }
    if (cfg.edge === 'diagonal') {
      ctx.setFillStyle('#ffffff'); ctx.beginPath()
      ctx.moveTo(0, bandH); ctx.lineTo(794, bandH - 46); ctx.lineTo(794, bandH); ctx.closePath(); ctx.fill()
    }
    if (cfg.darkerStrip) { ctx.setFillStyle(shade(color, 0.2)); ctx.fillRect(0, bandH - 6, 794, 6) }
    if (cfg.deco === 'blocks') {
      ctx.setFillStyle(tint(color, 0.35)); ctx.fillRect(636, 26, 110, 26); ctx.fillRect(668, 62, 78, 26)
    }
    if (cfg.deco === 'tri') {
      ctx.setFillStyle(tint(color, 0.6)); ctx.beginPath()
      ctx.moveTo(794, 0); ctx.lineTo(794, 120); ctx.lineTo(656, 0); ctx.closePath(); ctx.fill()
    }

    const contact = contactOf(data)
    ctx.setTextAlign('left')
    let bodyY: number
    if (cfg.center) {
      // 居中横幅：头像压住色带下沿，文字居中
      const overlap = cfg.avatar === 'centerOverlap' && data.avatar
      ctx.setTextAlign('center')
      let ty = bandH - (overlap ? 92 : 82)
      if (data.name) { ctx.setFillStyle('#ffffff'); ctx.setFontSize(24); ctx.fillText(data.name, 397, ty); ty += 28 }
      if (data.intention) { ctx.setFillStyle(tint(color, 0.78)); ctx.setFontSize(13); ctx.fillText(data.intention, 397, ty); ty += 24 }
      if (contact) { ctx.setFillStyle(tint(color, 0.6)); ctx.setFontSize(11); ctx.fillText(contact, 397, ty) }
      if (overlap) circleAvatar(ctx, data.avatar, 397, bandH + 2, 44)
      bodyY = bandH + (overlap ? 96 : 48)
    }
    else {
      let textX = 60
      if (cfg.avatar === 'inBandCircle' && data.avatar) {
        circleAvatar(ctx, data.avatar, 96, bandH / 2, 36); textX = 152
      }
      else if (cfg.avatar === 'inBandRect' && data.avatar) {
        rectAvatar(ctx, data.avatar, 60, bandH / 2 - 34, 68, 68); textX = 152
      }
      else if (cfg.avatar === 'circleOverlap' && data.avatar) {
        const cx = cfg.avatarSideX === 'right' ? 700 : 96
        circleAvatar(ctx, data.avatar, cx, bandH, 44)
        textX = cfg.avatarSideX === 'right' ? 60 : 168
      }
      let ty = bandH - 84
      if (data.name) { ctx.setFillStyle('#ffffff'); ctx.setFontSize(24); ctx.fillText(data.name, textX, ty); ty += 30 }
      if (data.intention) { ctx.setFillStyle(tint(color, 0.78)); ctx.setFontSize(13); ctx.fillText(data.intention, textX, ty); ty += 24 }
      if (contact) { ctx.setFillStyle(tint(color, 0.6)); ctx.setFontSize(11); ctx.fillText(contact, textX, ty) }
      const avatarOverhang = cfg.avatar === 'circleOverlap' && data.avatar ? 50 : 0
      bodyY = bandH + (cfg.edge === 'diagonal' ? 66 : 52) + (avatarOverhang ? avatarOverhang - 50 + 50 : 0)
      if (avatarOverhang) bodyY = bandH + 64
    }

    renderSections(ctx, data, 60, bodyY, 674, color, cfg.style)

    if (cfg.footer === 'band') {
      ctx.setFillStyle(color); ctx.fillRect(0, 1075, 794, 48)
      ctx.setTextAlign('center'); ctx.setFillStyle('#ffffff'); ctx.setFontSize(13)
      ctx.fillText(data.name || '', 397, 1097)
      if (data.intention) { ctx.setFillStyle(tint(color, 0.7)); ctx.setFontSize(11); ctx.fillText(data.intention, 397, 1114) }
    }
    if (cfg.footer === 'bar') { ctx.setFillStyle(color); ctx.fillRect(0, 1109, 794, 14) }
  }
}

// ---------------- 布局族三：浅色双栏 ----------------

interface TwoColCfg { color: string; side: 'left' | 'right'; sideDark?: boolean; topBand?: number; numbered?: boolean; sideW?: number }

function buildTwoColumn(cfg: TwoColCfg): DrawFn {
  return (ctx, data) => {
    const color = cfg.color
    const sideW = cfg.sideW ?? 250
    const sideX = cfg.side === 'left' ? 0 : 794 - sideW
    const mainX = cfg.side === 'left' ? sideW + 46 : 50
    const mainW = 794 - sideW - 96
    const cx = sideX + sideW / 2

    ctx.setFillStyle(cfg.sideDark ? color : tint(color, 0.9)); ctx.fillRect(sideX, 0, sideW, 1123)

    const nameInBand = !!cfg.topBand
    if (cfg.topBand) {
      ctx.setFillStyle(color); ctx.fillRect(0, 0, 794, cfg.topBand)
      ctx.setTextAlign('left'); ctx.setFillStyle('#ffffff'); ctx.setFontSize(24)
      ctx.fillText(data.name || '', mainX, cfg.topBand / 2 + 2)
      if (data.intention) { ctx.setFillStyle(tint(color, 0.75)); ctx.setFontSize(13); ctx.fillText(data.intention, mainX, cfg.topBand / 2 + 30) }
    }

    // 侧栏：头像 / 姓名 / 联系方式 / 技能
    ctx.setTextAlign('center')
    let sy = 60
    if (data.avatar) { circleAvatar(ctx, data.avatar, cx, sy + 44, 44); sy += 112 }
    if (data.name && !nameInBand) {
      ctx.setFillStyle(cfg.sideDark ? '#ffffff' : '#172033'); ctx.setFontSize(20)
      ctx.fillText(data.name, cx, sy); sy += 30
    }
    if (data.intention && !nameInBand) {
      ctx.setFillStyle(cfg.sideDark ? tint(color, 0.7) : color); ctx.setFontSize(12)
      ctx.fillText(data.intention, cx, sy); sy += 26
    }
    const sideBlock = (title: string, rows: string[]) => {
      if (!rows.length) return
      sy += 22
      ctx.setFillStyle(cfg.sideDark ? tint(color, 0.7) : color); ctx.setFontSize(13); ctx.fillText(title, cx, sy)
      sy += 14
      ctx.setFillStyle(cfg.sideDark ? tint(color, 0.5) : tint(color, 0.6)); ctx.fillRect(sideX + 30, sy, sideW - 60, 1); sy += 20
      ctx.setFillStyle(cfg.sideDark ? '#dbe4f0' : '#57534e'); ctx.setFontSize(11)
      rows.forEach((row) => { wrap(ctx, row, sideW - 60).forEach((line) => { ctx.fillText(line, cx, sy); sy += ls(19) }); sy += ls(6) })
    }
    sideBlock('联系方式', [data.phone, data.email, data.gender].filter(Boolean))
    sideBlock('技能特长', data.skills ? wrap(ctx, data.skills, sideW - 60).slice(0, 18) : [])

    // 主栏：简介 / 教育 / 工作 / 项目
    ctx.setTextAlign('left')
    let my = (cfg.topBand ?? 0) + 64
    sectionsOf(data).filter(s => s.title !== '技能特长').forEach((s, i) => {
      my += 6
      my += sectionTitle(ctx, cfg.numbered ? 'num' : 'bar', s.title, mainX, my, color, i)
      my = paragraph(ctx, s.rows, mainX, my, mainW)
    })
  }
}

// ---------------- 布局族四：时间轴变体 ----------------

interface Group { head: string; time: string; detail: string }
interface TimelineGroups { title: string; items: Group[] }

function timelineGroupsOf(d: ResumeData): TimelineGroups[] {
  const groups: TimelineGroups[] = []
  if (d.summary) groups.push({ title: '个人简介', items: [{ head: '', time: '', detail: d.summary }] })
  const edu = d.education.map(i => ({ head: [i.school, i.major].filter(Boolean).join(' · '), time: i.time || '', detail: '' })).filter(g => g.head || g.time)
  if (edu.length) groups.push({ title: '教育经历', items: edu })
  const work = d.work.map(i => ({ head: [i.company, i.role].filter(Boolean).join(' · '), time: i.time || '', detail: i.detail || '' })).filter(g => g.head || g.detail || g.time)
  if (work.length) groups.push({ title: '工作经历', items: work })
  const proj = d.projects.map(i => ({ head: [i.name, i.role].filter(Boolean).join(' · '), time: i.time || '', detail: i.detail || '' })).filter(g => g.head || g.detail || g.time)
  if (proj.length) groups.push({ title: '项目经历', items: proj })
  if (d.skills) groups.push({ title: '技能特长', items: [{ head: '', time: '', detail: d.skills }] })
  return groups
}

interface TimeCfg { color: string; side: 'left' | 'right'; headerBand?: boolean; bigDots?: boolean }

function buildTimeline(cfg: TimeCfg): DrawFn {
  return (ctx, data) => {
    const color = cfg.color
    const lineX = cfg.side === 'left' ? 96 : 700
    const mainX = cfg.side === 'left' ? 138 : 60
    const mainW = cfg.side === 'left' ? 754 - mainX : lineX - 36 - mainX
    let bodyY: number

    ctx.setTextAlign('left')
    if (cfg.headerBand) {
      ctx.setFillStyle(color); ctx.fillRect(0, 0, 794, 130)
      if (data.name) { ctx.setFillStyle('#ffffff'); ctx.setFontSize(24); ctx.fillText(data.name, 60, 62) }
      if (data.intention) { ctx.setFillStyle(tint(color, 0.78)); ctx.setFontSize(13); ctx.fillText(data.intention, 60, 90) }
      const contact = contactOf(data)
      if (contact) { ctx.setFillStyle(tint(color, 0.6)); ctx.setFontSize(11); ctx.fillText(contact, 60, 112) }
      if (data.avatar) circleAvatar(ctx, data.avatar, 700, 65, 34)
      bodyY = 176
    }
    else {
      let y = 88
      let hx = 60
      if (data.avatar) { circleAvatar(ctx, data.avatar, 700, 92, 44); hx = 60 }
      if (data.name) { ctx.setFillStyle('#172033'); ctx.setFontSize(24); ctx.fillText(data.name, hx, y); y += 32 }
      if (data.intention) { ctx.setFillStyle(color); ctx.setFontSize(13); ctx.fillText(data.intention, hx, y); y += 24 }
      const contact = contactOf(data)
      if (contact) { ctx.setFillStyle('#64748b'); ctx.setFontSize(11); ctx.fillText(contact, hx, y); y += 18 }
      ctx.setStrokeStyle('#e2e8f0'); ctx.beginPath(); ctx.moveTo(60, y + 8); ctx.lineTo(734, y + 8); ctx.stroke()
      bodyY = y + 32
    }

    const dots: number[] = []
    let y = bodyY
    timelineGroupsOf(data).forEach((g, gi) => {
      if (gi > 0) y += 8
      ctx.setTextAlign('left'); ctx.setFillStyle(color); ctx.setFontSize(15)
      ctx.fillText(g.title, mainX, y)
      y += 30
      g.items.forEach((item) => {
        dots.push(y - 5)
        if (item.head) {
          ctx.setFillStyle('#172033'); ctx.setFontSize(13); ctx.fillText(item.head, mainX, y)
          if (item.time) {
            ctx.setTextAlign('right'); ctx.setFillStyle('#94a3b8'); ctx.setFontSize(11)
            ctx.fillText(item.time, mainX + mainW, y)
            ctx.setTextAlign('left')
          }
          y += ls(20)
        }
        if (item.detail) {
          ctx.setFillStyle('#475569'); ctx.setFontSize(12)
          wrap(ctx, item.detail, mainW).forEach((line) => { ctx.fillText(line, mainX, y); y += ls(19) })
          y += ls(6)
        }
        y += ls(12)
      })
    })
    if (dots.length) {
      ctx.setFillStyle(cfg.bigDots ? tint(color, 0.55) : color)
      ctx.fillRect(lineX - 1, dots[0], 2, Math.max(2, dots[dots.length - 1] - dots[0]))
      dots.forEach((cy) => {
        ctx.setFillStyle(color); ctx.beginPath(); ctx.arc(lineX, cy, cfg.bigDots ? 8 : 6, 0, Math.PI * 2); ctx.fill()
        if (cfg.bigDots) { ctx.setFillStyle('#ffffff'); ctx.beginPath(); ctx.arc(lineX, cy, 3.5, 0, Math.PI * 2); ctx.fill() }
      })
    }
  }
}

// ---------------- 布局族五：卡片 / 边框 / 标签 ----------------

/** 整页双线边框 + 衬线感正式排版 */
function drawFrameBlue(ctx: Ctx, data: ResumeData) {
  const color = '#1d4ed8'
  ctx.setTextAlign('left')
  ctx.setStrokeStyle(color); ctx.strokeRect(26, 26, 742, 1071)
  ctx.setStrokeStyle(tint(color, 0.55)); ctx.strokeRect(33, 33, 728, 1057)
  let y = 104
  let hx = 70
  if (data.avatar) { circleAvatar(ctx, data.avatar, 680, 104, 42); hx = 70 }
  if (data.name) { ctx.setFillStyle('#172033'); ctx.setFontSize(24); ctx.fillText(data.name, hx, y); y += 32 }
  if (data.intention) { ctx.setFillStyle(color); ctx.setFontSize(13); ctx.fillText(data.intention, hx, y); y += 24 }
  const contact = contactOf(data)
  if (contact) { ctx.setFillStyle('#64748b'); ctx.setFontSize(11); ctx.fillText(contact, hx, y); y += 18 }
  ctx.setStrokeStyle(color); ctx.beginPath(); ctx.moveTo(70, y + 8); ctx.lineTo(724, y + 8); ctx.stroke()
  renderSections(ctx, data, 70, y + 30, 654, color, 'underline')
}

/** 双列网格卡片：左列简介/教育/技能，右列工作/项目 */
function drawGridTeal(ctx: Ctx, data: ResumeData) {
  const color = '#0f766e'
  const colW = 330; const leftX = 50; const rightX = 414
  ctx.setTextAlign('left')
  const card = (x: number, yy: number, title: string, rows: string[]) => {
    if (!rows.length) return yy
    const lines: string[] = []
    rows.forEach(row => wrap(ctx, row, colW - 40).forEach(l => lines.push(l)))
    const h = 44 + lines.length * ls(18) + 16
    ctx.setFillStyle(tint(color, 0.93)); roundRect(ctx, x, yy, colW, h, 10); ctx.fill()
    ctx.setFillStyle(color); ctx.setFontSize(14); ctx.fillText(title, x + 20, yy + 30)
    ctx.setFillStyle('#475569'); ctx.setFontSize(11)
    let cy = yy + 56
    lines.forEach((line) => { ctx.fillText(line, x + 20, cy); cy += ls(18) })
    return yy + h + 18
  }
  let ly = 170; let ry = 170
  // 头部
  let hx = 50
  if (data.avatar) { circleAvatar(ctx, data.avatar, 690, 100, 44); hx = 50 }
  if (data.name) { ctx.setFillStyle('#134e4a'); ctx.setFontSize(24); ctx.fillText(data.name, hx, 82) }
  if (data.intention) { ctx.setFillStyle(color); ctx.setFontSize(13); ctx.fillText(data.intention, hx, 110) }
  const contact = contactOf(data)
  if (contact) { ctx.setFillStyle('#64748b'); ctx.setFontSize(11); ctx.fillText(contact, hx, 134) }
  const secs = sectionsOf(data)
  const byTitle = (t: string) => secs.find(s => s.title === t)?.rows ?? []
  ly = card(leftX, ly, '个人简介', byTitle('个人简介'))
  ly = card(leftX, ly, '教育经历', byTitle('教育经历'))
  card(leftX, ly, '技能特长', byTitle('技能特长'))
  ry = card(rightX, ry, '工作经历', byTitle('工作经历'))
  card(rightX, ry, '项目经历', byTitle('项目经历'))
}

/** 技能标签化：技能按分隔符拆成圆角小标签 */
function drawChipRed(ctx: Ctx, data: ResumeData) {
  const color = '#dc2626'
  const left = 56; const w = 682
  ctx.setTextAlign('left')
  ctx.setFillStyle(color); ctx.fillRect(left, 56, 14, 62)
  let y = 84
  if (data.name) { ctx.setFillStyle('#172033'); ctx.setFontSize(24); ctx.fillText(data.name, left + 30, y); y += 30 }
  const contact = [data.intention, data.phone, data.email, data.gender].filter(Boolean).join('  ·  ')
  if (contact) { ctx.setFillStyle('#64748b'); ctx.setFontSize(11); ctx.fillText(contact, left + 30, y); y += 18 }
  y += 12

  sectionsOf(data).forEach((s, i) => {
    y += 8
    if (s.title === '技能特长' && data.skills) {
      y += sectionTitle(ctx, 'bar', s.title, left, y, color, i)
      const chips = data.skills.split(/[、，,;；\n]+/).map(t => t.trim()).filter(Boolean).slice(0, 28)
      ctx.setFontSize(11)
      let cx = left; let cy = y + 4
      chips.forEach((chip) => {
        const cw = ctx.measureText(chip).width + 20
        if (cx + cw > left + w) { cx = left; cy += ls(30) }
        ctx.setFillStyle(tint(color, 0.88)); roundRect(ctx, cx, cy - 13, cw, 22, 4); ctx.fill()
        ctx.setFillStyle(color); ctx.fillText(chip, cx + 10, cy + 2)
        cx += cw + 8
      })
      y = cy + 30
    }
    else {
      y += sectionTitle(ctx, 'bar', s.title, left, y, color, i)
      y = paragraph(ctx, s.rows, left, y, w)
    }
  })
}

/** 柔和圆角分区卡 + 左侧色条缺口 */
function drawSoftIndigo(ctx: Ctx, data: ResumeData) {
  const color = '#4f46e5'
  const padX = 48; const cardW = 794 - padX * 2
  ctx.setTextAlign('left')
  let y = 58
  let hx = padX
  if (data.avatar) { circleAvatar(ctx, data.avatar, padX + 34, y + 26, 34); hx = padX + 88 }
  if (data.name) { ctx.setFillStyle('#1e1b4b'); ctx.setFontSize(23); ctx.fillText(data.name, hx, y + 20); }
  const contact = [data.intention, data.phone, data.email, data.gender].filter(Boolean).join('  ·  ')
  if (contact) { ctx.setFillStyle('#64748b'); ctx.setFontSize(11); ctx.fillText(contact, hx, y + 46) }
  y += 88

  sectionsOf(data).forEach((s, i) => {
    const lines: string[] = []
    s.rows.forEach(row => wrap(ctx, row, cardW - 56).forEach(l => lines.push(l)))
    const h = 40 + lines.length * ls(19) + 18
    ctx.setFillStyle(tint(color, 0.94)); roundRect(ctx, padX, y, cardW, h, 9); ctx.fill()
    ctx.setFillStyle(color); ctx.fillRect(padX + 4, y + 8, 4, h - 16)
    ctx.setFillStyle(color); ctx.setFontSize(14); ctx.fillText(s.title, padX + 24, y + 28)
    ctx.setFillStyle('#4b5563'); ctx.setFontSize(11)
    let cy = y + 52
    lines.forEach((line) => { ctx.fillText(line, padX + 24, cy); cy += ls(19) })
    y += h + 16
  })
}

/** 羊皮纸底 + 居中头部 + 双细线标题 */
function drawPaperAmber(ctx: Ctx, data: ResumeData) {
  const color = '#b45309'
  ctx.setFillStyle('#fffcf5'); ctx.fillRect(0, 0, 794, 1123)
  ctx.setTextAlign('center')
  let y = 92
  if (data.name) { ctx.setFillStyle('#7c2d12'); ctx.setFontSize(27); ctx.fillText(data.name, 397, y); y += 36 }
  if (data.intention) { ctx.setFillStyle(color); ctx.setFontSize(14); ctx.fillText(data.intention, 397, y); y += 24 }
  const contact = contactOf(data)
  if (contact) { ctx.setFillStyle('#a16207'); ctx.setFontSize(11); ctx.fillText(contact, 397, y); y += 18 }
  ctx.setFillStyle(color); ctx.fillRect(297, y + 8, 200, 2); ctx.fillRect(297, y + 13, 200, 1)
  y += 40
  if (data.avatar) circleAvatar(ctx, data.avatar, 690, 96, 42)

  ctx.setTextAlign('left')
  sectionsOf(data).forEach((s, i) => {
    y += 8
    ctx.setFillStyle('#7c2d12'); ctx.setFontSize(15); ctx.fillText(s.title, 70, y)
    const tw = ctx.measureText(s.title).width
    ctx.setFillStyle(color); ctx.fillRect(70, y + 7, tw + 6, 2); ctx.fillRect(70, y + 11, tw + 6, 1)
    y = paragraph(ctx, s.rows, 70, y + 30, 654, { color: '#57534e' })
  })
  ctx.setFillStyle(color); ctx.fillRect(160, 1042, 474, 1)
}

/** 黑白极简：粗顶线 + 疏排标题 + 重分隔线 */
function drawMonoGraphite(ctx: Ctx, data: ResumeData) {
  const ink = '#111827'
  ctx.setFillStyle(ink); ctx.fillRect(50, 44, 694, 4)
  ctx.setTextAlign('left')
  if (data.name) { ctx.setFillStyle(ink); ctx.setFontSize(30); ctx.fillText(data.name, 50, 100) }
  ctx.setTextAlign('right')
  const contact = contactOf(data)
  if (contact) { ctx.setFillStyle('#6b7280'); ctx.setFontSize(11); ctx.fillText(contact, 744, 100) }
  ctx.setTextAlign('left')
  if (data.intention) { ctx.setFillStyle('#6b7280'); ctx.setFontSize(13); ctx.fillText(data.intention, 50, 126) }
  if (data.avatar) circleAvatar(ctx, data.avatar, 690, 170, 40)
  let y = 170

  sectionsOf(data).forEach((s) => {
    y += 20
    ctx.setFillStyle(ink); ctx.setFontSize(14)
    ctx.fillText(s.title.split('').join(' '), 50, y)
    ctx.fillRect(50, y + 10, 64, 2)
    y += 34
    y = paragraph(ctx, s.rows, 50, y, 694, { color: '#374151' })
    ctx.setFillStyle('#d1d5db'); ctx.fillRect(50, y - 2, 694, 1)
  })
}

// ---------------- 布局族六：特色居中 / 个性版式 ----------------

/** 聚光头像：顶部居中大圆头像 + 环形描边 */
function drawSpotlight(ctx: Ctx, data: ResumeData) {
  const color = '#0f766e'
  let y = 200
  if (data.avatar) {
    ctx.setStrokeStyle(tint(color, 0.55)); ctx.beginPath(); ctx.arc(397, 112, 60, 0, Math.PI * 2); ctx.stroke()
    circleAvatar(ctx, data.avatar, 397, 112, 52)
  }
  else y = 130
  ctx.setTextAlign('center')
  if (data.name) { ctx.setFillStyle('#134e4a'); ctx.setFontSize(26); ctx.fillText(data.name, 397, y); y += 34 }
  if (data.intention) { ctx.setFillStyle(color); ctx.setFontSize(14); ctx.fillText(data.intention, 397, y); y += 24 }
  const contact = contactOf(data)
  if (contact) { ctx.setFillStyle('#64748b'); ctx.setFontSize(11); ctx.fillText(contact, 397, y); y += 18 }
  ctx.setFillStyle(color); ctx.fillRect(357, y + 6, 80, 3)
  renderSections(ctx, data, 90, y + 34, 614, color, 'dot')
}

/** 字母水印：右下角超大姓氏首字衬底 */
function drawWatermark(ctx: Ctx, data: ResumeData) {
  const color = '#1e3a8a'
  const letter = (data.name || '历').slice(0, 1)
  ctx.setTextAlign('right')
  ctx.setFillStyle(tint(color, 0.9)); ctx.setFontSize(300)
  ctx.fillText(letter, 760, 1060)
  ctx.setTextAlign('left')
  let y = 96
  let hx = 64
  if (data.avatar) { circleAvatar(ctx, data.avatar, 700, 100, 42); hx = 64 }
  if (data.name) { ctx.setFillStyle('#172554'); ctx.setFontSize(26); ctx.fillText(data.name, hx, y); y += 34 }
  ctx.setFillStyle(color); ctx.fillRect(64, y - 8, 88, 4); y += 26
  if (data.intention) { ctx.setFillStyle(color); ctx.setFontSize(13); ctx.fillText(data.intention, hx, y); y += 24 }
  const contact = contactOf(data)
  if (contact) { ctx.setFillStyle('#64748b'); ctx.setFontSize(11); ctx.fillText(contact, hx, y); y += 18 }
  renderSections(ctx, data, 64, y + 14, 666, color, 'bar')
}

/** 尾部色带：联系方式下沉到页脚色带 */
function drawFooterBand(ctx: Ctx, data: ResumeData) {
  const color = '#7c2d12'
  ctx.setTextAlign('left')
  let y = 92
  if (data.name) { ctx.setFillStyle(color); ctx.setFontSize(26); ctx.fillText(data.name, 60, y); y += 34 }
  if (data.intention) { ctx.setFillStyle('#a8a29e'); ctx.setFontSize(14); ctx.fillText(data.intention, 60, y); y += 24 }
  ctx.setFillStyle(color); ctx.fillRect(60, y + 2, 64, 4); y += 26
  if (data.avatar) circleAvatar(ctx, data.avatar, 700, 100, 42)
  renderSections(ctx, data, 60, y + 12, 674, color, 'chip')
  ctx.setFillStyle(color); ctx.fillRect(0, 1053, 794, 70)
  ctx.setTextAlign('center'); ctx.setFillStyle('#ffffff'); ctx.setFontSize(12)
  const contact = contactOf(data)
  ctx.fillText(contact || data.name || '', 397, 1086)
  if (contact && data.intention) { ctx.setFillStyle(tint(color, 0.65)); ctx.fillText(data.intention, 397, 1108) }
}

/** 条纹现代：顶部递减条纹装饰 */
function drawStripes(ctx: Ctx, data: ResumeData) {
  const color = '#6366f1'
  const widths = [794, 650, 506, 362]
  widths.forEach((w, i) => {
    ctx.setFillStyle(tint(color, i * 0.22)); ctx.fillRect(0, 28 + i * 18, w, 10)
  })
  ctx.setTextAlign('left')
  let y = 158
  let hx = 60
  if (data.avatar) { circleAvatar(ctx, data.avatar, 690, 168, 42); hx = 60 }
  if (data.name) { ctx.setFillStyle('#1e1b4b'); ctx.setFontSize(25); ctx.fillText(data.name, hx, y); y += 32 }
  if (data.intention) { ctx.setFillStyle(color); ctx.setFontSize(13); ctx.fillText(data.intention, hx, y); y += 24 }
  const contact = contactOf(data)
  if (contact) { ctx.setFillStyle('#64748b'); ctx.setFontSize(11); ctx.fillText(contact, hx, y); y += 18 }
  renderSections(ctx, data, 60, y + 14, 674, color, 'bar')
}

/** 暖阳圆角：大圆角色块头部 */
function drawRoundedWarm(ctx: Ctx, data: ResumeData) {
  const color = '#f59e0b'
  ctx.setFillStyle(color); roundRect(ctx, 34, 34, 726, 132, 18); ctx.fill()
  ctx.setTextAlign('left')
  let textX = 168
  if (data.avatar) circleAvatar(ctx, data.avatar, 102, 100, 40)
  else textX = 74
  let ty = 84
  if (data.name) { ctx.setFillStyle('#ffffff'); ctx.setFontSize(24); ctx.fillText(data.name, textX, ty); ty += 30 }
  if (data.intention) { ctx.setFillStyle(tint(color, 0.32)); ctx.setFontSize(13); ctx.fillText(data.intention, textX, ty); ty += 24 }
  const contact = contactOf(data)
  if (contact) { ctx.setFillStyle(tint(color, 0.18)); ctx.setFontSize(11); ctx.fillText(contact, textX, ty) }
  renderSections(ctx, data, 60, 216, 674, color, 'softChip')
}

/** 高管深灰：黑色页眉 + 金色分隔线 */
function drawExecutive(ctx: Ctx, data: ResumeData) {
  const ink = '#1f2937'
  const gold = '#c9a227'
  ctx.setFillStyle(ink); ctx.fillRect(0, 0, 794, 84)
  ctx.setFillStyle(gold); ctx.fillRect(0, 84, 794, 3)
  ctx.setTextAlign('left')
  if (data.name) { ctx.setFillStyle('#ffffff'); ctx.setFontSize(22); ctx.fillText(data.name, 50, 46) }
  if (data.intention) { ctx.setFillStyle('#9ca3af'); ctx.setFontSize(12); ctx.fillText(data.intention, 50, 70) }
  if (data.avatar) circleAvatar(ctx, data.avatar, 706, 43, 29)
  let y = 142
  sectionsOf(data).forEach((s, i) => {
    y += 8
    y += sectionTitle(ctx, 'num', s.title, 54, y, gold, i)
    y = paragraph(ctx, s.rows, 54, y, 686, { color: '#4b5563' })
    ctx.setFillStyle('#e5e7eb'); ctx.fillRect(54, y - 4, 686, 1)
  })
}

/** 青柠方块：姓氏首字色块 + 左对齐头部 */
function drawFreshLime(ctx: Ctx, data: ResumeData) {
  const color = '#65a30d'
  ctx.setTextAlign('left')
  let y = 96
  let textX = 124
  if (data.name) {
    ctx.setFillStyle(color); ctx.fillRect(50, 52, 58, 58)
    ctx.setFillStyle('#ffffff'); ctx.setFontSize(28)
    const first = data.name.slice(0, 1)
    const fw = ctx.measureText(first).width
    ctx.fillText(first, 50 + (58 - fw) / 2, 94)
    ctx.setFillStyle('#172033'); ctx.setFontSize(24); ctx.fillText(data.name.slice(1) || data.name, textX, 78)
    if (data.intention) { ctx.setFillStyle(color); ctx.setFontSize(13); ctx.fillText(data.intention, textX, 104) }
    y = 128
  }
  const contact = contactOf(data)
  if (contact) { ctx.setFillStyle('#64748b'); ctx.setFontSize(11); ctx.fillText(contact, textX, y); y += 16 }
  if (data.avatar) circleAvatar(ctx, data.avatar, 690, 96, 42)
  y += 10
  ctx.setStrokeStyle('#d9f99d'); ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(744, y); ctx.stroke()
  renderSections(ctx, data, 50, y + 16, 694, color, 'dot')
}

/** 双色叠加：深色主横幅 + 浅色错位叠块 */
function drawDuoHeader(ctx: Ctx, data: ResumeData) {
  const color = '#312e81'
  ctx.setFillStyle(color); ctx.fillRect(0, 0, 794, 150)
  ctx.setFillStyle(tint(color, 0.72)); ctx.fillRect(484, 24, 310, 102)
  ctx.setFillStyle(tint(color, 0.45)); ctx.fillRect(744, 8, 50, 50)
  ctx.setTextAlign('left')
  let ty = 70
  if (data.name) { ctx.setFillStyle('#ffffff'); ctx.setFontSize(24); ctx.fillText(data.name, 60, ty); ty += 30 }
  if (data.intention) { ctx.setFillStyle(tint(color, 0.78)); ctx.setFontSize(13); ctx.fillText(data.intention, 60, ty); ty += 24 }
  const contact = contactOf(data)
  if (contact) { ctx.setFillStyle(tint(color, 0.58)); ctx.setFontSize(11); ctx.fillText(contact, 60, ty) }
  if (data.avatar) circleAvatar(ctx, data.avatar, 700, 150, 44)
  renderSections(ctx, data, 60, 212, 674, color, 'underline')
}

// ---------------- 模板注册表 ----------------

export interface TemplateMeta { id: string; name: string; description: string; cover: string }

export const extraTemplates: TemplateMeta[] = [
  // 左侧色条系
  { id: 'azure-bar', name: '蔚蓝侧条', description: '左侧细色条配右置头像，蓝白商务风，适合求职互联网与技术岗。', cover: '/static/resume/template-azure-bar.svg' },
  { id: 'crimson-bar', name: '绯红侧条', description: '左侧绯红色条加胶囊分区标题，热情醒目，适合销售与市场岗位。', cover: '/static/resume/template-crimson-bar.svg' },
  { id: 'violet-bar', name: '紫韵侧栏', description: '左色条加圆点标题，紫色调个性稳重，适合设计与创意岗位。', cover: '/static/resume/template-violet-bar.svg' },
  { id: 'teal-num', name: '青屿编号', description: '编号式分区标题（01/02…），湖青配色，条理清晰适合应届生。', cover: '/static/resume/template-teal-num.svg' },
  { id: 'amber-bar', name: '琥珀经典', description: '琥珀色标题下划线，经典排版，适合财务与行政类岗位。', cover: '/static/resume/template-amber-bar.svg' },
  { id: 'graphite-bar', name: '石墨侧栏', description: '石墨灰侧条加右置头像，克制专业，适合咨询与法务岗位。', cover: '/static/resume/template-graphite-bar.svg' },
  { id: 'rose-bar', name: '玫瑰侧栏', description: '菱形标题符号配玫瑰色条，柔和不失力量，适合品牌与公关。', cover: '/static/resume/template-rose-bar.svg' },
  { id: 'emerald-bar', name: '翡翠软标', description: '浅翡翠胶囊标题加底部色条收尾，清新自然，适合教育与医疗。', cover: '/static/resume/template-emerald-bar.svg' },
  // 顶部色带系
  { id: 'diagonal-blue', name: '破晓蓝角', description: '斜切角深蓝横幅，几何感强，适合求职管理培训生与金融。', cover: '/static/resume/template-diagonal-blue.svg' },
  { id: 'sunset-orange', name: '落日橙带', description: '橙色横幅加下探圆头像，活力醒目，适合运营与市场岗位。', cover: '/static/resume/template-sunset-orange.svg' },
  { id: 'deep-navy', name: '深海藏青', description: '藏青横幅配几何色块装饰，沉稳大气，适合国企与管理层。', cover: '/static/resume/template-deep-navy.svg' },
  { id: 'mint-band', name: '薄荷清爽', description: '薄荷绿窄横幅加方形头像，干净利落，适合客服与人事实习。', cover: '/static/resume/template-mint-band.svg' },
  { id: 'berry-band', name: '浆果居中', description: '居中横幅加压边大头像，杂志封面式排版，适合主播与新媒体。', cover: '/static/resume/template-berry-band.svg' },
  { id: 'golden-band', name: '沙金双色', description: '双色拼接横幅，层次分明，适合奢侈品零售与商务拓展。', cover: '/static/resume/template-golden-band.svg' },
  { id: 'ocean-band', name: '海洋尾带', description: '头尾双色带呼应，中间留白排版，适合海归与外企求职。', cover: '/static/resume/template-ocean-band.svg' },
  { id: 'plum-band', name: '李子斜切', description: '紫色横幅加三角装饰与右置头像，前卫设计感，适合前端与UI。', cover: '/static/resume/template-plum-band.svg' },
  // 浅色双栏系
  { id: 'ivory-column', name: '米白侧栏', description: '浅米色侧栏承载联系与技能，右栏主叙事，适合通用的求职场景。', cover: '/static/resume/template-ivory-column.svg' },
  { id: 'sky-column', name: '天蓝侧栏', description: '右侧浅蓝信息栏，左栏经历优先，适合技术岗突出项目经历。', cover: '/static/resume/template-sky-column.svg' },
  { id: 'lilac-column', name: '淡紫侧栏', description: '顶部色带加浅紫侧栏，姓名横贯顶部，适合产品经理岗位。', cover: '/static/resume/template-lilac-column.svg' },
  { id: 'sage-column', name: '鼠尾草绿', description: '右栏浅绿侧栏加顶部色带，自然舒适，适合农业文旅与公益。', cover: '/static/resume/template-sage-column.svg' },
  { id: 'coral-column', name: '珊瑚深栏', description: '珊瑚色深色侧栏，对比强烈，适合电商直播与时尚行业。', cover: '/static/resume/template-coral-column.svg' },
  { id: 'steel-column', name: '钢青编号栏', description: '深青侧栏加编号分区，工业风严谨，适合工程师与数据岗。', cover: '/static/resume/template-steel-column.svg' },
  // 时间轴变体系
  { id: 'time-azure', name: '右向时间轴', description: '时间线居右，内容居左，镜像新颖，适合经历连贯的求职者。', cover: '/static/resume/template-time-azure.svg' },
  { id: 'time-violet', name: '圆点时间轴', description: '大圆点时间轴加环形节点，紫色柔和，适合设计师作品型简历。', cover: '/static/resume/template-time-violet.svg' },
  { id: 'time-green', name: '色带时间轴', description: '顶部绿色横幅加左向时间线，商务与脉络兼得，适合管培生。', cover: '/static/resume/template-time-green.svg' },
  { id: 'time-rose', name: '玫红时间轴', description: '玫红横幅配右侧大圆点时间线，个性鲜明，适合传媒与广告。', cover: '/static/resume/template-time-rose.svg' },
  // 卡片 / 边框 / 标签系
  { id: 'frame-blue', name: '蓝框商务', description: '整页双线边框，公文质感，适合事业单位与央企投递。', cover: '/static/resume/template-frame-blue.svg' },
  { id: 'grid-teal', name: '青网格卡', description: '双列网格卡片布局，信息分区明确，适合经历丰富的社招。', cover: '/static/resume/template-grid-teal.svg' },
  { id: 'chip-red', name: '标签红', description: '技能拆分为彩色标签墙，一眼抓住亮点，适合技术栈展示。', cover: '/static/resume/template-chip-red.svg' },
  { id: 'soft-indigo', name: '靛蓝圆角', description: '圆角浅底分区卡加左侧色条缺口，柔和现代，适合社区运营。', cover: '/static/resume/template-soft-indigo.svg' },
  { id: 'paper-amber', name: '羊皮纸', description: '米黄纸感底色配双细线标题，文艺沉稳，适合文职与教师。', cover: '/static/resume/template-paper-amber.svg' },
  { id: 'mono-graphite', name: '黑白极简', description: '纯黑白疏排标题，编辑部风格，适合投递外企与创意总监。', cover: '/static/resume/template-mono-graphite.svg' },
  // 特色居中系
  { id: 'spotlight-avatar', name: '聚光头像', description: '顶部聚光灯式大头像加环形描边，气场十足，适合面试展示。', cover: '/static/resume/template-spotlight-avatar.svg' },
  { id: 'watermark-blue', name: '字母水印', description: '右下角超大姓氏首字水印，藏蓝低调，适合高端岗位投递。', cover: '/static/resume/template-watermark-blue.svg' },
  { id: 'footer-band', name: '尾部色带', description: '联系方式沉入页脚色带，版面干净，适合打印后手写备注。', cover: '/static/resume/template-footer-band.svg' },
  { id: 'stripe-modern', name: '条纹现代', description: '顶部四重渐变条纹，节奏现代，适合交互与增长岗位。', cover: '/static/resume/template-stripe-modern.svg' },
  { id: 'rounded-warm', name: '暖阳圆角', description: '大圆角暖色头部卡，亲和友好，适合幼教与客户成功岗位。', cover: '/static/resume/template-rounded-warm.svg' },
  { id: 'executive-dark', name: '高管深灰', description: '黑色页眉加金色分隔线与编号章节，高管气场，适合述职晋升。', cover: '/static/resume/template-executive-dark.svg' },
  { id: 'fresh-lime', name: '青柠方块', description: '姓氏首字大色块开场，记忆点强，适合校园招聘与社团招新。', cover: '/static/resume/template-fresh-lime.svg' },
  { id: 'duo-header', name: '双色叠加', description: '深浅双色块错位叠加横幅，立体感强，适合品牌与空间设计。', cover: '/static/resume/template-duo-header.svg' },
]

export const extraTemplateColors: Record<string, string> = {
  'azure-bar': '#0284c7',
  'crimson-bar': '#dc2626',
  'violet-bar': '#7c3aed',
  'teal-num': '#0d9488',
  'amber-bar': '#b45309',
  'graphite-bar': '#334155',
  'rose-bar': '#e11d48',
  'emerald-bar': '#059669',
  'diagonal-blue': '#1e40af',
  'sunset-orange': '#ea580c',
  'deep-navy': '#0f2747',
  'mint-band': '#10b981',
  'berry-band': '#be123c',
  'golden-band': '#ca8a04',
  'ocean-band': '#0369a1',
  'plum-band': '#9333ea',
  'ivory-column': '#d97706',
  'sky-column': '#0ea5e9',
  'lilac-column': '#8b5cf6',
  'sage-column': '#16a34a',
  'coral-column': '#f97316',
  'steel-column': '#475569',
  'time-azure': '#2563eb',
  'time-violet': '#6d28d9',
  'time-green': '#047857',
  'time-rose': '#e11d48',
  'frame-blue': '#1d4ed8',
  'grid-teal': '#0f766e',
  'chip-red': '#dc2626',
  'soft-indigo': '#4f46e5',
  'paper-amber': '#b45309',
  'mono-graphite': '#111827',
  'spotlight-avatar': '#0f766e',
  'watermark-blue': '#1e3a8a',
  'footer-band': '#7c2d12',
  'stripe-modern': '#6366f1',
  'rounded-warm': '#f59e0b',
  'executive-dark': '#1f2937',
  'fresh-lime': '#65a30d',
  'duo-header': '#312e81',
}

const drawers: Record<string, DrawFn> = {
  // 左侧色条系
  'azure-bar': buildAccentBar({ color: '#0284c7', style: 'bar', avatarSide: 'right' }),
  'crimson-bar': buildAccentBar({ color: '#dc2626', style: 'chip' }),
  'violet-bar': buildAccentBar({ color: '#7c3aed', style: 'dot', avatarSide: 'right' }),
  'teal-num': buildAccentBar({ color: '#0d9488', style: 'num' }),
  'amber-bar': buildAccentBar({ color: '#b45309', style: 'underline' }),
  'graphite-bar': buildAccentBar({ color: '#334155', style: 'bar', avatarSide: 'right' }),
  'rose-bar': buildAccentBar({ color: '#e11d48', style: 'diamond' }),
  'emerald-bar': buildAccentBar({ color: '#059669', style: 'softChip', footer: true }),
  // 顶部色带系
  'diagonal-blue': buildHeaderBand({ color: '#1e40af', bandH: 170, edge: 'diagonal', avatar: 'circleOverlap', style: 'bar' }),
  'sunset-orange': buildHeaderBand({ color: '#ea580c', bandH: 150, avatar: 'circleOverlap', style: 'bar' }),
  'deep-navy': buildHeaderBand({ color: '#0f2747', bandH: 190, deco: 'blocks', avatar: 'inBandCircle', style: 'underline' }),
  'mint-band': buildHeaderBand({ color: '#10b981', bandH: 130, darkerStrip: true, avatar: 'inBandRect', style: 'bar' }),
  'berry-band': buildHeaderBand({ color: '#be123c', bandH: 160, center: true, avatar: 'centerOverlap', style: 'dot' }),
  'golden-band': buildHeaderBand({ color: '#ca8a04', bandH: 150, twoTone: true, avatar: 'inBandRect', style: 'chip' }),
  'ocean-band': buildHeaderBand({ color: '#0369a1', bandH: 150, avatar: 'none', style: 'bar', footer: 'band' }),
  'plum-band': buildHeaderBand({ color: '#9333ea', bandH: 175, deco: 'tri', avatar: 'circleOverlap', avatarSideX: 'right', style: 'diamond' }),
  // 浅色双栏系
  'ivory-column': buildTwoColumn({ color: '#d97706', side: 'left' }),
  'sky-column': buildTwoColumn({ color: '#0ea5e9', side: 'right' }),
  'lilac-column': buildTwoColumn({ color: '#8b5cf6', side: 'left', topBand: 90 }),
  'sage-column': buildTwoColumn({ color: '#16a34a', side: 'right', topBand: 90 }),
  'coral-column': buildTwoColumn({ color: '#f97316', side: 'left', sideDark: true, sideW: 240 }),
  'steel-column': buildTwoColumn({ color: '#475569', side: 'right', sideDark: true, topBand: 84, numbered: true }),
  // 时间轴变体系
  'time-azure': buildTimeline({ color: '#2563eb', side: 'right' }),
  'time-violet': buildTimeline({ color: '#6d28d9', side: 'left', bigDots: true }),
  'time-green': buildTimeline({ color: '#047857', side: 'left', headerBand: true }),
  'time-rose': buildTimeline({ color: '#e11d48', side: 'right', headerBand: true, bigDots: true }),
  // 卡片 / 边框 / 标签系
  'frame-blue': drawFrameBlue,
  'grid-teal': drawGridTeal,
  'chip-red': drawChipRed,
  'soft-indigo': drawSoftIndigo,
  'paper-amber': drawPaperAmber,
  'mono-graphite': drawMonoGraphite,
  // 特色居中系
  'spotlight-avatar': drawSpotlight,
  'watermark-blue': drawWatermark,
  'footer-band': drawFooterBand,
  'stripe-modern': drawStripes,
  'rounded-warm': drawRoundedWarm,
  'executive-dark': drawExecutive,
  'fresh-lime': drawFreshLime,
  'duo-header': drawDuoHeader,
}

export function getExtraDrawer(id: string): DrawFn | undefined {
  return drawers[id]
}
