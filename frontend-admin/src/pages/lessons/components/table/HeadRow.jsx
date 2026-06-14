import { lessonsToArray } from '../../../../utils/lessons';
import styles from './LessonsTable.module.css'

export default function HeadRow({ lessonsInDay }) {
  const pairsInDay = lessonsToArray(lessonsInDay)
  return (
    <td>
      <div class={styles.pairsContainer}>
        {pairsInDay.map((lessons, i) => (
          <div class={styles.headSlot}>{i + 1}</div>
        ))}
      </div>
    </td>
  )
}