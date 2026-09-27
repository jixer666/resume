import fs from 'node:fs'
const f = 'E:/code/lijunxi/temp/resume/resume-app/.task/20260927-模板市场扩充/head-materialList.ts'
const src = fs.readFileSync(f, 'utf8')
const names = [...src.matchAll(/cptName: '([A-Z0-9_]+)'/g)].map(m=>m[1])
const byModel = {}
for (const n of names) {
  const model = n.replace(/_\d+$/, '')
  byModel[model] = byModel[model] || []
  byModel[model].push(n)
}
for (const k of Object.keys(byModel)) console.log(k, byModel[k].length, byModel[k].join(','))
console.log('lines', src.split('\n').length)
