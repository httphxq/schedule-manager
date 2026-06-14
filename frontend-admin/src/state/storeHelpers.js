import store from './store';

export const setLessonsUiState = (status) => {
  store.ui.lessons.status = status;
};

export const dispatchLessonClick = () => {
};
