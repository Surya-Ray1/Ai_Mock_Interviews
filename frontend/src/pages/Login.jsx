import { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { login, API_BASE } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const nav = useNavigate();
  const [f,setF] = useState({email:'',password:'',remember:true});
  const [err,setErr] = useState('');
  const [loading,setLoading] = useState(false);
  const [showPwd,setShowPwd] = useState(false);
  const [capsOn,setCapsOn] = useState(false);

  const validateEmail = (v)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const emailInvalid = f.email && !validateEmail(f.email);

  const submit = async (e)=>{
    e.preventDefault(); setErr('');
    if(emailInvalid) return setErr('Please enter a valid email.');
    try{
      setLoading(true);
      const { token } = await login({ email: f.email.trim(), password: f.password });
      localStorage.setItem('token', token);
      if(f.remember) localStorage.setItem('remember_email', f.email.trim());
      nav('/setup');
    }catch(e){
      if(!e.response){
        setErr(`Cannot reach API (${API_BASE}). Is the backend running?`);
      } else {
        setErr(e.response?.data?.message || 'Login failed');
      }
    }finally{ setLoading(false); }
  };

  const quickFill = ()=> setF(s=>({ ...s, email: localStorage.getItem('remember_email') || s.email, password: s.password }));

  return (
    <div className="auth-page d-flex align-items-center justify-content-center py-5">
      <Row className="w-100 justify-content-center mx-0">
        <Col xs={11} sm={9} md={7} lg={5} xl={4} xxl={4}>
          <Card className="auth-card">
            <Card.Body className="p-4 p-md-5">
              <div className="mb-3">
                <h2 className="mb-1 brand-gradient">Welcome back</h2>
                <div className="text-secondary">Sign in to continue your mock interviews</div>
              </div>

              {err && <Alert className="mb-3" variant="danger">{err}</Alert>}

              <Form onSubmit={submit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    className="input-glow"
                    type="email"
                    value={f.email}
                    isInvalid={emailInvalid}
                    onChange={e=>setF({...f,email:e.target.value})}
                    placeholder="you@example.com"
                    required
                  />
                  <Form.Control.Feedback type="invalid">Enter a valid email address</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-2" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      className="input-glow"
                      type={showPwd? 'text':'password'}
                      value={f.password}
                      onKeyUp={(e)=> setCapsOn(e.getModifierState && e.getModifierState('CapsLock'))}
                      onChange={e=>setF({...f,password:e.target.value})}
                      placeholder="••••••••"
                      required
                    />
                    <Button variant="outline-secondary" onClick={()=>setShowPwd(s=>!s)} type="button">
                      {showPwd? 'Hide':'Show'}
                    </Button>
                  </div>
                  {capsOn && <div className="caps-hint mt-1">Caps Lock is ON</div>}
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Check
                    label="Remember me"
                    checked={f.remember}
                    onChange={e=> setF({...f, remember: e.target.checked})}
                  />
                  <Button variant="link" className="p-0 text-decoration-none" onClick={quickFill} type="button">Use saved email</Button>
                </div>

                <Button type="submit" className="w-100 mb-3" disabled={loading}>
                  {loading ? (<><Spinner as="span" size="sm" className="me-2" animation="border" /> Signing in…</>) : 'Login'}
                </Button>

                <div className="text-center mt-3 text-secondary">
                  No account? <a href="/register">Create one</a>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}