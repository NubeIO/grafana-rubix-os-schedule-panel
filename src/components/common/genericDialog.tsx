import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { getDialogConfigByName } from './dialogResolver';

function GenericDialog(props: any) {
  if (!props.dialogName) {
    return null;
  }
  const dialogConfig = getDialogConfigByName(props.dialogName);
  const DialogBody = dialogConfig.dialogBody;

  return (
    <Dialog
      maxWidth="md"
      fullWidth={false}
      onClose={props.onClose}
      open={props.open}
      aria-labelledby={`customized-dialog-${props.dialogName}`}
    >
      {DialogBody && (
        <DialogBody
          dialogName={dialogConfig.name}
          dialogTitle={dialogConfig.title}
          id={`customized-dialog-${props.dialogName}`}
          closeGenericDialog={props.onClose}
          {...props}
        />
      )}
    </Dialog>
  );
}

export default GenericDialog;
