import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

function DeleteButton(props: any) {
  const { className, stopPropagation = false, onClick = (f: any) => f } = props;
  return (
    <IconButton
      aria-label="delete"
      className={className}
      onClick={(e) => {
        if (stopPropagation) {
          e.stopPropagation();
        }
        onClick(e);
      }}
    >
      <DeleteIcon color="secondary" fontSize="small" />
    </IconButton>
  );
}

export default DeleteButton;
