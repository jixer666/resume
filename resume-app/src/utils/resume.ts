import { extraTemplateColors, extraTemplates } from './resume-layouts'

export interface ResumeEntry { [key: string]: string }
/** 简历样式自定义（预览页"编辑样式"产生），缺省字段表示跟随模板默认 */
export interface ResumeStyle {
  /** 主题色覆盖，空/缺省表示跟随模板默认色 */
  themeColor?: string
  /** 字体缩放倍率，1 为标准大小 */
  fontScale?: number
  /** 行距缩放倍率，1 为标准行距 */
  lineScale?: number
  /** 正文字体，空为默认无衬线，可选 serif（衬线）/ monospace（等宽） */
  fontFamily?: string
  /** 全文加粗 */
  bold?: boolean
}

export interface ResumeData {
  id: string
  templateId: string
  style?: ResumeStyle
  avatar: string
  name: string
  gender: string
  phone: string
  email: string
  intention: string
  education: ResumeEntry[]
  work: ResumeEntry[]
  projects: ResumeEntry[]
  skills: string
  summary: string
  updatedAt: string
}

/** 各模板的主题色，预览/导出渲染时使用 */
export const templateColors: Record<string, string> = {
  classic: '#2563eb',
  sidebar: '#0f2747',
  minimal: '#334155',
  split: '#0d9488',
  timeline: '#4f46e5',
  banner: '#0891b2',
  compact: '#ea580c',
  card: '#7c3aed',
  formal: '#1e3a5f',
  creative: '#16a34a',
  ...extraTemplateColors,
}

/**
 * 模板布局：
 * - classic  经典单栏（顶部色条 + 居中身份区）
 * - sidebar  左侧深色边栏
 * - minimal  居中极简大留白
 * - split    左右双栏
 * - timeline 时间轴（左侧竖向时间线串起经历）
 * - banner   顶部大色块横幅
 * - compact  紧凑双列（信息密度高）
 * - card     区块卡片化（浅色分区衬底）
 * - formal   居中正式（传统中文简历风格）
 * - creative 左侧彩色几何 + 数据卡片
 */
export type TemplateLayout = 'classic' | 'sidebar' | 'minimal' | 'split' | 'timeline' | 'banner' | 'compact' | 'card' | 'formal' | 'creative'

export const templates = [
  { id: 'classic', name: '经典商务', description: '顶部色条配居中身份区，通用稳妥，适合大多数岗位。', cover: '/static/resume/template-classic.svg' },

  { id: 'sidebar', name: '侧边栏', description: '深色侧边栏布局，信息分区清晰，适合技术岗位。', cover: '/static/resume/template-sidebar.svg' },
  { id: 'minimal', name: '极简留白', description: '大量留白的极简风格，适合追求高级感的求职者。', cover: '/static/resume/template-minimal.svg' },
  { id: 'split', name: '双栏分栏', description: '左右双栏布局，内容紧凑，适合经历丰富的求职者。', cover: '/static/resume/template-split.svg' },
  { id: 'timeline', name: '时间轴', description: '竖向时间线串起教育与工作经历，脉络清晰，适合校招与晋升述职。', cover: '/static/resume/template-timeline.svg' },
  { id: 'banner', name: '横幅头图', description: '顶部大色块横幅承载身份信息，视觉冲击强，适合设计与新媒体岗位。', cover: '/static/resume/template-banner.svg' },
  { id: 'compact', name: '紧凑列表', description: '信息密度高、行距紧凑，适合一页塞下多段经历的资深求职者。', cover: '/static/resume/template-compact.svg' },
  { id: 'card', name: '简约卡片', description: '各分区以浅色衬底卡片呈现，现代清爽，适合互联网与产品运营。', cover: '/static/resume/template-card.svg' },
  { id: 'formal', name: '正式文书', description: '居中标题配深色正装风格，符合传统企事业单位阅览习惯。', cover: '/static/resume/template-formal.svg' },
  { id: 'creative', name: '创意设计', description: '彩色几何角标加数据卡片，个性鲜明，适合创意与文案类岗位。', cover: '/static/resume/template-creative.svg' },
  ...extraTemplates,
]

