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

const NL = String.fromCharCode(10)
const fixes = [
  ['/</(p|div|li)>/gi', '/<\\/(p|div|li)>/gi'],
  ['/<brs*\\/?>/gi', '/<br\\s*\\/?>/gi'],
  [", '" + NL + "')", ", '\\n')"],
  ['；' + NL + ']+/)', '；\\n]+/)'],
]

let changed = 0
for (const file of walk(root)) {
  let src = readFileSync(file, 'utf8')
  const before = src
  for (const [from, to] of fixes) src = src.split(from).join(to)
  if (src !== before) {
    writeFileSync(file, src, 'utf8')
    changed++
    console.log('fixed', file.replace(root, ''))
  }
}
console.log('total', changed)
