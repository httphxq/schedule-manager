import styles from './Teacher.module.css'
import { redirect } from '../../../core/router.js'

export default function TeacherName(teacher) {
  return (
    <h5 class={styles.teacherName}>
      <button class={styles.teacherButton} onClick={() => redirect(`/public/teachers/${teacher.id}/lessons`)}>{teacher.fio}</button>
    </h5>
  )
}
