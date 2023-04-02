import React from 'react';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import fieldStyle from './fieldStyle';

interface Props {
  min: any;
  max: any;
  step: any;
  value: number | number[];
  label: string;
  inputType?: string;
  touched: any;
  errors: any;
  name: string;
  onChange: any;
}

function SliderValueField(props: Props) {
  const { min, max, step, label, value, inputType, touched, errors, name, onChange } = props;
  const classes = fieldStyle();

  switch (inputType) {
    case 'number':
      return (
        <div className={classes.input}>
          <TextField
            label={label}
            type="number"
            id="number-input"
            variant="outlined"
            size="small"
            name={name}
            value={value}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: step,
              min: min,
              max: max,
            }}
            onChange={onChange}
            helperText={(touched[name] && errors[name]) || ''}
            error={touched[name] && Boolean(errors[name])}
          />
        </div>
      );
    default:
      return (
        <div className={classes.input}>
          <Typography gutterBottom>{label}</Typography>
          <Slider
            id="slider"
            name="value"
            min={min}
            max={max}
            value={value}
            marks={[
              { value: min, label: min },
              { value: max, label: max },
            ]}
            valueLabelDisplay="auto"
            aria-labelledby="continuous-slider"
            onChange={onChange}
          />
        </div>
      );
  }
}

export default SliderValueField;
