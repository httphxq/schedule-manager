import { lessonsQueries } from '../db/queries/lessons.js';

export const getLessonsByScheduleId = async (fastify, scheduleId) => {
  const client = await fastify.pg.connect();
  try {
    const { rows: lessons } = await client.query(
      lessonsQueries.getByScheduleId,
      [scheduleId],
    );

    const { rows: scheduleInfo } = await client.query(`
      SELECT id, name, lessons_in_day as "lessonsInDay", weekdays, start_date as "startDate"
      FROM schedules
      WHERE id = $1
    `, [scheduleId]);

    if (!scheduleInfo[0]) {
      return { type: 'error', message: 'Неизвестное расписание' };
    }

    const { rows: groups } = await client.query(`
      SELECT id, name, abbreviation
      FROM groups
      ORDER BY name
    `);

    const { rows: subjects } = await client.query(`
      SELECT id, name, abbreviation
      FROM subjects
      ORDER BY name
    `);

    const { rows: teachers } = await client.query(`
      SELECT id, fio, position, color
      FROM teachers
      ORDER BY fio
    `);

    const { rows: workloads } = await client.query(`
      SELECT 
        w.id,
        w.schedule_id as "scheduleId",
        w.group_id as "groupId",
        g.name as "groupName",
        g.abbreviation as "groupAbbr",
        w.teacher_id as "teacherId",
        t.fio as "teacherName",
        w.subject_id as "subjectId",
        s.name as "subjectName",
        s.abbreviation as "subjectAbbr",
        w.lessons_per_week as "lessonsPerWeek"
      FROM workloads w
      JOIN groups g ON w.group_id = g.id
      JOIN teachers t ON w.teacher_id = t.id
      JOIN subjects s ON w.subject_id = s.id
      WHERE w.schedule_id = $1
      ORDER BY g.name, s.name
    `, [scheduleId]);

    return {
      schedule: scheduleInfo[0],
      lessons,
      groups,
      subjects,
      teachers,
      workloads,
    };
  }
  finally {
    client.release();
  }
};

export const setLesson = async (fastify, data) => {
  const client = await fastify.pg.connect();

  try {
    const { rows: [existing] } = await client.query(
      lessonsQueries.findByCell,
      [data.scheduleId, data.weekday, data.lessonNumber, data.groupId],
    );

    if (existing) {
      return { type: 'error', message: 'Эта ячейка уже занята' };
    }

    const { rows: [workload] } = await client.query(
      lessonsQueries.getWorkloadData,
      [data.workloadId],
    );

    if (!workload) {
      return { type: 'error', message: 'Нагрузка не найдена' };
    }

    const insertResult = await client.query(lessonsQueries.create, [
      data.scheduleId,
      data.weekday,
      data.lessonNumber,
      data.classroom || null,
      workload.group_id,
      workload.group_name,
      workload.teacher_id,
      workload.teacher_name,
      workload.subject_id,
      workload.subject_name,
      workload.subject_abbr,
    ]);

    // Обновляем updated_at у расписания
    await client.query(
      'UPDATE schedules SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [data.scheduleId],
    );

    return {
      type: 'success',
      message: 'Урок добавлен!',
      id: insertResult.rows[0].id,
    };
  }
  catch (error) {
    console.error('Error setting lesson:', error);
    return { type: 'error', message: error.message };
  }
  finally {
    client.release();
  }
};

export const deleteLesson = async (fastify, lessonId) => {
  const client = await fastify.pg.connect();
  try {
    await client.query(lessonsQueries.delete, [lessonId]);
    return { type: 'success', message: 'Урок удалён из расписания!' };
  }
  catch (error) {
    console.error('Error deleting lesson:', error);
    return { type: 'error', message: error.message };
  }
  finally {
    client.release();
  }
};
