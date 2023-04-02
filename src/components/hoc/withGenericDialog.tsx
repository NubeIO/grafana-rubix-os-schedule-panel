import React, { useState, useEffect } from 'react';
import GenericDialog from '../common/genericDialog';

function withGenericDialog(ComposedComponent: any) {
  return function (props: any) {
    const [dialogName, updateDialogName] = useState('');
    const [dialogProps, updateDialogProps] = useState({});
    const [open, setOpen] = useState(false);
    useEffect(() => {
      if (!!dialogName) {
        setOpen(true);
      }
    }, [dialogName]);

    const closeDialog = () => {
      updateDialogName('');
      updateDialogProps({});
      setOpen(false);
    };

    const openDialogByName = (name: string, dialogProps: any = {}) => {
      updateDialogName(name);
      updateDialogProps(dialogProps);
      setOpen(true);
    };

    return (
      <>
        <ComposedComponent {...props} openGenericDialog={openDialogByName} closeGenericDialog={closeDialog} />
        <GenericDialog dialogName={dialogName} onClose={closeDialog} open={open} {...props} {...dialogProps} />
      </>
    );
  };
}

export default withGenericDialog;
