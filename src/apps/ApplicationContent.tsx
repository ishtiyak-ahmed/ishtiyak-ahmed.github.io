import type { WindowApplicationId } from '../data/apps'
import { ApplicationPlaceholder } from '../components/windows/ApplicationPlaceholder'
import { EducationApp } from './education/EducationApp'
import { CoffeeApp } from './coffee/CoffeeApp'

export function ApplicationContent({ appId }: { appId: WindowApplicationId }) {
  if (appId === 'education') return <EducationApp />
  if (appId === 'contact') return <CoffeeApp />
  return <ApplicationPlaceholder appId={appId} />
}
