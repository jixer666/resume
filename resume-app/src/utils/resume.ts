export interface ResumeEntry { [key: string]: string }
export interface ResumeData {
  id: string
  templateId: string
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

export const templates = [
  { id: 'blue', name: '蓝色极简', description: '留白充足、重点突出，适合互联网与产品岗位。', cover: '/static/resume/template-blue.svg' },
  { id: 'navy', name: '深蓝商务', description: '稳重专业的商务风格，适合管理与金融岗位。', cover: '/static/resume/template-navy.svg' },
  { id: 'cyan', name: '清新活力', description: '清爽明快的视觉层次，适合设计与市场岗位。', cover: '/static/resume/template-cyan.svg' },
]

export function blankResume(templateId = 'blue'): ResumeData {
  return { id: '', templateId, avatar: '', name: '', gender: '', phone: '', email: '', intention: '', education: [{ school: '', major: '', time: '' }], work: [{ company: '', role: '', time: '', detail: '' }], projects: [{ name: '', role: '', time: '', detail: '' }], skills: '', summary: '', updatedAt: '' }
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
  uni.canvasToTempFilePath({ canvasId, width: 794, height: 1123, destWidth: 1588, destHeight: 2246, fileType: 'jpg', quality: 1,
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
