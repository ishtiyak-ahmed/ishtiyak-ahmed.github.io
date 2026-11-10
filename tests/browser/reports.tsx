import { createRoot } from 'react-dom/client'
import { ProjectReportPage } from '../../src/reports/ProjectReportPage'
import { FinderApp } from '../../src/apps/finder/FinderApp'
import { WindowManagerProvider } from '../../src/app/WindowManagerProvider'
import { parsePortfolioRoute } from '../../src/routing/projectRoutes'
import { useHashNavigation } from '../../src/routing/hashNavigation'
import { reportFixture, reportAssets } from '../fixtures/reports'
import '../../src/styles/global.css'
export function FixtureReports() {
  const navigation = useHashNavigation()
  const route = parsePortfolioRoute(navigation.hash, [reportFixture])
  if (route.kind === 'report') return <ProjectReportPage project={reportFixture} assets={reportAssets} />
  return <div style={{ height: '100dvh' }}><FinderApp entries={[reportFixture]} /></div>
}
createRoot(document.getElementById('root')!).render(<WindowManagerProvider><FixtureReports /></WindowManagerProvider>)
