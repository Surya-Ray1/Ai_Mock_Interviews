import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function AppNavbar(){
  const nav = useNavigate();
  const token = localStorage.getItem('token');
  const onLogout = () => { localStorage.removeItem('token'); nav('/'); };
  return (
    <Navbar bg="light" expand="md" className="mb-3 shadow-sm">
      <Container>
        <Navbar.Brand onClick={()=>nav('/')} style={{cursor:'pointer'}}>AI Mock Interviews</Navbar.Brand>
        <Nav className="ms-auto gap-2">
          {!token ? (
            <>
              <Button variant="outline-primary" onClick={()=>nav('/login')}>Login</Button>
              <Button variant="primary" onClick={()=>nav('/register')}>Register</Button>
            </>
          ) : (
            <>
              <Button variant="outline-secondary" onClick={()=>nav('/history')}>History</Button>
              <Button variant="primary" onClick={()=>nav('/setup')}>New Interview</Button>
              <Button variant="danger" onClick={onLogout}>Logout</Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}