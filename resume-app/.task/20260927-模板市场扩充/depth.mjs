import fs from 'node:fs'
const p = 'E:/code/lijunxi/temp/resume/resume-app/src/schema/materialList.ts'
const lines = fs.readFileSync(p, 'utf8').split('\n')
let depth = 0
const out = []
for (let i = 0; i < 260; i++) {
  const l = lines[i]
  const opens = (l.match(/\{/g)||[]).length
  const closes = (l.match(/\}/g)||[]).length
  const before = depth
  depth += opens - closes
  out.push(`${String(i+1).padStart(5)} d${String(before).padStart(2)}->${String(depth).padStart(2)} | ${l}`)
}
fs.writeFileSync('E:/code/lijunxi/temp/resume/resume-app/.task/20260927-模板市场扩充/depth-out.txt', out.join('\n'))
console.log('ok')
