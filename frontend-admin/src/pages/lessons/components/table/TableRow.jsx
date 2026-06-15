import { deleteLesson, setLesson } from '../../../../api/lessons.js';
import { decrementWorkload } from '../../../../api/workloads.js';
import { render } from '../../../../core/render.js';
import { refreshPage } from '../../../../core/router.js';
import { ui } from '../../../../utils/dom.js';
import { lessonsToArray } from '../../../../utils/lessons.js';
import InfoSection from '../InfoSection.jsx';
import styles from './LessonsTable.module.css'
import lessonsState from '../../../../state/lessonsState.js';
import globalState from '../../../../state/globalState.js';

export default function TableRow({ lessons, weekday, group }) {

  const setWorkloadToLessons = async (lesson) => {
    const { lessonNumber } = lesson
    const result = await setLesson({ ...lessonsState.getSelectedWorkload(), lessonNumber, scheduleId: globalState.getCurrentScheduleId(), weekday })
    console.log(22, { ...lessonsState.getSelectedWorkload(), lessonNumber, scheduleId: globalState.getCurrentScheduleId(), weekday });
    ui.showFlashMessage(result)
    if (result.type === 'success') {
      const result = await decrementWorkload(lessonsState.getSelectedWorkload().workloadId);
      if (result.workloadsLeft === 0) {
        lessonsState.clearCursorStatus()
      }
    }
    refreshPage()
  }

  const handleLessonClick = async (target, lesson) => {
    if (lessonsState.getCursorStatus() === 'workloadSelected') {
      await setWorkloadToLessons(lesson)
      return;
    };
  }

  const handleDeleteLesson = async (lesson) => {
    const result = await deleteLesson(lesson.workloadId)
    ui.showFlashMessage(result)
    refreshPage()
  }

  const handleLessonContextMenu = (e, lesson) => {
    if (lesson.style !== 'booked') return;
    ui.showCustomMenu(e.clientX, e.clientY, [
      { label: 'Удалить', variant: 'danger', onClick: () => handleDeleteLesson(lesson) },
    ])
  }

  const showLessonInfo = (lesson) => {
    if (lesson.style !== 'booked') return;
    render("#infoSection", <InfoSection scheduleItem={lesson} />)
  }

  const clearLessonInfo = (lesson) => {
    if (lesson.style !== 'booked') return;
    render("#infoSection", <InfoSection />)
  }

  return (
    <td>
      <div class={styles.pairsContainer}>
        {lessons.map((lesson, index) => (
          <div class={`${styles.pairSlot} ${lesson.style}`} onMouseEnter={() => showLessonInfo(lesson)} onMouseLeave={() => clearLessonInfo(lesson)} onClick={(e) => handleLessonClick(e.target, lesson)} onContextMenu={(e) => handleLessonContextMenu(e, lesson)}>
            <span class={styles.pairText} title={lesson.text}>{lesson.text}</span>
          </div>
        ))}
      </div>
    </td>
  )
}
