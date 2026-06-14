import { publicationsQueries } from '../db/queries/publications.js';

export const getPublications = async (fastify) => {
  const client = await fastify.pg.connect();
  try {
    const { rows } = await client.query(publicationsQueries.getPublishedSchedules);
    return rows;
  }
  finally {
    client.release();
  }
};

export const getPublishedLessonsByGroup = async (fastify, groupId, date) => {
  const client = await fastify.pg.connect();
  try {
    // Получаем данные группы
    const { rows: groupData } = await client.query(`
      SELECT id, name, abbreviation
      FROM groups
      WHERE id = $1
    `, [groupId]);

    if (groupData.length === 0) {
      return { group: null, lessons: [] };
    }

    // Получаем уроки за конкретную неделю
    const { rows: lessons } = await client.query(`
      SELECT
        pl.weekday,
        pl.lesson_number as "lessonNumber",
        pl.classroom,
        pl.group_id as "groupId",
        pl.group_name as "groupName",
        pl.teacher_name as "teacherName",
        pl.subject_name as "subjectName",
        pl.subject_abbr as "subjectAbbr",
        pl.start_time as "startTime",
        pl.end_time as "endTime",
        s.start_date as "startDate"
      FROM published_lessons pl
      JOIN schedules s ON pl.schedule_id = s.id
      WHERE pl.group_id = $1
        AND s.start_date = $2::date
      ORDER BY pl.weekday, pl.lesson_number
    `, [groupId, date]);

    return {
      group: groupData[0],
      lessons: lessons,
    };
  }
  finally {
    client.release();
  }
};

export const getPublishedLessonsByTeacher = async (fastify, teacherId, date) => {
  const client = await fastify.pg.connect();
  try {
    // Получаем данные преподавателя
    const { rows: teacherData } = await client.query(`
      SELECT id, name, fio, position
      FROM teachers
      WHERE id = $1
    `, [teacherId]);

    if (teacherData.length === 0) {
      return { teacher: null, lessons: [] };
    }

    // Получаем уроки за конкретную неделю.
    // Один урок преподавателя может вестись для нескольких групп — склеиваем их в joinedGroups.
    const { rows: lessons } = await client.query(`
      SELECT
        pl.weekday,
        pl.lesson_number as "lessonNumber",
        pl.teacher_name as "teacherName",
        pl.subject_name as "subjectName",
        pl.subject_abbr as "subjectAbbr",
        pl.start_time as "startTime",
        pl.end_time as "endTime",
        s.start_date as "startDate",
        string_agg(pl.group_name, ', ' ORDER BY pl.group_name) as "joinedGroups"
      FROM published_lessons pl
      JOIN schedules s ON pl.schedule_id = s.id
      WHERE pl.teacher_id = $1
        AND s.start_date = $2::date
      GROUP BY pl.weekday, pl.lesson_number, pl.teacher_name,
               pl.subject_name, pl.subject_abbr, pl.start_time, pl.end_time, s.start_date
      ORDER BY pl.weekday, pl.lesson_number
    `, [teacherId, date]);

    return {
      teacher: teacherData[0],
      lessons: lessons,
    };
  }
  finally {
    client.release();
  }
};
export const publishSchedules = async (fastify) => {
  const client = await fastify.pg.connect();

  try {
    // Находим все расписания типа 'period', которых нет в published_lessons
    const { rows: schedules } = await client.query(`
      SELECT id, name 
      FROM schedules 
      WHERE type = 'period' 
        AND id NOT IN (SELECT DISTINCT schedule_id FROM published_lessons)
    `);

    if (schedules.length === 0) {
      return { type: 'error', message: 'Нет новых расписаний для публикации' };
    }

    await client.query('BEGIN');

    for (const schedule of schedules) {
      // Получаем расписание звонков для этого schedule
      const { rows: bells } = await client.query(`
        SELECT lesson_number, start_time, end_time
        FROM bells
        WHERE schedule_id = $1
        ORDER BY lesson_number
      `, [schedule.id]);

      const bellsMap = new Map();
      for (const bell of bells) {
        bellsMap.set(bell.lesson_number, bell);
      }

      const { rows: lessons } = await client.query(`
        SELECT 
          weekday, lesson_number, classroom,
          group_id, group_name,
          teacher_id, teacher_name,
          subject_id, subject_name, subject_abbr
        FROM schedule_lessons
        WHERE schedule_id = $1
      `, [schedule.id]);

      if (lessons.length === 0) continue;

      for (const lesson of lessons) {
        const bell = bellsMap.get(lesson.lesson_number);

        await client.query(publicationsQueries.insertPublishedLessons, [
          schedule.id, schedule.name,
          lesson.weekday, lesson.lesson_number, lesson.classroom,
          lesson.group_id, lesson.group_name,
          lesson.teacher_id, lesson.teacher_name,
          lesson.subject_id, lesson.subject_name, lesson.subject_abbr,
          bell ? bell.start_time : null,
          bell ? bell.end_time : null,
        ]);
      }
    }

    await client.query('COMMIT');
    return { type: 'success', message: 'Новые расписания опубликованы!' };
  }
  catch (error) {
    await client.query('ROLLBACK');
    console.error('Error publishing schedules:', error);
    return { type: 'error', message: error.message };
  }
  finally {
    client.release();
  }
};

export const unpublishAll = async (fastify) => {
  const client = await fastify.pg.connect();
  try {
    await client.query('DELETE FROM published_lessons');
    return { type: 'success', message: 'Все публикации удалены' };
  }
  catch (error) {
    console.error('Error deleting all publications:', error);
    return { type: 'error', message: error.message };
  }
  finally {
    client.release();
  }
};
