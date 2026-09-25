/**
 * 富文本字段的读写工具。
 *
 * 编辑端 `<editor>` 只认 HTML，而历史数据（resume-design 导出、后端老简历）里
 * `content` / `jobContent[].content` 这类字段可能还是纯文本，这里做一层最小互转。
 *
 * 不做 HTML 净化：真正的 sanitize 在服务端保存边界上做（任务文档 §4.6 第 3 条），
 * 客户端只负责保证「空内容不落库」。
 */

const HAS_TAG = /<[a-z][\s\S]*>/i
const ONLY_TAGS = /^(?:\s|&nbsp;|<[^>]*>)*$/

/** 不带标签的纯文本按换行转 `<br>`；已是 HTML 的原样返回 */
export function plainToHtml(text: string): string {
  const value = String(text || '').trim()
  if (!value || HAS_TAG.test(value))
    return value
  return value.replace(/\n/g, '<br>')
}

/** 只剩空标签（如 `<p></p>`）时归一成空串，避免把空内容写进 JSON */
export function cleanHtml(html: string): string {
  const value = String(html || '').trim()
  return ONLY_TAGS.test(value) ? '' : value
}
