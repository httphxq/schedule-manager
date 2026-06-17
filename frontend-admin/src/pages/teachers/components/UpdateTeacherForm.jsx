import styles from '../../pages.module.css'
import { updateTeacher } from '../../../api/teachers'
import { render } from '../../../core/render'
import TeachersPage from '../TeachersPage'
import { ui } from '../../../utils/dom'

export default function UpdateTeacherForm({ closeId, teacher }) {
  const onSubmit = async (e) => {
    const formData = new FormData(e.target)
    const data = {
      fio: formData.get('fio'),
      abbr: formData.get('abbr'),
      position: formData.get('position'),
      id: teacher.id,
    }
    const result = await updateTeacher(data)
    ui.closeModal()
    ui.showFlashMessage(result)
    render('#main', <TeachersPage />)
  }

  return (
    <form class={styles.form} onSubmit={onSubmit} id="updateTeacherForm">
      <h3>Редактировать преподавателя</h3>
      <div>
        <label htmlFor="fio">ФИО:</label>
        <input type="text" id="fio" name="fio" required value={teacher.name} />
      </div>
      <div>
        <label htmlFor="abbr">Сокращение:</label>
        <input type="text" id="abbr" name="abbr" required value={teacher.fio} />
      </div>
      <div>
        <label htmlFor="position">Должность:</label>
        <input type="text" id="position" name="position" value={teacher.position} />
      </div>
      <button type="submit">Редактировать:</button>
    </form>
  )
}
