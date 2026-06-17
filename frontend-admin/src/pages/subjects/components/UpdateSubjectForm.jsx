import styles from '../../pages.module.css'
import { updateSubject } from '../../../api/subjects'
import { render } from '../../../core/render'
import SubjectsPage from '../SubjectsPage'
import { ui } from '../../../utils/dom'

export default function UpdateSubjectForm({ closeId, subject }) {
  const onSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      name: formData.get('name'),
      abbreviation: formData.get('abbreviation'),
      id: subject.id,
    }
    const result = await updateSubject(data)
    ui.closeModal()
    ui.showFlashMessage(result)
    render('#main', <SubjectsPage />)
  }

  return (
    <form class={styles.form} onSubmit={onSubmit} id="updateSubjectForm">
      <h3>Редактировать предмет</h3>
      <div>
        <label htmlFor="name">Название предмета:</label>
        <input type="text" id="name" name="name" required value={subject.name} />
      </div>
      <div>
        <label htmlFor="abbreviation">Сокращение:</label>
        <input type="text" name="abbreviation" required value={subject.abbreviation || subject.abbr} />
      </div>
      <button type="submit">Редактировать</button>
    </form>
  )
}
