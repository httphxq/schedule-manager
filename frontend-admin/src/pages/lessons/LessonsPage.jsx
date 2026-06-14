import { fetchLessons } from '../../api/lessons';
import Modal from '../../shared/Modal';
import CreateWorkload from './components/CreateWorkload';
import LessonsTable from './components/table/LessonsTable';
import WorkloadsSection from './components/workloadsSection/WorkloadsSection'
import styles from './LessonsPage.module.css'
import InfoSection from './components/InfoSection';
import { fetchWorkloads } from '../../api/workloads';
import { buildLessons } from '../../utils/lessons';
import store from '../../state/store';
import { getWeekRange } from '../../utils/date';

export default async function LessonsPage() {
  const { pathname } = new URL(window.location.href)
  const [, , , scheduleId] = pathname.split('/')
  store.currentScheduleId = Number(scheduleId)
  const scheduleData = await fetchLessons(scheduleId);
  const workloads = await fetchWorkloads(scheduleId)
  const { groups, teachers, subjects, schedule } = scheduleData

  if (scheduleData.type === 'error') {
    return <div>Расписание не найдено</div>;
  }

  const { weekdays, lessonsInDay } = schedule 
  const lessonsByGroups = buildLessons(scheduleData)

  return (
    <div class={styles.crudPage}>
      <div class={styles.crudHeader}>
        {schedule.startDate 
        ?  <h1>Расписание: {`${schedule.name} (${getWeekRange(schedule.startDate)})`}</h1>
        :  <h1>Расписание: {schedule.name}</h1>
      }
      </div>

      <div class={styles.tableWrapper}>
        <LessonsTable
          lessonsByGroups={lessonsByGroups}
          weekdays={weekdays}
          lessonsInDay={lessonsInDay}
        />
      </div>

      <div class={styles.bottomContainer}>
        <div id="infoSection" class={styles.leftPanel}>
          <InfoSection />
        </div>
        <div id="pairSection" class={styles.rightPanel}>
          <WorkloadsSection workloads={workloads} />
        </div>
      </div>
      <Modal modalId="createLesson">
        <CreateWorkload teachers={teachers} groups={groups} subjects={subjects} scheduleId={scheduleId} />
      </Modal>
    </div>
  );
}
