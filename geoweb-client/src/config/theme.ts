import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { gridClasses } from '@mui/x-data-grid';

const theme = createTheme({
  palette: {
    primary: {
      main: '#37a141',
    },
    secondary: {
      main: '#196fa6',
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    // make asterix color red in textfield required
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: '#db3131',
          '&$error': {
            color: '#db3131',
          },
        },
      },
    },
    // @ts-ignore
    MuiDataGrid: {
      styleOverrides: {
        root: {
          [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
            outline: 'none',
          },
          [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: {
            outline: 'none',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiDialog-paper': {
            minWidth: '480px',
          },
        },
      },
    },
  },
});

export default theme;