/** 样式编辑：可选主题色与字体档位（预览页"编辑样式"使用） */
export const styleThemeColors = ['#2563eb', '#1e3a5f', '#0d9488', '#7c3aed', '#ea580c', '#16a34a', '#dc2626', '#334155']
export const fontScaleOptions = [
  { label: '小', value: 0.9 },
  { label: '标准', value: 1 },
  { label: '大', value: 1.1 },
  { label: '特大', value: 1.25 },
]
export const lineScaleOptions = [
  { label: '紧凑', value: 0.9 },
  { label: '标准', value: 1 },
  { label: '宽松', value: 1.15 },
  { label: '特宽', value: 1.3 },
]
export const fontFamilyOptions = [
  { label: '默认', value: '' },
  { label: '衬线', value: 'serif' },
  { label: '等宽', value: 'monospace' },
]

/** 行距缩放状态：绘制前由预览页 setLineScale 设置，布局绘制函数通过 ls() 缩放行高与行间距 */
let activeLineScale = 1
export function setLineScale(value?: number) { activeLineScale = value || 1 }
/** 按"编辑样式"里的行距档位缩放一行行高或行间距 */
export function ls(value: number) { return Math.round(value * activeLineScale * 2) / 2 }

/** 主题色：优先用户自定义覆盖，否则取模板默认色 */
export function getThemeColor(templateId: string, override?: string): string {
  return override || templateColors[normalizeTemplateId(templateId)] || '#2563eb'
}

function clampChannel(value: number) { return Math.max(0, Math.min(255, Math.round(value))) }

/** 两个十六进制颜色按权重混合，weight 为第一个颜色的权重（0-1） */
export function mixColor(hexA: string, hexB: string, weight: number): string {
  const parse = (hex: string) => {
    const value = hex.replace('#', '')
    return [0, 2, 4].map(i => Number.parseInt(value.slice(i, i + 2), 16) || 0)
  }
  const a = parse(hexA)
  const b = parse(hexB)
  return `#${a.map((c, i) => clampChannel(c * weight + b[i] * (1 - weight)).toString(16).padStart(2, '0')).join('')}`
}
/** 掺入白色提亮，amount 为白色的比例（0-1） */
export function lighten(hex: string, amount: number): string { return mixColor(hex, '#ffffff', 1 - amount) }
/** 掺入黑色加深，amount 为黑色的比例（0-1） */
export function darken(hex: string, amount: number): string { return mixColor(hex, '#000000', 1 - amount) }

/** 全部合法布局 id：内置 10 款 + 扩展模板（resume-layouts.ts） */
const allLayoutIds: string[] = ['classic', 'sidebar', 'minimal', 'split', 'timeline', 'banner', 'compact', 'card', 'formal', 'creative', ...extraTemplates.map(t => t.id)]

export function getTemplateLayout(id: string): string {
  return allLayoutIds.includes(id) ? id : 'classic'
}

/** 旧版六色模板 id（blue/navy/cyan/green/orange/purple）的去重映射，兼容历史数据 */
const legacyTemplateMap: Record<string, string> = {
  blue: 'classic',
  navy: 'classic',
  cyan: 'classic',
  green: 'classic',
  orange: 'compact',
  purple: 'creative',
}

export function normalizeTemplateId(id: string): string {
  if (legacyTemplateMap[id]) return legacyTemplateMap[id]
  return getTemplateLayout(id) === 'classic' && id !== 'classic' ? 'classic' : id
}

export function blankResume(templateId = 'classic'): ResumeData {
  return { id: '', templateId, style: { themeColor: '', fontScale: 1 }, avatar: '', name: '', gender: '', phone: '', email: '', intention: '', education: [{ school: '', major: '', time: '' }], work: [{ company: '', role: '', time: '', detail: '' }], projects: [{ name: '', role: '', time: '', detail: '' }], skills: '', summary: '', updatedAt: '' }
}

export function getResumes(): ResumeData[] {
  return uni.getStorageSync('resume-list') || []
}

export function saveResume(data: ResumeData) {
  const list = getResumes()
  const item = { ...data, id: data.id || `${Date.now()}`, updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }) }
  const index = list.findIndex(i => i.id === item.id)
  if (index >= 0) list.splice(index, 1, item)
  else list.unshift(item)
  uni.setStorageSync('resume-list', list)
  return item
}

