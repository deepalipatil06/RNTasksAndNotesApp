import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

type ThemeContextValue = {
  colorScheme: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextValue>({ colorScheme: 'light' });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [scheme, setScheme] = useState<'light' | 'dark'>(Appearance.getColorScheme() ?? 'light');

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme) setScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  return <ThemeContext.Provider value={{ colorScheme: scheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
