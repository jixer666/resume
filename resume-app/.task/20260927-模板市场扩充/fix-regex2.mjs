import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = join(process.cwd(), '..', '..', 'src', 'material')
function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (p.endsWith('.vue')) out.push(p)
  }
  return out
}
let changed = 0
for (const file of walk(root)) {
  let src = readFileSync(file, 'utf8')
  const before = src
  src = src.split('/<brs*/?>/gi').join('/<br\\s*\\/?>/gi')
  src = src.split('/<br\\s*/?>/gi').join('/<br\\s*\\/?>/gi')
  if (src !== before) { writeFileSync(file, src, 'utf8'); changed++; console.log('fixed', file.replace(root, '')) }
}
console.log('total', changed)
