export default {
  _cursorStatus: 'idle',
  getCursorStatus: function () {
    return this._cursorStatus;
  },
  setCursorStatus: function (newStatus) {
    this._cursorStatus = newStatus;
  },

  _selectedGroupId: null,
  getSelectedGroupId: function () {
    return this._selectedGroupId;
  },
  setSelectedGroupId: function (groupId) {
    this._selectedGroupId = groupId;
  },

  _selectedWorkloadId: null,
  getSelectedWorkloadId: function () {
    return this._selectedWorkloadId;
  },
  setSelectedWorkloadId: function (workloadId) {
    this._selectedWorkloadId = workloadId;
  },

  _selectedWorkload: null,
  getSelectedWorkload: function () {
    return this._selectedWorkload;
  },
  setSelectedWorkload: function (workload) {
    this._selectedWorkload = workload;
  },

  _selectedLessonsId: null,
  getSelectedLessonId: function () {
    return this._selectedLessonId;
  },
  setSelectedLessonId: function (lessonId) {
    this._selectedLessonId = lessonId;
  },

  clearCursorStatus: function () {
    this.setCursorStatus('idle');
    this.setSelectedGroupId(null);
    this.setSelectedLessonId(null);
    this.setSelectedWorkloadId(null);
  },
};
