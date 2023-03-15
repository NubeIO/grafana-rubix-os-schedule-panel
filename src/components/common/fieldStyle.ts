import { makeStyles, createStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      width: '100%',
    },
    input: {
      marginBottom: '20px',
    },
    textField: {
      marginRight: theme.spacing(2),
      minWidth: 175,
    },
    listbox: {
      '& .schedule-name-listitem': {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
    },
    colorPreview: {
      marginRight: '8px',
      padding: '4px',
      background: '#fff',
      borderRadius: '4px',
      display: 'inline-block',
      border: '1px solid',
      cursor: 'pointer',
      '& div': {
        width: '32px',
        height: '28px',
        borderRadius: '2px',
      },
    },
  })
);

export default useStyles;
