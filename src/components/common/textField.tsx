import React from 'react';
import MuiTextField from '@material-ui/core/TextField';

import fieldStyle from './fieldStyle';

interface Props {
  name: string;
  value: string;
  label: string;
  onChange: (e: any) => void;
  errors: any;
  touched?: any;
}

function TextField(props: Props) {
  const { name, label, value, onChange, errors, touched } = props;
  const classes = fieldStyle();

  return (
    <div className={classes.input}>
      <MuiTextField
        fullWidth
        name={name}
        size="small"
        label={label}
        value={value}
        helperText={(touched[name] && errors[name]) || ''}
        error={touched[name] && Boolean(errors[name])}
        variant="outlined"
        onChange={onChange}
        className={classes.textField}
      />
    </div>
  );
}

export default TextField;
