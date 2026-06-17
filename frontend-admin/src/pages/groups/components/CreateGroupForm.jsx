import styles from '../../pages.module.css'
import { handlers, registerSubmit } from '../../../core/handlers'
import { render } from '../../../core/render'
import GroupsPage from '../GroupsPage'
import { createGroup } from '../../../api/groups'
import { ui } from '../../../utils/dom'

export default function CreateGroupForm() {
  const onSubmit = async (e) => {
    const formData = new FormData(e.target)
    const data = {
      name: formData.get('name'),
      abbreviation: formData.get('abbreviation'),
      yearOfAdmission: formData.get('yearOfAdmission'),
    }
    const result = await createGroup(data)
    ui.closeModal()
    ui.showFlashMessage(result)
    render('#main', <GroupsPage />)
  }

  return (
    <form class={styles.form} onSubmit={onSubmit}>
    <h3>Добавить группу</h3>
    <div>
      <label htmlFor="name">Название группы:</label>
      <input type="text" id="name" name="name" required />
    </div>
    <div>
      <label htmlFor="yearOfAdmission">Год поступления:</label>
      <input type="text" id="yearOfAdmission" name="yearOfAdmission" required />
    </div>
    <div>
      <label htmlFor="abbreviation">Сокращение:</label>
      <input type="text" id="abbreviation" name="abbreviation" />
    </div>
    <button type="submit">Добавить</button>
  </form>
  )
}
