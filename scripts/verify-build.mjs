import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
function inspect(directory) {
  for (const name of readdirSync(directory)) {
    const path = `${directory}/${name}`
    if (statSync(path).isDirectory()) inspect(path)
    else if (/\.(js|html)$/.test(path)) assert.doesNotMatch(readFileSync(path, 'utf8'), /TEST FIXTURE|Terminal implementation scheduled|Application implementation scheduled/)
  }
}
inspect('dist')
assert.ok(!existsSync('dist/tests'))
const digest = (path) => createHash('sha256').update(readFileSync(path)).digest('hex')
assert.equal(digest('public/documents/Ishtiyak_Ahmed_Resume.pdf'), digest('dist/documents/Ishtiyak_Ahmed_Resume.pdf'))
const html = readFileSync('dist/index.html', 'utf8')
for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"#]+)"/g)) assert.ok(existsSync(`dist${match[1]}`))
console.log('Production assets verified; resume unchanged; development fixtures excluded.')
