export function getMondayDate(dateStr, offset = 0) {
  // Если дата не передана, используем сегодняшнюю
  let currentDate;
  if (dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    currentDate = new Date(year, month - 1, day);
  }
  else {
    currentDate = new Date();
  }

  const dayOfWeek = currentDate.getDay();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() - diffToMonday + (offset * 7));

  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, '0');
  const day = String(monday.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const getWeekRange = (startDate) => {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const format = date => date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return `${format(start)} - ${format(end)}`;
};

export function calcDate(startOfWeek, dayOfWeek) {
  const result = new Date(startOfWeek);
  result.setDate(result.getDate() + (dayOfWeek - 1));
  const day = String(result.getDate()).padStart(2, '0');
  const month = String(result.getMonth() + 1).padStart(2, '0');
  const year = result.getFullYear();

  return `${day}.${month}.${year}`;
}

export function calcWindow(endTime, startTime) {
  function toMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  const endMinutes = toMinutes(endTime);
  const startMinutes = toMinutes(startTime);
  const breakMinutes = startMinutes - endMinutes;

  const hours = Math.floor(breakMinutes / 60);
  const minutes = breakMinutes % 60;

  return `${hours} ч. ${minutes} минут`;
}
