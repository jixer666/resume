import fs from 'node:fs'
const t = fs.readFileSync('E:/code/lijunxi/temp/resume/resume-server/sql/resume.sql', 'utf8')
const lines = t.split(/\r?\n/).filter(l => l.startsWith('INSERT INTO `resume_template`'))
for (const l of lines.slice(0, 3)) {
  const m = l.match(/VALUES \((\d+), '([^']*)', '([^']*)', '([^']*)', '', 1, '(.*)', 1, 0/)
  const json = m[5].replace(/''/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\')
  const d = JSON.parse(json)
  console.log('== id', m[1], m[2], m[3])
  console.log('layout', d.layout, 'columns', JSON.stringify(d.columns))
  console.log('style', JSON.stringify(d.style))
  console.log('variants', JSON.stringify(d.variants))
  console.log('hidden', JSON.stringify(d.hidden))
}
