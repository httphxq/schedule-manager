import { parseUrl } from '../../../lib/helpers/urlHelpers'
import styles from './Lesson.module.css'

export default function Lesson({lesson}) {
  const { category } = parseUrl(window.location.href)
  
  if (lesson.type === 'window') {
    return (
      <tr>
        <td class={styles.time}></td>
        <td class={styles.info}>
          <div class={styles.window}>Окно: {lesson.totalTime}</div>
        </td>
      </tr>
    )
  }

  return (
    <tr>
      <td class={styles.time}>
        <div>{lesson.startTime}</div>
        <div>{lesson.endTime}</div>
      </td>
      <td class={styles.info}>
        <div class={styles.subject}>{lesson.subjectName}</div>
        <div class={styles.groups}>{category === 'groups' ? lesson.teacherName : lesson.joinedGroups}</div>
      </td>
    </tr>
  )
}