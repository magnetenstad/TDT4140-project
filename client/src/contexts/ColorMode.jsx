import React from 'react';
import {createTheme, ThemeProvider, useMediaQuery} from '@mui/material';

export const ColorModeContext = React.createContext(
    {toggleColorMode: () => {}},
);

// eslint-disable-next-line react/prop-types
export const ColorModeProvider = ({children}) => {
  const storedMode = localStorage.getItem('colormode');
  const [mode, setMode] = React.useState(
      storedMode === 'null' ? '' : storedMode);
  const colorMode = React.useMemo(
      () => ({
        toggleColorMode: () => {
          setMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('colormode', newMode);
            return newMode;
          });
        },
      }),
      [],
  );
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
      () =>
        createTheme({
          palette: {
            mode: mode ? mode : prefersDarkMode ? 'dark' : 'light',
          },
        }),
      [prefersDarkMode, mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        { children }
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
