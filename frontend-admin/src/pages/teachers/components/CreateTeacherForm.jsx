import styles from '../../pages.module.css'
import { createTeacher } from '../../../api/teachers'
import { render } from '../../../core/render'
import TeachersPage from '../TeachersPage'
import { ui } from '../../../utils/dom'

export default function CreateTeacherForm() {
  const onSubmit = async (e) => {
    const formData = new FormData(e.target)
    const data = {
      fio: formData.get('fio'),
      abbr: formData.get('abbr'),
      position: formData.get('position'),
    }
    const result = await createTeacher(data)
    ui.closeModal()
    ui.showFlashMessage(result)
    render('#main', <TeachersPage />)
  }

  return (
    <form class={styles.form} onSubmit={onSubmit}>
      <h3>Добавить преподавателя</h3>
      <div>
        <label htmlFor="fio">ФИО:</label>
        <input type="text" id="fio" name="fio" required />
      </div>
      <div>
        <label htmlFor="abbr">Сокращение:</label>
        <input type="text" id="abbr" name="abbr" required />
      </div>
      <div>
        <label htmlFor="position">Должность:</label>
        <input type="text" id="position" name="position" />
      </div>
      <button type="submit">Добавить</button>
    </form>
  )
}
