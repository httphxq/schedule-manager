import pages from '../../pages.module.css'
import styles from './ScheduleForm.module.css'
import { updateSchedule } from '../../../api/schedules'
import { render } from '../../../core/render'
import SchedulesPage from '../SchedulesPage'
import { ui } from '../../../utils/dom'

export default function UpdateScheduleForm({ closeId, schedule }) {
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const setScheduleType = (e) => {
    const startDateInput = document.querySelector('#startDate')
    const scheduleType = e.target.value
    scheduleType === 'period'
      ? startDateInput.classList.remove('hidden')
      : startDateInput.classList.add('hidden')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    const weekdays = formData.getAll('weekdays').map(Number)

    const data = {
      id: schedule.id,
      name: formData.get('name'),
      lessonsInDay: parseInt(formData.get('lessonsInDay')),
      type: formData.get('type'),
      startDate: formData.get('startDate') || null,
      weekdays: weekdays,
    }

    const result = await updateSchedule(data)
    ui.closeModal()
    ui.showFlashMessage(result)
    render('#main', <SchedulesPage />)
  }

  const isChecked = (day) => schedule.weekdays?.includes(day)
  const isPeriod = schedule.type === 'period'

  return (
    <form class={pages.form} onSubmit={onSubmit} id="updateScheduleForm">
      <h3>Редактировать расписание</h3>

      <div>
        <label htmlFor="name">Название расписания</label>
        <input type="text" id="name" name="name" placeholder="Название расписания" required value={schedule.name} />
      </div>

      <div>
        <label htmlFor="lessonsInDay">Количество пар в день</label>
        <input type="number" id="lessonsInDay" name="lessonsInDay" placeholder="Количество пар в день" required min="1" max="8" value={schedule.lessonsInDay} />
      </div>

      <label htmlFor="type">Тип расписания:</label>
      <select name="type" id="type" onChange={(e) => setScheduleType(e)} required>
        <option value="template" selected={schedule.type === 'template'}>Шаблон</option>
        <option value="period" selected={schedule.type === 'period'}>Период</option>
      </select>

      <label name="startDate" id="startDate" class={isPeriod ? '' : 'hidden'}>
        Дата начала:
        <input 
          type="date" 
          name="startDate" 
          value={formatDateForInput(schedule.start_date)} 
        />
      </label>

      <fieldset class={styles.weekdays}>
        <label><input type="checkbox" name="weekdays" value="1" checked={isChecked(1)} /> Пн</label>
        <label><input type="checkbox" name="weekdays" value="2" checked={isChecked(2)} /> Вт</label>
        <label><input type="checkbox" name="weekdays" value="3" checked={isChecked(3)} /> Ср</label>
        <label><input type="checkbox" name="weekdays" value="4" checked={isChecked(4)} /> Чт</label>
        <label><input type="checkbox" name="weekdays" value="5" checked={isChecked(5)} /> Пт</label>
        <label><input type="checkbox" name="weekdays" value="6" checked={isChecked(6)} /> Сб</label>
        <label><input type="checkbox" name="weekdays" value="7" checked={isChecked(7)} /> Вс</label>
      </fieldset>

      <button type="submit">Редактировать</button>
    </form>
  )
}