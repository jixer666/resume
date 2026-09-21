#!/usr/bin/env node
/**
 * 生成第 2 批 40 款扩展简历模板的 SVG 封面缩略图。
 * 用法：node scripts/gen-extra-covers.mjs
 * 输出：src/static/resume/template-<id>.svg
 */
import { writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '../src/static/resume')

const mix = (a, b, w) => {
  const p = h => [0, 2, 4].map(i => parseInt(h.replace('#', '').slice(i, i + 2), 16) || 0)
  const [x, y] = [p(a), p(b)]
  return `#${x.map((c, i) => Math.round(c * w + y[i] * (1 - w)).toString(16).padStart(2, '0')).join('')}`
}
const tint = (hex, amount) => mix(hex, '#ffffff', amount)
const shade = (hex, amount) => mix(hex, '#000000', 1 - (1 - amount))

const GRAY1 = '#94a3b8'
const GRAY2 = '#cbd5e1'
const GRAY3 = '#e2e8f0'

// id → 封面配置（与 resume-layouts.ts 的注册表保持一致）
const covers = [
  ['azure-bar', 'accent', '#0284c7', { avatarRight: true }],
  ['crimson-bar', 'accent', '#dc2626', { chip: true }],
  ['violet-bar', 'accent', '#7c3aed', { avatarRight: true }],
  ['teal-num', 'accent', '#0d9488', {}],
  ['amber-bar', 'accent', '#b45309', {}],
  ['graphite-bar', 'accent', '#334155', { avatarRight: true }],
  ['rose-bar', 'accent', '#e11d48', {}],
  ['emerald-bar', 'accent', '#059669', { chip: true, footer: true }],
  ['diagonal-blue', 'band', '#1e40af', { diag: true, avatar: 'leftOver' }],
  ['sunset-orange', 'band', '#ea580c', { avatar: 'leftOver' }],
  ['deep-navy', 'band', '#0f2747', { blocks: true, avatar: 'inBand' }],
  ['mint-band', 'band', '#10b981', { strip: true, avatar: 'inBand', bandH: 150 }],
  ['berry-band', 'band', '#be123c', { center: true, avatar: 'centerOver' }],
  ['golden-band', 'band', '#ca8a04', { twoTone: true, avatar: 'inBand' }],
  ['ocean-band', 'band', '#0369a1', { footer: true }],
  ['plum-band', 'band', '#9333ea', { tri: true, avatar: 'rightOver', bandH: 200 }],
  ['ivory-column', 'twocol', '#d97706', {}],
  ['sky-column', 'twocol', '#0ea5e9', { right: true }],
  ['lilac-column', 'twocol', '#8b5cf6', { topBand: 100 }],
  ['sage-column', 'twocol', '#16a34a', { right: true, topBand: 100 }],
  ['coral-column', 'twocol', '#f97316', { dark: true }],
  ['steel-column', 'twocol', '#475569', { dark: true, right: true, topBand: 90 }],
  ['time-azure', 'timeline', '#2563eb', { right: true }],
  ['time-violet', 'timeline', '#6d28d9', { big: true }],
  ['time-green', 'timeline', '#047857', { band: true }],
  ['time-rose', 'timeline', '#e11d48', { band: true, right: true, big: true }],
  ['frame-blue', 'frame', '#1d4ed8', {}],
  ['grid-teal', 'grid', '#0f766e', {}],
  ['chip-red', 'chips', '#dc2626', {}],
  ['soft-indigo', 'softcard', '#4f46e5', {}],
  ['paper-amber', 'paper', '#b45309', {}],
  ['mono-graphite', 'mono', '#111827', {}],
  ['spotlight-avatar', 'spotlight', '#0f766e', {}],
  ['watermark-blue', 'watermark', '#1e3a8a', {}],
  ['footer-band', 'footerband', '#7c2d12', {}],
  ['stripe-modern', 'stripes', '#6366f1', {}],
  ['rounded-warm', 'rounded', '#f59e0b', {}],
  ['executive-dark', 'exec', '#1f2937', {}],
  ['fresh-lime', 'lime', '#65a30d', {}],
  ['duo-header', 'duo', '#312e81', {}],
]

