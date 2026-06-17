import styles from '../../pages.module.css'
import { createSubject } from '../../../api/subjects'
import { render } from '../../../core/render'
import SubjectsPage from '../SubjectsPage'
import { ui } from '../../../utils/dom'

export default function CreateSubjectForm({ closeId }) {
  const onSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      name: formData.get('name'),
      abbreviation: formData.get('abbreviation'),
    }
    const result = await createSubject(data)
    ui.closeModal()
    ui.showFlashMessage(result)
    render('#main', <SubjectsPage />)
  }

  return (
    <form class={styles.form} onSubmit={onSubmit}>
      <h3>Добавить предмет</h3>
      <div>
        <label htmlFor="name">Название предмета:</label>
        <input type="text" id="name" name="name" required />
      </div>
      <div>
        <label htmlFor="abbreviation">Сокращение:</label>
        <input type="text" id="abbreviation" name="abbreviation" required />
      </div>
      <button type="submit">Добавить</button>
    </form>
  )
}
