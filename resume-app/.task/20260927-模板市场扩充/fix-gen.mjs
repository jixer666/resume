import { readFileSync, writeFileSync } from 'node:fs'
const pairs = [
  [".replace(/<\\/(p|div|li)>/gi, '\\n')", ".replace(/<\\\\/(p|div|li)>/gi, '\\\\n')"],
  [".replace(/<br\\s*\\/?>/gi, '\\n')", ".replace(/<br\\\\s*\\\\/?>/gi, '\\\\n')"],
  [".split(/[、，,;；\\n]+/)", ".split(/[、，,;；\\\\n]+/)"],
]
for (const file of ['gen-v2-a.mjs', 'gen-v2-b3.mjs']) {
  let src = readFileSync(file, 'utf8')
  let n = 0
  for (const [from, to] of pairs) {
    const parts = src.split(from)
    n += parts.length - 1
    src = parts.join(to)
  }
  writeFileSync(file, src, 'utf8')
  console.log(file, 'replaced', n)
}