const line = (x, y, w, c = GRAY2, h = 10, rx = 5) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${c}"/>`
const circle = (cx, cy, r, c) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/>`

// 通用正文：灰色内容行
const body = (y0 = 250, lines = 12) => {
  let s = ''; let y = y0
  const widths = [500, 460, 480, 420, 500, 380, 470, 440, 490, 400, 460, 430]
  for (let i = 0; i < lines; i++) { s += line(60, y, widths[i % widths.length]); y += 26 }
  return s
}
// 分区标题行（彩色小块 + 灰行）
const section = (x, y, c, w = 120) => line(x, y, w, c, 16, 3) + line(x, y + 26, 380) + line(x, y + 46, 340)

function svgFor([id, family, color, opt]) {
  let inner = '<rect width="600" height="800" fill="#fff"/>'
  switch (family) {
    case 'accent': {
      inner += `<rect width="26" height="800" fill="${color}"/>`
      if (opt.avatarRight) inner += circle(470, 120, 55, tint(color, 0.75))
      inner += line(60, 90, 200, color, 26, 6)
      inner += line(60, 136, 300, GRAY1, 12, 6)
      inner += line(60, 166, 340, GRAY3, 10, 5)
      let y = 230
      for (let i = 0; i < 3; i++) { inner += section(60, y, opt.chip ? tint(color, 0.7) : color); y += 130 }
      inner += section(60, y, opt.chip ? tint(color, 0.7) : color)
      if (opt.footer) inner += `<rect width="600" height="26" y="774" fill="${color}"/>`
      break
    }
    case 'band': {
      const bh = opt.bandH ?? 200
      if (opt.twoTone) inner += `<rect width="220" height="${bh}" fill="${shade(color, 0.25)}"/>`
      inner += `<rect width="600" height="${bh}" fill="${color}"/>`
      if (opt.diag) inner += `<polygon points="0,${bh} 600,${bh - 46} 600,${bh}" fill="#fff"/>`
      if (opt.strip) inner += `<rect width="600" height="10" y="${bh - 10}" fill="${shade(color, 0.25)}"/>`
      if (opt.blocks) { inner += line(450, 30, 110, tint(color, 0.35), 22, 4) + line(470, 66, 90, tint(color, 0.35), 22, 4) }
      if (opt.tri) inner += `<polygon points="600,0 600,120 480,0" fill="${tint(color, 0.6)}"/>`
      if (opt.center) {
        inner += line(210, 60, 180, '#ffffff', 24, 8) + line(240, 100, 120, tint(color, 0.78), 12, 6)
        if (opt.avatar === 'centerOver') inner += circle(300, bh + 4, 46, tint(color, 0.75))
      }
      else {
        if (opt.avatar === 'inBand') inner += circle(80, bh / 2, 36, tint(color, 0.75))
        if (opt.avatar === 'leftOver') inner += circle(90, bh, 42, tint(color, 0.75))
        if (opt.avatar === 'rightOver') inner += circle(510, bh, 42, tint(color, 0.75))
        const tx = opt.avatar === 'inBand' ? 140 : opt.avatar === 'leftOver' ? 160 : 60
        inner += line(tx, 50, 180, '#ffffff', 24, 8)
        inner += line(tx, 92, 130, tint(color, 0.78), 12, 6)
        inner += line(tx, 118, 160, tint(color, 0.6), 10, 5)
      }
      inner += body(bh + 60, 10)
      if (opt.footer) inner += `<rect width="600" height="52" y="748" fill="${color}"/>` + line(230, 766, 140, '#ffffff', 12, 6)
      break
    }
    case 'twocol': {
      const sw = 170
      const sx = opt.right ? 600 - sw : 0
      inner += `<rect x="${sx}" width="${sw}" height="800" fill="${opt.dark ? color : tint(color, 0.85)}"/>`
      if (opt.topBand) inner += `<rect width="600" height="${opt.topBand}" fill="${color}"/>` + line(opt.right ? 40 : sw + 30, 40, 160, '#ffffff', 22, 8)
      const cx = sx + sw / 2
      inner += circle(cx, opt.topBand ? opt.topBand + 90 : 100, 44, opt.dark ? tint(color, 0.7) : tint(color, 0.45))
      let sy = opt.topBand ? opt.topBand + 160 : 180
      inner += line(cx - 60, sy, 120, opt.dark ? '#ffffff' : '#172033', 16, 8); sy += 40
      inner += line(sx + 25, sy, sw - 50, opt.dark ? tint(color, 0.5) : tint(color, 0.55), 3, 1); sy += 24
      for (let i = 0; i < 5; i++) { inner += line(sx + 25, sy, sw - 50, opt.dark ? tint(color, 0.75) : GRAY2, 9, 4); sy += 22 }
      inner += line(sx + 25, sy + 14, sw - 50, opt.dark ? tint(color, 0.5) : tint(color, 0.55), 3, 1)
      const mx = opt.right ? 40 : sw + 30
      const mw = 600 - sw - 70
      const widths = [mw, mw - 40, mw - 20, mw - 60, mw, mw - 50, mw - 30, mw - 55, mw, mw - 45]
      let my = 210
      widths.forEach((w, i) => { inner += line(mx, my, w); my += 26 })
      break
    }
    case 'timeline': {
      if (opt.band) {
        inner += `<rect width="600" height="150" fill="${color}"/>`
        inner += line(50, 50, 180, '#ffffff', 22, 8) + line(50, 92, 140, tint(color, 0.78), 12, 6)
        if (opt.right) inner += circle(510, 75, 34, tint(color, 0.75))
      }
      else {
        inner += line(50, 80, 180, '#172033', 24, 8) + line(50, 122, 300, GRAY3, 10, 5)
        if (opt.right) inner += circle(510, 100, 42, tint(color, 0.75))
      }
      const lx = opt.right ? 520 : 80
      inner += `<rect x="${lx - 2}" y="200" width="4" height="540" fill="${tint(color, 0.55)}"/>`
      let y = 210
      for (let i = 0; i < 4; i++) {
        const dotR = opt.big ? 14 : 10
        inner += circle(lx, y + 8, dotR, color)
        if (opt.big) inner += circle(lx, y + 8, 6, '#ffffff')
        const tx = opt.right ? 60 : 120
        inner += line(tx, y, 200, '#172033', 16, 6)
        inner += line(tx, y + 28, 340, GRAY2) + line(tx, y + 50, 300, GRAY2)
        y += 130
      }
      break
    }
    case 'frame': {
      inner += `<rect x="24" y="24" width="552" height="752" fill="none" stroke="${color}" stroke-width="4"/>`
      inner += `<rect x="34" y="34" width="532" height="732" fill="none" stroke="${tint(color, 0.55)}" stroke-width="2"/>`
      inner += line(50, 90, 180, '#172033', 24, 8) + line(50, 132, 280, GRAY1, 12, 6) + circle(500, 110, 44, tint(color, 0.75))
      inner += `<rect x="50" y="170" width="500" height="3" fill="${color}"/>`
      let y = 220
      for (let i = 0; i < 4; i++) {
        inner += line(50, y, 130, '#172033', 16, 4) + `<rect x="50" y="${y + 24}" width="140" height="4" fill="${color}"/>`
        inner += line(50, y + 44, 480) + line(50, y + 66, 440)
        y += 130
      }
      break
    }
    case 'grid': {
      inner += line(50, 70, 180, '#134e4a', 24, 8) + line(50, 112, 260, GRAY1, 12, 6) + circle(500, 100, 42, tint(color, 0.75))
      const card = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${tint(color, 0.92)}"/>` + line(x + 20, y + 24, 110, color, 14, 4)
      inner += card(50, 180, 240, 200) + line(70, 230, 200) + line(70, 254, 180) + line(70, 278, 210)
      inner += card(310, 180, 240, 340) + line(330, 230, 200) + line(330, 254, 190) + line(330, 278, 210) + line(330, 302, 180) + line(330, 326, 200) + line(330, 350, 170) + line(330, 374, 200) + line(330, 398, 150) + line(330, 422, 190)
      inner += card(50, 400, 240, 300) + line(70, 450, 200) + line(70, 474, 180) + line(70, 498, 210) + line(70, 522, 160) + line(70, 546, 190)
      inner += card(310, 540, 240, 180) + line(330, 590, 200) + line(330, 614, 180) + line(330, 638, 150)
      break
    }
    case 'chips': {
      inner += `<rect x="50" y="60" width="16" height="70" fill="${color}"/>`
      inner += line(84, 72, 190, '#172033', 24, 8) + line(84, 112, 320, GRAY1, 12, 6)
      let y = 190
      const row = (y, chips) => {
        let s = ''; let x = 50
        chips.forEach((w) => { s += `<rect x="${x}" y="${y}" width="${w}" height="34" rx="8" fill="${tint(color, 0.85)}"/>`; x += w + 14 })
        return s
      }
      inner += row(y, [110, 150, 90, 130]); y += 70
      inner += section(50, y, color, 110); y += 90
      inner += row(y, [130, 100, 140]); y += 76
      inner += section(50, y, color, 110); y += 90
      inner += line(50, y, 460) + line(50, y + 22, 420)
      break
    }
    case 'softcard': {
      inner += circle(80, 100, 38, tint(color, 0.75))
      inner += line(136, 78, 170, '#1e1b4b', 22, 8) + line(136, 114, 300, GRAY1, 12, 6)
      const card = (y, h) => `<rect x="50" y="${y}" width="500" height="${h}" rx="14" fill="${tint(color, 0.93)}"/>` + `<rect x="54" y="${y + 10}" width="5" height="${h - 20}" fill="${color}"/>` + line(74, y + 26, 110, color, 14, 4)
      inner += card(170, 150) + line(74, 220, 400) + line(74, 244, 360) + line(74, 268, 390)
      inner += card(340, 180) + line(74, 390, 410) + line(74, 414, 380) + line(74, 438, 400) + line(74, 462, 350)
      inner += card(540, 170) + line(74, 590, 390) + line(74, 614, 420) + line(74, 638, 360)
      break
    }
    case 'paper': {
      inner = '<rect width="600" height="800" fill="#fffcf5"/>'
      inner += circle(500, 100, 42, tint(color, 0.75))
      inner += line(200, 80, 200, '#7c2d12', 26, 8) + line(230, 122, 140, color, 13, 6) + line(210, 150, 180, GRAY1, 11, 5)
      inner += `<rect x="230" y="180" width="140" height="3" fill="${color}"/><rect x="230" y="186" width="140" height="2" fill="${color}"/>`
      let y = 240
      for (let i = 0; i < 4; i++) {
        inner += line(60, y, 130, '#7c2d12', 15, 4) + `<rect x="60" y="${y + 22}" width="140" height="2" fill="${color}"/><rect x="60" y="${y + 27}" width="140" height="1.5" fill="${color}"/>`
        inner += line(60, y + 44, 460, GRAY2) + line(60, y + 66, 420, GRAY2)
        y += 128
      }
      inner += `<rect x="120" y="742" width="360" height="1.5" fill="${color}"/>`
      break
    }
    case 'mono': {
      inner += `<rect x="40" y="46" width="520" height="5" fill="#111827"/>`
      inner += line(40, 84, 220, '#111827', 30, 6) + line(360, 96, 200, GRAY1, 11, 5)
      inner += line(40, 130, 240, GRAY1, 12, 6)
      let y = 200
      const spaced = ['教 育 经 历', '工 作 经 历', '项 目 经 历', '技 能 特 长']
      spaced.forEach((t, i) => {
        inner += `<text x="40" y="${y + 14}" font-size="15" letter-spacing="2" fill="#111827" font-weight="600">${t}</text>`
        inner += `<rect x="40" y="${y + 22}" width="52" height="3" fill="#111827"/>`
        inner += line(40, y + 44, 500, '#374155') + line(40, y + 66, 470, '#374155')
        inner += `<rect x="40" y="${y + 88}" width="520" height="1.5" fill="#d1d5db"/>`
        y += 130
      })
      break
    }
    case 'spotlight': {
      inner += `<circle cx="300" cy="120" r="66" fill="none" stroke="${tint(color, 0.55)}" stroke-width="3"/>`
      inner += circle(300, 120, 54, tint(color, 0.75))
      inner += line(220, 230, 160, '#134e4a', 24, 8) + line(250, 272, 100, color, 13, 6) + line(220, 300, 160, GRAY1, 11, 5)
      inner += `<rect x="270" y="322" width="60" height="4" fill="${color}"/>`
      let y = 380
      for (let i = 0; i < 3; i++) { inner += circle(76, y + 8, 6, color); inner += line(96, y, 110, '#172033', 15, 4) + line(96, y + 26, 380) + line(96, y + 48, 340); y += 120 }
      inner += circle(76, y + 8, 6, color) + line(96, y, 110, '#172033', 15, 4) + line(96, y + 26, 380)
      break
    }
    case 'watermark': {
      inner += `<text x="560" y="760" font-size="330" fill="${tint(color, 0.9)}" text-anchor="end" font-weight="700">R</text>`
      inner += line(50, 90, 200, '#172554', 26, 8)
      inner += `<rect x="50" y="130" width="80" height="5" fill="${color}"/>`
      inner += line(50, 160, 280, GRAY1, 12, 6) + line(50, 188, 320, GRAY3, 10, 5) + circle(500, 110, 44, tint(color, 0.75))
      let y = 260
      for (let i = 0; i < 4; i++) { inner += `<rect x="50" y="${y - 14}" width="5" height="20" fill="${color}"/>` + line(66, y, 110, '#172033', 15, 4) + line(50, y + 30, 440) + line(50, y + 52, 400); y += 120 }
      break
    }
    case 'footerband': {
      inner += line(50, 90, 200, color, 26, 8) + line(50, 136, 260, '#a8a29e', 13, 6)
      inner += `<rect x="50" y="164" width="52" height="5" fill="${color}"/>` + circle(500, 110, 44, tint(color, 0.75))
      inner += body(230, 12)
      inner += `<rect width="600" height="80" y="720" fill="${color}"/>`
      inner += line(220, 748, 160, '#ffffff', 13, 6) + line(250, 772, 100, tint(color, 0.65), 10, 5)
      break
    }
    case 'stripes': {
      const widths = [600, 480, 360, 240]
      widths.forEach((w, i) => { inner += `<rect width="${w}" height="14" y="${28 + i * 24}" rx="7" fill="${tint(color, i * 0.22)}"/>` })
      inner += line(50, 180, 190, '#1e1b4b', 24, 8) + line(50, 224, 280, GRAY1, 12, 6) + circle(500, 200, 44, tint(color, 0.75))
      inner += body(300, 12)
      break
    }
    case 'rounded': {
      inner += `<rect x="30" y="30" width="540" height="140" rx="26" fill="${color}"/>`
      inner += circle(100, 100, 42, tint(color, 0.75))
      inner += line(166, 76, 170, '#ffffff', 24, 8) + line(166, 116, 120, tint(color, 0.32), 12, 6) + line(166, 142, 150, tint(color, 0.18), 10, 5)
      let y = 230
      for (let i = 0; i < 3; i++) {
        inner += `<rect x="50" y="${y - 14}" width="130" height="30" rx="8" fill="${tint(color, 0.86)}"/>` + line(66, y - 2, 90, color, 14, 4)
        inner += line(50, y + 36, 460) + line(50, y + 58, 420); y += 130
      }
      inner += `<rect x="50" y="${y - 14}" width="130" height="30" rx="8" fill="${tint(color, 0.86)}"/>` + line(66, y - 2, 90, color, 14, 4)
      break
    }
    case 'exec': {
      inner += `<rect width="600" height="90" fill="#1f2937"/><rect width="600" height="4" y="90" fill="#c9a227"/>`
      inner += line(40, 34, 180, '#ffffff', 22, 8) + line(40, 66, 120, '#9ca3af', 11, 5) + circle(520, 45, 28, tint(color, 0.6))
      let y = 150
      const nums = ['01', '02', '03', '04']
      nums.forEach((n, i) => {
        inner += `<text x="40" y="${y}" font-size="20" fill="${tint('#c9a227', 0.45)}" font-weight="700">${n}</text>`
        inner += line(76, y - 10, 100, '#172033', 16, 4)
        inner += line(40, y + 22, 500, '#4b5563') + line(40, y + 44, 460, '#4b5563')
        inner += `<rect x="40" y="${y + 64}" width="520" height="1.5" fill="#e5e7eb"/>`
        y += 140
      })
      break
    }
    case 'lime': {
      inner += `<rect x="40" y="60" width="62" height="62" fill="${color}"/>`
      inner += `<text x="71" y="104" font-size="30" fill="#ffffff" text-anchor="middle" font-weight="700">李</text>`
      inner += line(118, 72, 160, '#172033', 24, 8) + line(118, 112, 260, GRAY1, 12, 6) + circle(500, 100, 44, tint(color, 0.75))
      inner += `<rect x="40" y="152" width="520" height="2" fill="#d9f99d"/>`
      let y = 210
      for (let i = 0; i < 4; i++) { inner += circle(50, y + 8, 6, color) + line(70, y, 110, '#172033', 15, 4) + line(40, y + 30, 460) + line(40, y + 52, 420); y += 120 }
      break
    }
    case 'duo': {
      inner += `<rect width="600" height="170" fill="${color}"/>`
      inner += `<rect x="360" y="26" width="240" height="116" fill="${tint(color, 0.72)}"/>`
      inner += `<rect x="556" y="10" width="44" height="44" fill="${tint(color, 0.45)}"/>`
      inner += line(46, 62, 180, '#ffffff', 24, 8) + line(46, 104, 130, tint(color, 0.78), 12, 6) + line(46, 132, 160, tint(color, 0.58), 10, 5)
      inner += circle(520, 170, 44, tint(color, 0.75))
      inner += body(260, 12)
      break
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">${inner}</svg>`
}

let count = 0
covers.forEach((cfg) => {
  const file = resolve(outDir, `template-${cfg[0]}.svg`)
  // 已存在的封面不覆写（本机安全软件拦截覆写已有文件），内容未变时跳过即可
  if (existsSync(file)) return
  writeFileSync(file, svgFor(cfg))
  count++
})
console.log(`Generated ${count} new covers in ${outDir}`)
