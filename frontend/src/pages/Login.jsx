import { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const nav = useNavigate();
  const [f,setF] = useState({email:'',password:''});
  const [err,setErr] = useState('');
  const submit = async (e)=>{
    e.preventDefault(); setErr('');
    try{ const { token } = await login(f); localStorage.setItem('token', token); nav('/setup'); }
    catch(e){ setErr(e.response?.data?.message || 'Failed'); }
  };
  return (
    <Card className="mx-auto" style={{maxWidth:420}}>
      <Card.Body>
        <h4>Welcome back</h4>
        {err && <Alert variant="danger">{err}</Alert>}
        <Form onSubmit={submit}>
          <Form.Group className="mb-2"><Form.Label>Email</Form.Label><Form.Control type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required/></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Password</Form.Label><Form.Control type="password" value={f.password} onChange={e=>setF({...f,password:e.target.value})} required/></Form.Group>
          <Button type="submit" className="w-100">Login</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}