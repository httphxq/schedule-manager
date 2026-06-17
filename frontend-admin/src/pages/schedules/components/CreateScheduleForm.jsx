import pages from '../../pages.module.css'
import styles from './ScheduleForm.module.css'
import { createSchedule } from '../../../api/schedules'
import { render } from '../../../core/render'
import SchedulesPage from '../SchedulesPage'
import { ui } from '../../../utils/dom'

export default function CreateScheduleForm({ type }) {

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
      name: formData.get('name'),
      lessonsInDay: parseInt(formData.get('lessonsInDay')),
      type: formData.get('type'),
      startDate: formData.get('startDate') || null,
      weekdays: weekdays,
    }
  
    const result = await createSchedule(data)
    ui.closeModal()
    ui.showFlashMessage(result)
    render('#main', <SchedulesPage />)
  }

  return (
    <form class={pages.form} onSubmit={onSubmit}>
      <h3>Добавить расписание</h3>

      <div>
        <label htmlFor="name">Название расписания</label>
        <input type="text" id="name" name="name" placeholder="Название расписания" required />
      </div>

      <div>
        <label htmlFor="lessonsInDay">Количество пар в день</label>
        <input type="number" id="lessonsInDay" name="lessonsInDay" placeholder="Количество пар в день" required min="1" max="8" />
      </div>

      <label htmlFor="type">Тип расписания:</label>
      <select name="type" id='type' onChange={(e) => setScheduleType(e)} required>
        <option value="template">Шаблон</option>
        <option value="period">Период</option>
      </select>

      <label name="startDate" id="startDate" class="hidden">
        Дата начала:
        <input type="date" name="startDate"/>
      </label>

      <fieldset class={styles.weekdays}>
        <label><input type="checkbox" checked name="weekdays" value="1" /> Пн</label>
        <label><input type="checkbox" checked name="weekdays" value="2" /> Вт</label>
        <label><input type="checkbox" checked name="weekdays" value="3" /> Ср</label>
        <label><input type="checkbox" checked name="weekdays" value="4" /> Чт</label>
        <label><input type="checkbox" checked name="weekdays" value="5" /> Пт</label>
        <label><input type="checkbox" name="weekdays" value="6" /> Сб</label>
        <label><input type="checkbox" name="weekdays" value="7" /> Вс</label>
      </fieldset>

      <button type="submit">Добавить</button>
    </form >
  )
}
