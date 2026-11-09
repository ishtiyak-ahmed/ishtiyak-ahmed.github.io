import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import { education, educationDetails } from '../src/data/education.ts'
import { contactDetails, contactLinks, contactMethodOrder, getContactLinks, quickLinkOrder } from '../src/data/contact.ts'
import { desktopContent } from '../src/data/desktop.ts'
import { copyPhoneNumber } from '../src/apps/coffee/copyPhone.ts'

test('Education configuration supplies the requested program facts and confirmed graduation with fallback support', () => {
  assert.equal(education.institution, 'University of Toronto')
  assert.equal(education.campus, 'Mississauga Campus')
  assert.equal(education.major, 'Applied Statistics')
  assert.deepEqual(education.minors, ['Computer Science', 'Geospatial Data Science'])
  assert.deepEqual(educationDetails(education).at(-1)?.values, ['May 2029'])
  assert.deepEqual(educationDetails({ ...education, expectedGraduation: null }).at(-1)?.values, ['To be confirmed'])
  assert.equal(education.logo, null)
  assert.deepEqual(educationDetails({ ...education, expectedGraduation: 'Confirmed public date' }).at(-1)?.values, ['Confirmed public date'])
})

test('Coffee and Quick Links share the same canonical destinations in their required orders', () => {
  assert.deepEqual([...contactLinks.map((link) => link.id), 'phone'], contactMethodOrder)
  assert.deepEqual(desktopContent.quickLinks.map((link) => link.id), quickLinkOrder)
  for (const link of desktopContent.quickLinks) {
    assert.equal(link, contactLinks.find((contact) => contact.id === link.id))
  }
  const changed = getContactLinks({ ...contactDetails, email: 'test@example.invalid' })
  assert.equal(changed[0].href, 'mailto:test@example.invalid')
})

test('Contact actions use valid verified destinations and keep missing details unavailable', () => {
  assert.equal(contactLinks[0].href, `mailto:${contactDetails.email}`)
  for (const id of ['linkedin', 'github'] as const) {
    const link = contactLinks.find((item) => item.id === id)!
    assert.equal(new URL(link.href!).protocol, 'https:')
    assert.equal(link.newTab, true)
  }
  assert.equal(contactLinks.find((link) => link.id === 'resume')?.href, null)
  assert.equal(contactDetails.phone?.display, '437-606-3417')
  assert.equal(contactDetails.phone?.copyValue, '437-606-3417')
  assert.equal(contactDetails.phone?.tel, '+14376063417')
  const empty = getContactLinks({ email: null, linkedin: null, github: null, resume: null, phone: null })
  assert.ok(empty.every((link) => link.href === null && link.unavailableMessage.length > 0))
})

test('A supplied current resume is shared as a new-tab PDF action', () => {
  const links = getContactLinks({ ...contactDetails, resume: '/test-current-resume.pdf' })
  const resume = links.find((link) => link.id === 'resume')!
  assert.equal(resume.href, '/test-current-resume.pdf')
  assert.equal(resume.newTab, true)
})

test('Phone copy succeeds only after the clipboard write resolves', async () => {
  const writes: string[] = []
  const result = await copyPhoneNumber('test-number', { writeText: async (value) => { writes.push(value) } })
  assert.equal(result, 'success')
  assert.deepEqual(writes, ['test-number'])
})

test('Phone copy reports denied or unsupported clipboard access without throwing', async () => {
  assert.equal(await copyPhoneNumber('test-number'), 'error')
  assert.equal(await copyPhoneNumber('test-number', { writeText: async () => { throw new Error('Denied') } }), 'error')
})

test('A missing phone never attempts a clipboard write', async () => {
  let writes = 0
  assert.equal(await copyPhoneNumber(null, { writeText: async () => { writes++ } }), 'unavailable')
  assert.equal(writes, 0)
})

test('Resume is enabled only when the configured public PDF is present', () => {
  if (contactDetails.resume) {
    const path = new URL(`../public${contactDetails.resume}`, import.meta.url)
    assert.ok(existsSync(path))
    assert.equal(readFileSync(path).subarray(0, 5).toString(), '%PDF-')
  } else {
    assert.equal(contactLinks.find((link) => link.id === 'resume')?.href, null)
  }
  assert.equal(desktopContent.quickLinks.some((link) => link.id === ('phone' as string)), false)
})
