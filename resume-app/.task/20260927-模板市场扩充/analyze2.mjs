import fs from 'node:fs'
const p = 'E:/code/lijunxi/temp/resume/resume-app/src/schema/materialList.ts'
const src = fs.readFileSync(p, 'utf8')
const lines = src.split('\n')
const out = []
let i = 0
let guard = 0
while (i < lines.length && guard++ < 200000) {
  const line = lines[i]
  const m = line.match(/^(\s*)([A-Z_]+): \[\s*$/)
  if (m) { out.push(`OPEN  L${i+1} indent=${m[1].length} ${m[2]}`); i++; continue }
  const c = line.match(/^(\s*)\],\s*$/)
  if (c) { out.push(`CLOSE L${i+1} indent=${c[1].length}`); i++; continue }
  if (/^\s*\{\s*$/.test(line)) {
    let depth = 0, j = i, end = -1
    for (; j < lines.length; j++) {
      depth += (lines[j].match(/\{/g)||[]).length - (lines[j].match(/\}/g)||[]).length
      if (depth === 0) { end = j; break }
    }
    if (end < 0) { out.push(`UNBALANCED ENTRY L${i+1}`); break }
    const block = lines.slice(i, end+1).join('\n')
    const mm = block.match(/model: '([A-Z_]+)'/)
    const cn = block.match(/cptName: '([A-Z0-9_]+)'/)
    out.push(`ENTRY L${i+1}-L${end+1} indent=${line.match(/^\s*/)[0].length} model=${mm?mm[1]:'?'} cpt=${cn?cn[1]:'?'}`)
    i = end + 1
    continue
  }
  if (line.trim() !== '') out.push(`OTHER L${i+1} ${line.slice(0,70)}`)
  i++
}
fs.writeFileSync('E:/code/lijunxi/temp/resume/resume-app/.task/20260927-模板市场扩充/analyze-out.txt', out.join('\n'))
console.log('done', out.length)
