import { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col, Spinner, ProgressBar } from 'react-bootstrap';
import { register, API_BASE } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useToaster } from '../components/Toaster';

export default function Register(){
  const nav = useNavigate();
  const toast = useToaster();
  const [f,setF] = useState({name:'',email:'',password:'',agree:true});
  const [err,setErr] = useState('');
  const [showPwd,setShowPwd] = useState(false);
  const [loading,setLoading] = useState(false);

  const validateEmail = (v)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const emailInvalid = f.email && !validateEmail(f.email);
  const strength = Math.min(100, (f.password.length * 12) + (/[0-9]/.test(f.password)?10:0) + (/[^A-Za-z0-9]/.test(f.password)?10:0));

  const submit = async (e)=>{
    e.preventDefault(); setErr('');
    if(emailInvalid) return setErr('Please enter a valid email.');
    if(!f.agree) return setErr('Please agree to the terms to continue.');
    try{
      setLoading(true);
      const { token } = await register({ name: f.name.trim(), email: f.email.trim(), password: f.password });
      localStorage.setItem('token', token);
      toast.push('success','Welcome','Your account has been created.');
      nav('/setup');
    }catch(e){
      if(!e.response){ setErr(`Cannot reach API (${API_BASE}). Is the backend running?`); }
      else { setErr(e.response?.data?.message || 'Registration failed'); }
    }
    finally{ setLoading(false); }
  };
  return (
    <div className="auth-page d-flex align-items-center justify-content-center py-5">
      <Row className="w-100 justify-content-center mx-0">
        <Col xs={11} sm={9} md={7} lg={5} xl={4} xxl={4}>
          <Card className="auth-card">
            <Card.Body className="p-4 p-md-5">
              <div className="mb-3">
                <h2 className="mb-1 brand-gradient">Create your account</h2>
                <div className="text-secondary">Start practicing interviews in minutes</div>
              </div>

              {err && <Alert className="mb-3" variant="danger">{err}</Alert>}

              <Form onSubmit={submit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control className="input-glow" value={f.name} onChange={e=>setF({...f,name:e.target.value})} required/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control className="input-glow" type="email" value={f.email} isInvalid={emailInvalid} onChange={e=>setF({...f,email:e.target.value})} required/>
                  <Form.Control.Feedback type="invalid">Enter a valid email address</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-2" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control className="input-glow" type={showPwd?'text':'password'} value={f.password} onChange={e=>setF({...f,password:e.target.value})} required/>
                    <Button variant="outline-secondary" onClick={()=>setShowPwd(s=>!s)} type="button">{showPwd?'Hide':'Show'}</Button>
                  </div>
                  <ProgressBar className="mt-2" now={strength} variant={strength>75?'success':strength>50?'info':'warning'} visuallyHidden/>
                  <div className="text-secondary small mt-1">Use at least 8 characters. Add numbers and symbols for a stronger password.</div>
                </Form.Group>
                <Form.Check className="mt-2 mb-3" type="checkbox" label="I agree to the Terms and Privacy" checked={f.agree} onChange={e=>setF({...f,agree:e.target.checked})}/>
                <Button type="submit" className="w-100 mb-3" disabled={loading}>{loading ? (<><Spinner as="span" size="sm" className="me-2" animation="border" /> Creating…</>):'Create account'}</Button>
                <div className="text-center mt-3 text-secondary">Already have an account? <a href="/login">Sign in</a></div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}