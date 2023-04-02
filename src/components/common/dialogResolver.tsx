import { DIALOG_NAMES } from '../../constants/dialogNames';
import ExceptionDialogForm from '../exception/components/exceptionForm';

const dialogs = {
  [DIALOG_NAMES.exceptionDialog]: {
    title: 'Add Exception',
    size: 'xl',
    name: DIALOG_NAMES.exceptionDialog,
    dialogBody: ExceptionDialogForm,
    isAddForm: true,
  },
  [DIALOG_NAMES.editExceptionDialog]: {
    title: 'Edit Exception',
    size: 'xl',
    name: DIALOG_NAMES.exceptionDialog,
    dialogBody: ExceptionDialogForm,
    isAddForm: false,
  },
};

export function getDialogConfigByName(name: string) {
  return dialogs[name];
}
