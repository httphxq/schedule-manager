import SidebarCategory from './SidebarCategory.jsx'
import styles from './Sidebar.module.css'
import { redirect } from '../core/router.js'
import store from '../state/store.js'
import {
  MenuIcon, ScheduleIcon, GridIcon, BellIcon,
  GroupsIcon, BookIcon, TeacherIcon, DoorIcon, PublishIcon,
} from './icons.jsx'

export default function Sidebar() {
  const { currentScheduleId } = store
  const { pathname } = new URL(window.location.href)

  const handleClick = (e, path) => {
    const sidebarButtons = document.querySelectorAll('.sidebarBtn')
    sidebarButtons.forEach((btn) => btn.classList.remove('activeNavBtn'))
    e.target.closest('.sidebarBtn').classList.add('activeNavBtn')
    redirect(path)
  }

  const toggleSidebar = () => {
    document.getElementById('sidebarContainer').classList.toggle('collapsed')
  }

  return (
    <>
      <button class={styles.toggle} onClick={toggleSidebar} aria-label="Свернуть меню">
        <MenuIcon />
      </button>
      <ol class={styles.list}>
        <SidebarCategory icon={<ScheduleIcon />} text="Расписания" handler={(e) => handleClick(e, "/admin/schedules")} isActive={pathname.startsWith("/admin/schedules")} />
        <SidebarCategory icon={<GridIcon />} text="Сетка уроков" handler={(e) => handleClick(e, `/admin/lessons/${currentScheduleId}`)} isActive={pathname.startsWith("/admin/lessons")} />
        <SidebarCategory icon={<BellIcon />} text="Звонки" handler={(e) => handleClick(e, `/admin/bells/${currentScheduleId}`)} isActive={pathname.startsWith("/admin/bells")} />
        <SidebarCategory icon={<GroupsIcon />} text="Группы" handler={(e) => handleClick(e, "/admin/groups")} isActive={pathname.startsWith("/admin/groups")} />
        <SidebarCategory icon={<BookIcon />} text="Предметы" handler={(e) => handleClick(e, "/admin/subjects")} isActive={pathname.startsWith("/admin/subjects")} />
        <SidebarCategory icon={<TeacherIcon />} text="Преподаватели" handler={(e) => handleClick(e, "/admin/teachers")} isActive={pathname.startsWith("/admin/teachers")} />
        <SidebarCategory icon={<DoorIcon />} text="Аудитории" handler={(e) => handleClick(e, "/admin/classes")} isActive={pathname.startsWith("/admin/classes")} />
        <SidebarCategory icon={<PublishIcon />} text="Публикация" handler={(e) => handleClick(e, "/admin/publication")} isActive={pathname.startsWith("/admin/publication")} />
      </ol>
    </>
  )
}
