import * as Yup from 'yup';
import { PanelOptions } from 'types';

const FORM_SCHEMA = {
  name: Yup.string().required('Title is required').nullable(),
  date: Yup.date().required('Date is required').nullable(),
  value: (min: number, max: number) => {
    if (min && max) {
      return Yup.number().min(min, `Should be higher than ${min}`).max(max, `Should be lower than ${max}`).nullable();
    }
    return null;
  },
};

function validate(formSchema: any): any {
  return (options: PanelOptions) =>
    Yup.object(
      Object.keys(FORM_SCHEMA).reduce((acc: any, key: string) => {
        acc[key] = typeof formSchema[key] === 'function' ? formSchema[key](options) : formSchema[key];

        return acc;
      }, {})
    );
}

export default validate(FORM_SCHEMA);
