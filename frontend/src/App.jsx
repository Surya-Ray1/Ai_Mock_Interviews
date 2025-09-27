import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import AppNavbar from './components/AppNavbar';

export default function App(){
  return (
    <BrowserRouter>
      <AppNavbar />
      <div className="container py-4">
        <Router />
      </div>
    </BrowserRouter>
  );
}