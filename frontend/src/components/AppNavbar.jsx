import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeProvider';

export default function AppNavbar(){
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const token = localStorage.getItem('token');
  const onLogout = () => { localStorage.removeItem('token'); nav('/'); };
  return (
    <Navbar bg={theme === 'light' ? 'light' : 'dark'} variant={theme === 'light' ? 'light' : 'dark'} expand="md" className="mb-3 shadow-sm sticky-top">
      <Container>
        <Navbar.Brand onClick={()=>nav('/')} style={{cursor:'pointer'}}>
          <span className="brand-gradient">AI Mock Interviews</span>
        </Navbar.Brand>
        <Nav className="ms-auto gap-2 align-items-center">
          <Button size="sm" variant={theme==='light'?'outline-dark':'outline-light'} onClick={toggle}>
            {theme==='light' ? 'Dark' : 'Light'}
          </Button>
          {!token ? (
            <>
              <Button variant={pathname==='/login'?'primary':'outline-primary'} onClick={()=>nav('/login')}>Login</Button>
              <Button variant={pathname==='/register'?'primary':'outline-primary'} onClick={()=>nav('/register')}>Register</Button>
            </>
          ) : (
            <>
              <Button variant={pathname==='/history'?'primary':'outline-secondary'} onClick={()=>nav('/history')}>History</Button>
              <Button variant="primary" onClick={()=>nav('/setup')}>New Interview</Button>
              <Button variant="danger" onClick={onLogout}>Logout</Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}