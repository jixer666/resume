import fs from 'node:fs'

function maskStrings(src) {
  // returns same-length string where string/comment contents are replaced by spaces (so braces inside them are ignored)
  const out = src.split('')
  let i = 0
  const n = src.length
  while (i < n) {
    const c = src[i]
    const c2 = src[i+1]
    if (c === '/' && c2 === '/') { while (i < n && src[i] !== '\n') { out[i] = ' '; i++ } continue }
    if (c === '/' && c2 === '*') { out[i]=' '; out[i+1]=' '; i+=2; while (i < n && !(src[i]==='*' && src[i+1]==='/')) { if (src[i] !== '\n') out[i]=' '; i++ } if (i<n){out[i]=' ';out[i+1]=' ';i+=2} continue }
    if (c === "'" || c === '"' || c === '`') {
      const q = c; out[i] = ' '; i++
      while (i < n) {
        if (src[i] === '\\') { out[i]=' '; out[i+1]=' '; i+=2; continue }
        if (src[i] === q) { out[i]=' '; i++; break }
        if (src[i] !== '\n') out[i]=' '
        i++
      }
      continue
    }
    i++
  }
  return out.join('')
}

function extractEntries(src) {
  const masked = maskStrings(src)
  const entries = []
  const re = /cptName: '/g
  let m
  while ((m = re.exec(src))) {
    const at = m.index
    // find nearest preceding line-anchored '{' start
    let start = -1
    const lineStartRe = /\n([ \t]*)\{/g
    let last = -1, lm
    while ((lm = lineStartRe.exec(masked))) { if (lm.index < at) last = lm; else break }
    if (last === -1) continue
    start = masked.indexOf('{', last.index)
    // forward brace match
    let depth = 0, j = start
    for (; j < masked.length; j++) {
      if (masked[j] === '{') depth++
      else if (masked[j] === '}') { depth--; if (depth === 0) break }
    }
    const text = src.slice(start, j+1)
    const nameM = text.match(/cptName: '([A-Z0-9_]+)'/)
    const modelM = text.match(/model: '([A-Z_]+)'/)
    const name = nameM ? nameM[1] : '?'
    entries.push({ name, model: modelM ? modelM[1] : '?', text, startLine: src.slice(0,start).split('\n').length })
  }
  return entries
}

const head = fs.readFileSync('E:/code/lijunxi/temp/resume/resume-app/.task/20260927-模板市场扩充/head-materialList.ts','utf8')
const cur = fs.readFileSync('E:/code/lijunxi/temp/resume/resume-app/src/schema/materialList.ts','utf8')
const he = extractEntries(head), ce = extractEntries(cur)
console.log('head entries', he.length, 'cur entries', ce.length)
const norm = s => s.replace(/\s+/g,' ').trim()
const hmap = new Map(he.map(e=>[e.name, norm(e.text)]))
const cmap = new Map(ce.map(e=>[e.name, norm(e.text)]))
const onlyHead = he.filter(e=>!cmap.has(e.name)).map(e=>e.name)
const onlyCur = ce.filter(e=>!hmap.has(e.name)).map(e=>e.name)
console.log('onlyHead', onlyHead.length, onlyHead.join(','))
console.log('onlyCur', onlyCur.length, onlyCur.join(','))
const diffs = []
for (const e of he) { const c = cmap.get(e.name); if (c && c !== hmap.get(e.name)) diffs.push(e.name) }
console.log('changed', diffs.length, diffs.join(','))
