import React from 'react';
import { Form, Formik } from 'formik';
import _cloneDeep from 'lodash/cloneDeep';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';

import { PanelOptions, RawData } from 'types';
import { Holiday } from 'components/holiday/holiday.model';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import ColorSelectorField from '../../common/colorSelectorField';
import SliderValueField from 'components/common/sliderValueField';
import DateSelectorField from 'components/common/dateSelectorField';
import * as holidayService from 'components/holiday/holiday.service';
import holidayFormValidation from 'components/holiday/holiday.validation';
import { createFilterOptions } from '@material-ui/lab/useAutocomplete';
import AutoCompleteSelectField from 'components/common/autoCompleteSearchField';

interface Props {
  id: string;
  dialogTitle: string;
  isAddForm: boolean | undefined;
  initialValues: any;
  onSubmit: (holiday: any) => void;
  onDelete: (e: any) => void;
  onClose: () => void;
  options: PanelOptions;
  scheduleNames: string[];
  defaultScheduleName: undefined | string;
  updateScheduleName: (action: string, value: string) => void;
}

const autoCompleteFilter = createFilterOptions<string>();

function HolidayFormUi(props: Props) {
  const { id, dialogTitle, isAddForm, initialValues, onSubmit, onClose, onDelete, options, scheduleNames } = props;

  return (
    <Formik initialValues={initialValues} validationSchema={holidayFormValidation(options)} onSubmit={onSubmit}>
      {({ values, setFieldValue, errors, touched, isValid }) => (
        <Form>
          <DialogTitle id={id}>{dialogTitle}</DialogTitle>
          <DialogContent>
            <form>
              <AutoCompleteSelectField
                options={scheduleNames}
                name="name"
                label="Schedule Name"
                value={values.name}
                touched={touched}
                errors={errors}
                autoCompleteFilter={autoCompleteFilter}
                onChange={(e: any, value: string) => {
                  setFieldValue('name', value);
                }}
              />
              <DateSelectorField
                name="date"
                label="Date"
                value={values.date}
                errors={errors}
                touched={touched}
                onChange={(date: any) => setFieldValue('date', date)}
              />
              <SliderValueField
                min={options.min}
                max={options.max}
                step={options.step}
                label="Value"
                errors={errors}
                touched={touched}
                value={values.value}
                name="value"
                onChange={(e: any, v: any) => setFieldValue('value', v)}
              />
              <ColorSelectorField
                name="holiday-color-field"
                value={values.color}
                onChange={(color: string) => setFieldValue('color', color)}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
            {!isAddForm && (
              <Button variant="outlined" color="secondary" onClick={onDelete}>
                Delete
              </Button>
            )}
            <Button variant="outlined" color="primary" type="submit" disabled={!isValid}>
              Save
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
}

const getInitialFormValues = (isAddForm: boolean | undefined, holiday: Holiday, defaultValues: any = {}) => {
  if (isAddForm) {
    return {
      id: null,
      name: defaultValues.name || null,
      date: null,
      value: defaultValues.value || null,
      color: '',
    };
  }

  return {
    id: holiday.id,
    name: holiday.name,
    date: holiday.date,
    value: holiday.value,
    color: holiday.color,
  };
};

interface HolidayFormProps {
  syncData: any;
  value: RawData;
  closeGenericDialog: () => void;
  isAddForm: boolean | undefined;
  holiday: Holiday;
  id: string;
  dialogTitle: string;
  initialValues: any;
  onSubmit: (holiday: Holiday) => void;
  onClose: () => void;
  onEdit: () => void;
  options: PanelOptions;
  scheduleNames: string[];
  defaultScheduleName: undefined | string;
  updateScheduleName: (action: string, value: string) => void;
}

function HolidayForm(props: HolidayFormProps) {
  function handleCreateHoliday(values: any, output: RawData) {
    const newHoliday = holidayService.getHolidayInstance(null, values.name, values.color, values.date, values.value);
    const updatedData = holidayService.updateData(newHoliday, output);
    props.syncData(updatedData);
    props.closeGenericDialog();
  }

  function handleUpdateHoliday(id: string, holiday: Holiday, output: RawData) {
    const { name, color, date, value } = holiday;
    const updatedHoliday = holidayService.getHolidayInstance(id, name, color, date, value);
    props.syncData(holidayService.updateData(updatedHoliday, output));
    props.closeGenericDialog();
  }

  function handleDeleteHoliday() {
    delete props.value.holiday[props.holiday.id];
    props.syncData(props.value);
    props.closeGenericDialog();
  }

  function onSubmit(values: Holiday) {
    let output: RawData = _cloneDeep(props.value) || {};
    if (props.isAddForm) {
      return handleCreateHoliday(values, output);
    }
    handleUpdateHoliday(props.holiday.id, values, output);
  }

  const initialFormValues = getInitialFormValues(props.isAddForm, props.holiday, {
    name: props.defaultScheduleName,
    value: props.options.default || props.options.min,
  });

  return (
    <HolidayFormUi {...props} onSubmit={onSubmit} onDelete={handleDeleteHoliday} initialValues={initialFormValues} />
  );
}

export default HolidayForm;
