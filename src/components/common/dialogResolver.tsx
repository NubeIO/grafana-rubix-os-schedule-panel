import { DIALOG_NAMES } from '../../constants/dialogNames';
import HolidayDialogForm from '../holiday/components/holidayForm';

const dialogs = {
  [DIALOG_NAMES.holidayDialog]: {
    title: 'Add Holiday',
    size: 'xl',
    name: DIALOG_NAMES.holidayDialog,
    dialogBody: HolidayDialogForm,
    isAddForm: true,
  },
  [DIALOG_NAMES.editHolidayDialog]: {
    title: 'Edit Holiday',
    size: 'xl',
    name: DIALOG_NAMES.holidayDialog,
    dialogBody: HolidayDialogForm,
    isAddForm: false,
  },
};

export function getDialogConfigByName(name: string) {
  return dialogs[name];
}
