import DayTable from './components/DayTable.jsx'
import { addWindows, sortLessonsByDays } from '../../lib/helpers/sortHelpers.js'
import styles from './LessonsPage.module.css'
import BreadCrumbs from '../../components/BreadCrumbs.jsx'
import { fetchLessons } from '../../lib/api.js'
import PageNavigation from '../../components/PageNavigation.jsx'
import { parseUrl } from '../../lib/helpers/urlHelpers.js'
import { render } from '../../core/render.js'
import Spinner from '../../components/Spinner.jsx'

export default async function GroupsLessons() {
  await render('#app', <Spinner />)
  const { lessons, group, date } = await fetchLessons('groups')

  const sortedLessons = sortLessonsByDays(lessons)
  const days = Object.keys(sortedLessons)
  const breadcrumbs = [
    {
      type: 'ref', href: `/public/groups`,
      text: 'Группы',
    },
    { text: group.name },
  ]

  return (
    <div>
      <BreadCrumbs crumbs={breadcrumbs} />
      <PageNavigation date={date} category={'groups'} id={group.id} />
      <div class={styles.scheduleDashboard}>
        <div class={styles.scheduleGrid}>
          {days.map(day => <DayTable lessons={addWindows(sortedLessons[day])} startDate={date} />)}
        </div>
      </div>
    </div>
  )
}