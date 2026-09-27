import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
const root = resolve('src', 'material')
function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (p.endsWith('.vue')) out.push(p)
  }
  return out
}
const missing = []
for (const file of walk(root)) {
  const src = readFileSync(file, 'utf8')
  for (const m of src.matchAll(/from\s+'(?:@\/material|\.\.?\/)([^']+)'/g)) {
    const raw = m[0].slice(m[0].indexOf("'") + 1, -1)
    let target
    if (raw.startsWith('@/')) target = resolve('src', raw.slice(2))
    else target = resolve(dirname(file), raw)
    const cands = [target, target + '.vue', join(target, 'index.vue')]
    if (!cands.some(c => existsSync(c))) missing.push([file, raw])
  }
}
for (const [f, r] of missing) console.log(f.replace(root, ''), '->', r)
console.log('missing total', missing.length)
