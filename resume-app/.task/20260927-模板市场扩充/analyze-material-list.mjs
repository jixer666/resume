import fs from 'node:fs'

const p = 'resume-app/src/schema/materialList.ts'
const src = fs.readFileSync(p, 'utf8')
const lines = src.split('\n')

const MODELS = ['RESUME_TITLE','BASE_INFO','JOB_INTENTION','EDU_BACKGROUND','SKILL_SPECIALTIES','CAMPUS_EXPERIENCE','INTERNSHIP_EXPERIENCE','WORK_EXPERIENCE','PROJECT_EXPERIENCE','AWARDS','HOBBIES','SELF_EVALUATION','WORKS_DISPLAY']

// report structure
let mode = 'top'
const report = []
const entries = [] // {model, text}
let i = 0
while (i < lines.length) {
  const line = lines[i]
  const m = line.match(/^(\s*)([A-Z_]+): \[\s*$/)
  if (m) { report.push(`OPEN  L${i+1} indent=${m[1].length} ${m[2]}`); i++; mode = 'in-array'; continue }
  const c = line.match(/^(\s*)\],\s*$/)
  if (c) { report.push(`CLOSE L${i+1} indent=${c[1].length}`); i++; mode = 'top'; continue }
  if (/^\s*\{\s*$/.test(line)) {
    // entry block: brace match
    let depth = 0, j = i, end = -1
    for (; j < lines.length; j++) {
      depth += (lines[j].match(/\{/g)||[]).length - (lines[j].match(/\}/g)||[]).length
      if (depth === 0) { end = j; break }
    }
    const block = lines.slice(i, end+1).join('\n')
    const mm = block.match(/model: '([A-Z_]+)'/)
    const cn = block.match(/cptName: '([A-Z0-9_]+)'/)
    const indent = line.match(/^\s*/)[0].length
    report.push(`ENTRY L${i+1}-L${end+1} indent=${indent} model=${mm?mm[1]:'?'} cpt=${cn?cn[1]:'?'}`)
    entries.push({model: mm?mm[1]:'?', cpt: cn?cn[1]:'?', start:i, end, indent})
    i = end + 1
    continue
  }
  if (line.trim() !== '') report.push(`OTHER L${i+1} ${JSON.stringify(line.slice(0,60))}`)
  i++
}
console.log(report.join('\n'))
console.log('ENTRIES', entries.length)
