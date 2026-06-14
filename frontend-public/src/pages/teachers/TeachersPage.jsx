import BreadCrumbs from '../../components/BreadCrumbs.jsx'
import Title from '../../components/Title.jsx'
import { fetchTeachers } from '../../lib/api.js'
import TeacherName from './components/Teacher.jsx'
import styles from './TeachersPage.module.css'

const groupTeachersBySurnameLetter = (teachers) => {
  const groups = teachers.reduce((acc, teacher) => {
    const fio = teacher.fio.trim()
    const letter = fio[0].toLocaleUpperCase('ru')

    if (!acc[letter]) {
      acc[letter] = []
    }

    acc[letter].push({ ...teacher, fio })
    return acc
  }, {})

  return Object.keys(groups)
    .sort((firstLetter, secondLetter) => firstLetter.localeCompare(secondLetter, 'ru'))
    .map(letter => ({
      letter,
      teachers: groups[letter].sort((firstTeacher, secondTeacher) => firstTeacher.fio.localeCompare(secondTeacher.fio, 'ru')),
    }))
}

export default async function TeachersPage() {
  const teachers = await fetchTeachers()
  const groupedTeachers = groupTeachersBySurnameLetter(teachers)

  return (
    <div>
      <BreadCrumbs crumbs={[{ type: 'ref', href: '/public/teachers', text: 'Преподаватели' }]} />
      <Title text="Преподаватели" />
      <div class={styles.teachersByLetter}>
        {groupedTeachers.map(group => (
          <section class={styles.teacherLetterSection}>
            <h2 class={styles.teacherLetter}>{group.letter}</h2>
            <div class={styles.teacherList}>
              {group.teachers.map(teacher => <TeacherName {...teacher} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}