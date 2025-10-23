import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import AppNavbar from './components/AppNavbar';
import { ThemeProvider } from './components/ThemeProvider';
import { ToasterProvider } from './components/Toaster';

export default function App(){
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToasterProvider>
          <AppNavbar />
          <div className="container py-4">
            <Router />
          </div>
        </ToasterProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}