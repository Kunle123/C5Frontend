import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ChakraProvider } from '@chakra-ui/react';
import system from '../../theme';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Professional blue
    },
    secondary: {
      main: '#43a047', // Professional green
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ChakraProvider value={system}>
        <App />
      </ChakraProvider>
    </ThemeProvider>
  </React.StrictMode>
);
