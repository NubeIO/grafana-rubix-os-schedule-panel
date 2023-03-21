import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import _cloneDeep from 'lodash/cloneDeep';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';

import { PanelOptions, RawData } from 'types';
import { Exception } from 'components/exception/exception.model';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import ColorSelectorField from '../../common/colorSelectorField';
import SliderValueField from 'components/common/sliderValueField';
import DateSelectorField from 'components/common/dateSelectorField';
import * as exceptionService from 'components/exception/exception.service';
import exceptionFormValidation from 'components/exception/exception.validation';
import { createFilterOptions } from '@material-ui/lab/useAutocomplete';
import AutoCompleteSelectField from 'components/common/autoCompleteSearchField';
import { DATE_FORMAT } from 'components/EventModal';
import moment from 'moment-timezone';
import DateRangeCollection from 'components/DateRangeCollection';

interface Props {
  id: string;
  dialogTitle: string;
  isAddForm: boolean | undefined;
  initialValues: any;
  onSubmit: (exception: any) => void;
  onDelete: (e: any) => void;
  onClose: () => void;
  options: PanelOptions;
  scheduleNames: string[];
  defaultScheduleName: undefined | string;
  updateScheduleName: (action: string, value: string) => void;
}

const autoCompleteFilter = createFilterOptions<string>();

function ExceptionFormUi(props: Props) {
  const { id, dialogTitle, isAddForm, initialValues, onSubmit, onClose, onDelete, options, scheduleNames } = props;

  const [value, setValue] = useState(0);

  const forceUpdate = () => {
    setValue(value + 1);
  };
  return (
    <Formik initialValues={initialValues} validationSchema={exceptionFormValidation(options)} onSubmit={onSubmit}>
      {function ({ values, setFieldValue, handleChange, setFieldError, errors, setErrors, touched, isValid }) {

        const defaultProps: any = {
          variant: 'outlined',
          size: 'small',
          onChange: (e: any) => handleChange(e),
        };
        return (
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
                  }} />
                <DateRangeCollection
                  {...defaultProps}
                  inputDates={values.dates}
                  onChange={(eventDates, error) => {
                    setFieldValue('dates', eventDates);
                    if (error) {
                      setFieldError('dates', error);
                      forceUpdate();
                    } else if (errors.dates != null) {
                      delete errors.dates;
                      setErrors(errors);
                      forceUpdate();
                    }
                  }}
                  onBlur={() => {}} />
                <SliderValueField
                  min={options.min}
                  max={options.max}
                  step={options.step}
                  label="Value"
                  errors={errors}
                  touched={touched}
                  value={values.value}
                  name="value"
                  onChange={(e: any, v: any) => setFieldValue('value', v)} />
                <ColorSelectorField
                  name="holiday-color-field"
                  value={values.color}
                  onChange={(color: string) => setFieldValue('color', color)} />
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
        );
      }}
    </Formik>
  );
}

const getInitialFormValues = (isAddForm: boolean | undefined, exception: Exception, defaultValues: any = {}, timezone: string) => {
  if (isAddForm) {
    return {
      id: null,
      name: defaultValues.name || null,
      dates: [
        {
          start: moment.tz(moment(), timezone).format(DATE_FORMAT),
          end: moment.tz(moment(), timezone).add(1, 'hour').format(DATE_FORMAT),
        },
      ],
      value: defaultValues.value || defaultValues.min,
      color: '',
    };
  }

  return {
    id: exception.id,
    name: exception.name,
    dates: exception.dates,
    value: exception.value,
    color: exception.color,
  };
};

interface ExceptionFormProps {
  syncData: any;
  value: RawData;
  closeGenericDialog: () => void;
  isAddForm: boolean | undefined;
  exception: Exception;
  id: string;
  dialogTitle: string;
  initialValues: any;
  onSubmit: (exception: Exception) => void;
  onClose: () => void;
  onEdit: () => void;
  options: PanelOptions;
  scheduleNames: string[];
  defaultScheduleName: undefined | string;
  updateScheduleName: (action: string, value: string) => void;
}

function ExceptionForm(props: ExceptionFormProps) {
  function handleCreateException(values: any, output: RawData) {
    const newException = exceptionService.getExceptionInstance(null, values.name, values.color, values.dates, values.value);
    const updatedData = exceptionService.updateData(newException, output);
    props.syncData(updatedData);
    props.closeGenericDialog();
  }

  function handleUpdateException(id: string, exception: Exception, output: RawData) {
    const { name, color, dates, value } = exception;
    const updatedException = exceptionService.getExceptionInstance(id, name, color, dates, value);
    props.syncData(exceptionService.updateData(updatedException, output));
    props.closeGenericDialog();
  }

  function handleDeleteException() {
    delete props.value.exception[props.exception.id];
    props.syncData(props.value);
    props.closeGenericDialog();
  }

  function onSubmit(values: Exception) {
    let output: RawData = _cloneDeep(props.value) || {};
    if (props.isAddForm) {
      return handleCreateException(values, output);
    }
    handleUpdateException(props.exception.id, values, output);
  }

  const initialFormValues = getInitialFormValues(props.isAddForm, props.exception, {
    name: props.defaultScheduleName,
    value: props.options.default || props.options.min,
  }, props.options.timezone);

  return (
    <ExceptionFormUi {...props} onSubmit={onSubmit} onDelete={handleDeleteException} initialValues={initialFormValues} />
  );
}

export default ExceptionForm;
