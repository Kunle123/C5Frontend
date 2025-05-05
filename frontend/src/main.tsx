import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ChakraProvider, createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

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

// Set up Chakra system theming for v3+
const chakraConfig = defineConfig({});
const chakraSystem = createSystem(defaultConfig, chakraConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ChakraProvider value={chakraSystem}>
        <App />
      </ChakraProvider>
    </ThemeProvider>
  </React.StrictMode>
);
