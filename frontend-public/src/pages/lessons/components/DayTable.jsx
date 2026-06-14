import { calcDate } from '../../../lib/helpers/date.js'
import styles from './DayTable.module.css'
import Lesson from './Lesson.jsx'

export default function LessonsTable({ lessons, startDate }) {
  const weekdays = {
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота',
    7: 'Воскресенье',
  }
  const weekdayIndex = lessons[0].weekday

  return (
    <div class={styles.card}>
      <div class={styles.header}>
        <h3 class={styles.subheader}>{weekdays[weekdayIndex]}</h3>
        <span class={styles.date}>{calcDate(startDate, weekdayIndex)}</span>
      </div>
      <table class={styles.table}>
        <tbody>
          {lessons.map(lesson => <Lesson lesson={lesson} />)}
        </tbody>
      </table>
    </div>
  )
}