/** 预览和导出共用：移除空字段、空经历，避免移动端出现空白块。 */
export function compactResume(data: ResumeData): ResumeData {
  return {
    ...data,
    education: data.education.filter(i => Object.values(i).some(Boolean)),
    work: data.work.filter(i => Object.values(i).some(Boolean)),
    projects: data.projects.filter(i => Object.values(i).some(Boolean)),
  }
}

function toBase64(value: string) { const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'; let out = ''; for (let i = 0; i < value.length; i += 3) { const n = (value.charCodeAt(i) << 16) | ((value.charCodeAt(i + 1) || 0) << 8) | (value.charCodeAt(i + 2) || 0); out += chars[(n >> 18) & 63] + chars[(n >> 12) & 63] + (i + 1 < value.length ? chars[(n >> 6) & 63] : '=') + (i + 2 < value.length ? chars[n & 63] : '=') } return out }

function fromBase64(value: string) {
  const binary = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  const bytes: number[] = []
  for (let i = 0; i < value.length; i += 4) {
    const a = binary.indexOf(value[i]); const b = binary.indexOf(value[i + 1]); const c = binary.indexOf(value[i + 2]); const d = binary.indexOf(value[i + 3])
    const n = (a << 18) | (b << 12) | ((c < 0 ? 0 : c) << 6) | (d < 0 ? 0 : d)
    bytes.push((n >> 16) & 255); if (value[i + 2] !== '=') bytes.push((n >> 8) & 255); if (value[i + 3] !== '=') bytes.push(n & 255)
  }
  return Uint8Array.from(bytes).buffer
}

function imagePdf(jpeg: string, width: number, height: number) {
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>',
    `<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n${jpeg}\nendstream`,
    '<< /Length 32 >>\nstream\nq 595 0 0 842 0 0 cm /Im0 Do Q\nendstream',
  ]
  let pdf = '%PDF-1.4\n'; const offsets = [0]
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n` })
  const xref = pdf.length
  return `${pdf}xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
}

export function exportCanvasPdf(canvasId: string, name: string) {
  uni.showLoading({ title: '正在生成 PDF' })
  uni.canvasToTempFilePath({ canvasId, width: 1588, height: 2246, destWidth: 1588, destHeight: 2246, fileType: 'jpg', quality: 1,
    success: ({ tempFilePath }) => {
      // #ifdef MP-WEIXIN
      const fs = uni.getFileSystemManager()
      fs.readFile({ filePath: tempFilePath, encoding: 'base64', success: ({ data }) => { const binary = fromBase64(data as string); let jpeg = ''; new Uint8Array(binary).forEach(byte => { jpeg += String.fromCharCode(byte) }); const pdf = imagePdf(jpeg, 1588, 2246); const filePath = `${wx.env.USER_DATA_PATH}/${name || 'resume'}.pdf`; fs.writeFile({ filePath, data: toBase64(pdf), encoding: 'base64', success: () => { uni.hideLoading(); uni.openDocument({ filePath, fileType: 'pdf', showMenu: true }) }, fail: () => { uni.hideLoading(); uni.showToast({ title: 'PDF 写入失败', icon: 'none' }) } }) }, fail: () => { uni.hideLoading(); uni.showToast({ title: '读取预览失败', icon: 'none' }) } })
      // #endif
      // #ifdef H5
      fetch(tempFilePath).then(response => response.blob()).then(blob => blob.arrayBuffer()).then((buffer) => { let jpeg = ''; new Uint8Array(buffer).forEach(byte => { jpeg += String.fromCharCode(byte) }); const pdf = imagePdf(jpeg, 1588, 2246); const url = URL.createObjectURL(new Blob([Uint8Array.from(pdf, char => char.charCodeAt(0))], { type: 'application/pdf' })); const link = document.createElement('a'); link.href = url; link.download = `${name || 'resume'}.pdf`; link.click(); URL.revokeObjectURL(url); uni.hideLoading() }).catch(() => { uni.hideLoading(); uni.showToast({ title: '导出失败', icon: 'none' }) })
      // #endif
    }, fail: () => { uni.hideLoading(); uni.showToast({ title: '生成预览失败', icon: 'none' }) },
  })
}

export function exportResumePdf(data: ResumeData) {
  uni.setStorageSync('resume-preview', data)
  uni.navigateTo({ url: '/pages/resume-preview/resume-preview?export=1' })
}
