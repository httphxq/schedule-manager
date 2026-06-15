import { fetchSchedules } from '../api/schedules';

const globalState = {
  _currentScheduleId: null,
  getCurrentScheduleId: function () {
    return this._currentScheduleId;
  },
  setCurrentScheduleId: function (id) {
    this._currentScheduleId = Number(id);
  },
};

export async function initializeGlobalState() {
  if (globalState.getCurrentScheduleId() !== null) {
    return;
  }

  const schedules = await fetchSchedules();

  if (schedules.length === 0) {
    return;
  }

  globalState.setCurrentScheduleId(schedules[0].id);
}

export default globalState;
