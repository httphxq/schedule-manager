import styles from '../../pages.module.css'
import { handlers } from '../../../core/handlers'
import { render } from '../../../core/render'
import GroupsPage from '../GroupsPage'
import { updateGroup } from '../../../api/groups'
import { ui } from '../../../utils/dom'

export default function UpdateGroupForm({ group }) {
  const onSubmit = async (e) => {
    const formData = new FormData(e.target)
    const data = {
      name: formData.get('name'),
      abbreviation: formData.get('abbreviation'),
      yearOfAdmission: formData.get('yearOfAdmission'),
      id: group.id,
    }
    const result = await updateGroup(data)
    ui.closeModal()
    ui.showFlashMessage(result)
    render('#main', <GroupsPage />)
  }

  return (
    <form class={styles.form} onSubmit={onSubmit} id="updateGroupForm">
      <h3>Редактировать группу</h3>
      <div>
        <label htmlFor="name">ФИО:</label>
        <input type="text" id="name" name="name" required value={group.name} />
      </div>
      <div>
        <label htmlFor="yearOfAdmission">Сокращение:</label>
        <input type="text" id="yearOfAdmission" name="yearOfAdmission" required value={group.yearOfAdmission} />
      </div>
      <div>
        <label htmlFor="abbreviation">Должность:</label>
        <input type="text" id="abbreviation" name="abbreviation" value={group.abbreviation} />
      </div>
      <button type="submit">Редактировать</button>
    </form>
  )
}
