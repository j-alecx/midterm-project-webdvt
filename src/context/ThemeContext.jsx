import {createContext, useContext, useState, useEffect, useCallback, useMemo} from 'react';

const THEME_KEY = 'budget-tracker-theme';
const ThemeContext = createContext(null);

export function ThemeProvider({children}) {
    const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }, []);

    const value = useMemo(() => ({theme, toggleTheme}), [theme, toggleTheme]);
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if(!context) throw new Error('Theme must be provided.');
    return context;
}