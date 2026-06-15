import { render } from "../../../core/render";
import pages from "../../pages.module.css"
import { redirect } from "../../../core/router";
import Sidebar from "../../../shared/Sidebar";
import styles from './SchedulesTable.module.css'
import globalState from "../../../state/globalState";

export default function SchedulesTable({ schedules, onEdit, onDelete }) {
  const formatScheduleType = (schedule) => {
    if (schedule.type === 'template') return 'шаблон';

    const startDate = new Date(schedule.start_date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const format = (date) => date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    return `${format(startDate)} - ${format(endDate)}`;
  };

  const redirectToLessons = (scheduleId) => {
    globalState.setCurrentScheduleId(scheduleId)
    redirect(`/admin/lessons/${scheduleId}`)
    render('#sidebarContainer', <Sidebar />)
  }

  return (
    <>
      <table class={pages.table}>
        <thead>
          <tr>
            <th>Название</th>
            <th>Дата создания</th>
            <th>Пар в день</th>
            <th>Дни недели</th>
            <th>Тип расписания</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {schedules.map(schedule => (
            <tr class={styles.scheduleRow} onClick={() => redirectToLessons(schedule.id)}>
              <td>{schedule.name}</td>
              <td>{new Date(schedule.created).toLocaleDateString()}</td>
              <td>{schedule.lessonsInDay}</td>
              <td>{schedule.weekdays.join(', ')}</td>
              <td>{formatScheduleType(schedule)}</td>
              <td>
                <button
                  class={`${pages.tableActionButton} ${pages.tableEditButton}`}
                  onClick={() => onEdit(schedule)}
                >
                  Редактировать
                </button>
              </td>
              <td>
                <button
                  class={`${pages.tableActionButton} ${pages.tableDeleteButton}`}
                  onClick={() => onDelete(schedule)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
