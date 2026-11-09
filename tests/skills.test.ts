import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { test } from 'node:test'
import { applications, dockOrder } from '../src/data/apps.ts'
import { skills, skillCategories } from '../src/data/skills.ts'
import { resolveSkillWork } from '../src/apps/skills/relatedWork.ts'

test('The seven dock applications retain their exact order and Experience window presets', () => {
  assert.deepEqual(dockOrder, ['home', 'jarvis', 'education', 'experience', 'projects', 'skills', 'contact'])
  assert.equal(applications.experience.name, 'Experience')
  assert.deepEqual(applications.experience.window.normal, { width: 720, height: 480 })
  assert.deepEqual(applications.experience.window.expanded, { width: 1000, height: 700 })
  assert.equal(applications.experience.window.placeholder.message, 'Professional experience application — implementation scheduled for Phase 6.')
})

test('Toolkit contains exactly the supplied skills in their four categories', () => {
  const expected = [
    ['Python', 'SQL', 'Java', 'JavaScript', 'TypeScript'],
    ['SQLite', 'Power BI', 'DAX', 'Power Query', 'Tableau'],
    ['React', 'Git', 'GitHub', 'Vercel'],
    ['ETL Pipelines', 'Data Modeling', 'Data Validation', 'Automated Testing'],
  ]
  assert.equal(new Set(skills.map((skill) => skill.id)).size, 18)
  assert.equal(skillCategories.length, 4)
  skillCategories.forEach((category, index) => {
    assert.deepEqual(skills.filter((skill) => skill.category === category.id).map((skill) => skill.name), expected[index])
  })
  assert.ok(skills.every((skill) => skill.description.length > 15))
})

test('All local brand assets exist, and no skill invents a related destination', () => {
  for (const skill of skills) {
    if (skill.icon.kind === 'brand') assert.ok(existsSync(new URL(`../src/assets/icons/skills/${skill.icon.asset}.svg`, import.meta.url)))
    assert.deepEqual(resolveSkillWork(skill, []), [])
    for (const reference of skill.relatedWork ?? []) {
      assert.ok(reference.applicationId in applications)
      assert.ok(reference.resourceId.length > 0)
    }
  }
})

test('Related work is suppressed while Finder and Experience are placeholders', () => {
  const skill = { ...skills[0], relatedWork: [{ applicationId: 'experience' as const, resourceId: 'test-role' }, { applicationId: 'projects' as const, resourceId: 'test-project' }] }
  assert.deepEqual(resolveSkillWork(skill, [{ applicationId: 'experience', resourceId: 'test-role', label: 'Test role' }, { applicationId: 'projects', resourceId: 'test-project', label: 'Test project' }]), [])
})
