import { v4 as uuidv4 } from 'uuid';

export const CREATE_SCHEDULE_NAME = '@action/CREATE_SCHEDULE_NAME';
export const UPDATE_SCHEDULE_NAME = '@action/UPDATE_SCHEDULE_NAME';
export const DELETE_SCHEDULE_NAME = '@action/DELETE_SCHEDULE_NAME';

interface ScheduleName {
  id: string;
  name: string;
}

export const createScheduleName = (name = '') => ({
  type: CREATE_SCHEDULE_NAME,
  payload: {
    id: uuidv4(),
    name,
  },
});

export const deleteScheduleName = (id: string) => ({
  type: DELETE_SCHEDULE_NAME,
  payload: {
    id,
  },
});

export const updateScheduleName = (scheduleName: ScheduleName) => ({
  type: UPDATE_SCHEDULE_NAME,
  payload: {
    id: scheduleName.id,
    name: scheduleName.name,
  },
});
