import styles from '../../pages.module.css'
import { render } from '../../../core/render'
import ClassesPage from '../ClassesPage'
import { createClass } from '../../../api/classes'
import { ui } from '../../../utils/dom'

export default function CreateClassForm() {
  const onSubmit = async (e) => {
    const formData = new FormData(e.target)
    const capacity = formData.get('capacity')
    const data = {
      name: formData.get('name'),
      abbreviation: formData.get('abbreviation'),
      capacity: capacity ? Number(capacity) : null,
      building: formData.get('building'),
    }
    const result = await createClass(data)
    ui.closeModal()
    ui.showFlashMessage(result)
    render('#main', <ClassesPage />)
  }

  return (
    <form class={styles.form} onSubmit={onSubmit}>
      <h3>Добавить аудиторию</h3>
      <div>
        <label htmlFor="name">Название:</label>
        <input type="text" id="name" name="name" required />
      </div>
      <div>
        <label htmlFor="abbreviation">Сокращение:</label>
        <input type="text" id="abbreviation" name="abbreviation" />
      </div>
      <div>
        <label htmlFor="capacity">Количество мест:</label>
        <input type="number" id="capacity" name="capacity" min="0" />
      </div>
      <div>
        <label htmlFor="building">Корпус:</label>
        <input type="text" id="building" name="building" />
      </div>
      <button type="submit">Добавить</button>
    </form>
  )
}
