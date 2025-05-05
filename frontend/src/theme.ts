import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6B9080', // Deep green
      contrastText: '#F6FFF8',
    },
    secondary: {
      main: '#A4C3B2', // Soft green
      contrastText: '#153243',
    },
    success: {
      main: '#CCE3DE', // Mint
      contrastText: '#6B9080',
    },
    info: {
      main: '#CCE3DE',
      contrastText: '#6B9080',
    },
    background: {
      default: '#F6FFF8', // Very light green
      paper: '#EAF4F4', // Off-white
    },
    text: {
      primary: '#153243',
      secondary: '#6B9080',
    },
  },
  typography: {
    fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #6B9080 0%, #A4C3B2 100%)',
          color: '#F6FFF8',
          boxShadow: '0 4px 20px 0 rgba(107,144,128,0.10)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 8px 32px 0 rgba(107,144,128,0.10)',
          background: '#EAF4F4',
        },
      },
    },
  },
});

export default theme; 