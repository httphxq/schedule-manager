import store from '../../../../state/store';
import { daysMap } from '../../../../utils/lessons';
import HeadRow from './HeadRow';
import styles from './LessonsTable.module.css'
import TableRow from './TableRow';


export default function LessonsTable({ lessonsByGroups, weekdays, lessonsInDay }) {
  const { selectedGroup } = store.ui.lessons

  return (
    <table class={styles.table}>
      <thead>
        <tr>
          <th>День недели</th>
          {weekdays.map((day, idx) => (
            <th>{daysMap[day]}</th>
          ))}
        </tr>
        <tr>
          <th>Пара</th>
          {weekdays.map(() => (
            <HeadRow lessonsInDay={lessonsInDay} />
          ))}
        </tr>
      </thead>
      <tbody>
        {lessonsByGroups.map((group) => (
          <tr class={selectedGroup === group.id ? 'selectedGroup' : ''}>
            <td>{group.name}</td>
            {group.weekdays.map((day) => (
              <TableRow lessons={day.lessons} weekday={day.dayIndex} group={group}/>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
