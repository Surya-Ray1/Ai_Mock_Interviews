import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeCtx = createContext({ theme: 'dark', toggle: ()=>{} });

export function ThemeProvider({ children }){
  const [theme, setTheme] = useState(()=> localStorage.getItem('theme') || 'dark');

  useEffect(()=>{
    localStorage.setItem('theme', theme);
    document.body.classList.toggle('theme-light', theme === 'light');
  }, [theme]);

  const value = useMemo(()=>({ theme, toggle: ()=> setTheme(t=> t==='light'?'dark':'light') }), [theme]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
