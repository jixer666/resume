import fs from 'node:fs'
function maskStrings(src) {
  const out = src.split(''); let i = 0; const n = src.length
  while (i < n) {
    const c = src[i], c2 = src[i+1]
    if (c === '/' && c2 === '/') { while (i < n && src[i] !== '\n') { out[i]=' '; i++ } continue }
    if (c === '/' && c2 === '*') { out[i]=' ';out[i+1]=' ';i+=2; while (i<n && !(src[i]==='*'&&src[i+1]==='/')) { if (src[i]!=='\n') out[i]=' '; i++ } if(i<n){out[i]=' ';out[i+1]=' ';i+=2} continue }
    if (c === "'" || c === '"' || c === '`') { const q=c; out[i]=' '; i++
      while (i<n) { if (src[i]==='\\') { out[i]=' ';out[i+1]=' ';i+=2; continue } if (src[i]===q) { out[i]=' ';i++;break } if (src[i]!=='\n') out[i]=' '; i++ } continue }
    i++
  }
  return out.join('')
}
const src = fs.readFileSync('E:/code/lijunxi/temp/resume/resume-app/.task/20260927-模板市场扩充/head-materialList.ts','utf8')
const masked = maskStrings(src)
// find module sections
const keys = ['RESUME_TITLE','BASE_INFO','JOB_INTENTION','EDU_BACKGROUND','SKILL_SPECIALTIES','CAMPUS_EXPERIENCE','INTERNSHIP_EXPERIENCE','WORK_EXPERIENCE','PROJECT_EXPERIENCE','AWARDS','HOBBIES','SELF_EVALUATION','WORKS_DISPLAY']
for (const k of keys) {
  const start = src.indexOf(`  ${k}: [`)
  const end = src.indexOf('\n  ],', start)
  const section = src.slice(start, end)
  const re = /cptName: '([A-Z0-9_]+)'/g
  let m, first = null
  const styles = []
  while ((m = re.exec(section))) {
    // style block after this cptName
    const si = section.indexOf('style: {', m.index)
    let depth=0, j=si, e=-1
    for (; j<section.length; j++){ if(section[j]==='{')depth++; else if(section[j]==='}'){depth--; if(depth===0){e=j;break}} }
    const st = section.slice(si, e+1)
    styles.push(`${m[1]} :: ${st.replace(/\s+/g,' ')}`)
  }
  console.log(`### ${k} (${styles.length})`)
  for (const s of styles.slice(0,3)) console.log('   ', s)
}
