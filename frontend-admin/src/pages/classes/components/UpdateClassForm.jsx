import styles from '../../pages.module.css'
import { render } from '../../../core/render'
import ClassesPage from '../ClassesPage'
import { updateClass } from '../../../api/classes'
import { ui } from '../../../utils/dom'

export default function UpdateClassForm({ classItem }) {
  const onSubmit = async (e) => {
    const formData = new FormData(e.target)
    const capacity = formData.get('capacity')
    const data = {
      name: formData.get('name'),
      abbreviation: formData.get('abbreviation'),
      capacity: capacity ? Number(capacity) : null,
      building: formData.get('building'),
      id: classItem.id,
    }
    const result = await updateClass(data)
    ui.closeModal()
    ui.showFlashMessage(result)
    render('#main', <ClassesPage />)
  }

  return (
    <form class={styles.form} onSubmit={onSubmit} id="updateClassForm">
      <h3>Редактировать аудиторию</h3>
      <div>
        <label htmlFor="name">Название:</label>
        <input type="text" id="name" name="name" required value={classItem.name} />
      </div>
      <div>
        <label htmlFor="abbreviation">Сокращение:</label>
        <input type="text" id="abbreviation" name="abbreviation" value={classItem.abbreviation} />
      </div>
      <div>
        <label htmlFor="capacity">Количество мест:</label>
        <input type="number" id="capacity" name="capacity" min="0" value={classItem.capacity} />
      </div>
      <div>
        <label htmlFor="building">Корпус:</label>
        <input type="text" id="building" name="building" value={classItem.building} />
      </div>
      <button type="submit">Редактировать</button>
    </form>
  )
}
