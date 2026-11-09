import { ExperienceApp } from './experience/ExperienceApp'
import type { ResourceRequest } from '../app/windowState'
import type { WindowApplicationId } from '../data/apps'
import { ApplicationPlaceholder } from '../components/windows/ApplicationPlaceholder'
import { EducationApp } from './education/EducationApp'
import { SkillsApp } from './skills/SkillsApp'
import { CoffeeApp } from './coffee/CoffeeApp'

export function ApplicationContent({ appId, resourceRequest }: { appId: WindowApplicationId; resourceRequest?: ResourceRequest }) {
  if (appId === 'experience') return <ExperienceApp selectionRequest={resourceRequest} />
  if (appId === 'skills') return <SkillsApp />
  if (appId === 'education') return <EducationApp />
  if (appId === 'contact') return <CoffeeApp />
  return <ApplicationPlaceholder appId={appId} />
}
