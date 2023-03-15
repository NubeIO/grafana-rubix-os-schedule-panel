import React from 'react';
import { DatePicker } from '@material-ui/pickers';

import fieldStyle from './fieldStyle';

interface Props {
  label: string;
  name: string;
  value: any;
  onChange: any;
  errors: any;
  touched: any;
}
function DateSelectorField(props: Props) {
  const { label, name, value, onChange, errors, touched } = props;
  const classes = fieldStyle();
  return (
    <div className={classes.input}>
      <DatePicker
        fullWidth
        name={name}
        openTo="month"
        inputProps={{ readOnly: false }}
        views={['year', 'month', 'date']}
        disabled={false}
        helperText={(touched[name] && errors[name]) || ''}
        error={touched[name] && Boolean(errors[name])}
        size="small"
        label={label}
        value={value}
        variant="inline"
        onChange={onChange}
        inputVariant="outlined"
        autoOk={true}
      />
    </div>
  );
}

export default DateSelectorField;
