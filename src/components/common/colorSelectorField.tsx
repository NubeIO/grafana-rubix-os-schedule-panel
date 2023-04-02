import React from 'react';
import TextField from '@material-ui/core/TextField';
import ColorSelector from '../renderProps/ColorSelector';
import fieldStyle from './fieldStyle';

interface Props {
  name: string;
  value: string | undefined;
  onChange: (e: any) => void;
}

function ColorSelectorField(props: Props) {
  const { name, value, onChange } = props;
  const classes = fieldStyle();
  return (
    <ColorSelector defaultColor="#000" handleChange={onChange} disabled={false} visible={false}>
      {({ color: colorFromSelector, handleClick, handleChange: handleChangeFromSelector, force }) => {
        return (
          <div className={classes.input}>
            <div className={classes.colorPreview} onClick={handleClick}>
              <div style={{ backgroundColor: force ? colorFromSelector : value }} />
            </div>
            <TextField
              variant="outlined"
              size="small"
              label="Color"
              type="text"
              name={name}
              value={value}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                handleChangeFromSelector(e);
                onChange(e);
              }}
            />
          </div>
        );
      }}
    </ColorSelector>
  );
}

export default ColorSelectorField;
