import React, { useState } from 'react';
import { SketchPicker } from 'react-color';

interface ColorSelectorProps {
  disabled: boolean;
  defaultColor: string;
  handleChange: (hexColor: string) => void;
  visible: boolean;
  children:
    | (({
        color,
        handleClick,
        handleChange,
        force,
      }: {
        color: string;
        handleClick: () => void;
        handleChange: (e: any) => void;
        force: boolean;
      }) => void)
    | null;
}

const defaultProps = {
  disabled: false,
  defaultColor: '',
  handleChange: () => {},
  visible: false,
  children: null,
};

export default function ColorSelector(props: ColorSelectorProps = defaultProps) {
  const [visible, setVisible] = useState(props.visible);
  const [force, setForce] = useState(false);
  const [color, setColor] = useState(props.defaultColor);

  const handleHexChange = (color: any) => {
    setColor(color.hex);
    setForce(true);
    // Required cause can't set value in form directly
    props.handleChange(color.hex);
  };

  return (
    <>
      {props.children &&
        props.children({
          color, // Emits the current color
          handleClick: () => {
            setVisible(!visible);
          },
          handleChange: (e: any) => {
            setColor(e.target.value);
          },
          force,
        })}
      {visible && !props.disabled && (
        <>
          <div
            style={{
              position: 'absolute',
              zIndex: 10,
              display: 'block',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            }}
            onClick={() => {
              setVisible(false);
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '10px',
              height: '10px', // otherwise it fills whole area
              backgroundColor: 'red',
              zIndex: 10,
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
          >
            <SketchPicker color={color} onChange={handleHexChange} />
          </div>
        </>
      )}
    </>
  );
}
