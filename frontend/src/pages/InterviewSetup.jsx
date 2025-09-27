import { useState } from 'react';
import { Card, Form, Button, Accordion, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../services/api';
import loadScript from '../utils/loadScript';
import { rzCreateOrder, rzVerify } from '../services/api';

const ENABLE_PAYMENTS = import.meta.env.VITE_ENABLE_PAYMENTS === 'true';

export default function InterviewSetup(){
  const nav = useNavigate();
  const [role,setRole] = useState('Frontend Developer');
  const [difficulty,setDifficulty] = useState('medium');
  const [mode] = useState('voice_browser'); // browser voice for now

  const [experienceYears, setExperienceYears] = useState(2);
  const [techStack, setTechStack] = useState('React, Laravel, MySQL');
  const [companyType, setCompanyType] = useState('startup');
  const [focusAreas, setFocusAreas] = useState(['behavioral','system design']);
  const [language, setLanguage] = useState('English');
  const [lengthMinutes, setLengthMinutes] = useState(15);

  const [payMsg, setPayMsg] = useState('');

  const toggleFocus = (tag) => {
    setFocusAreas(prev => prev.includes(tag) ? prev.filter(t=>t!==tag) : [...prev, tag]);
  };

  const start = async (e)=>{
    e.preventDefault();
    const payload = {
      role, difficulty, mode,
      experience_years: experienceYears,
      tech_stack: techStack,
      company_type: companyType,
      focus_areas: focusAreas,
      language, length_minutes: lengthMinutes,
      meta: { mode: 'voice_browser', tech_stack: techStack, language }
    };
    const { interview } = await createSession(payload);
    nav(`/interview/${interview.id}`);
  };

  async function upgradeToPro() {
    setPayMsg('');
    try {
      await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      const order = await rzCreateOrder(); // {key, order_id, amount, currency, user, ...}

      const rzp = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'AI Mock Interviews',
        description: 'Pro access (longer interviews)',
        order_id: order.order_id,
        prefill: { name: order.user.name, email: order.user.email },
        notes: { plan: 'pro' },
        theme: { color: '#7955ff' },
        handler: async function (response) {
          try {
            await rzVerify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setPayMsg('Success! Your plan is now PRO. You can enjoy longer interviews.');
          } catch (e) {
            setPayMsg(e?.response?.data?.error || 'Verification failed.');
          }
        },
        modal: { ondismiss: function(){ setPayMsg('Checkout closed.'); } }
      });

      rzp.open();
    } catch (e) {
      setPayMsg(e.message || 'Failed to load checkout.');
    }
  }

  return (
    <Card className="mx-auto" style={{maxWidth:720}}>
      <Card.Body>
        <h4>New Interview</h4>
        <Form onSubmit={start}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Role/Track</Form.Label>
                <Form.Control value={role} onChange={e=>setRole(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Difficulty</Form.Label>
                <Form.Select value={difficulty} onChange={e=>setDifficulty(e.target.value)}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Accordion className="mb-3">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Advanced (optional)</Accordion.Header>
              <Accordion.Body>
                <Row className="g-3">
                  <Col md={3}>
                    <Form.Label>Experience (years)</Form.Label>
                    <Form.Control type="number" min={0} value={experienceYears} onChange={e=>setExperienceYears(+e.target.value||0)} />
                  </Col>
                  <Col md={9}>
                    <Form.Label>Tech Stack</Form.Label>
                    <Form.Control value={techStack} onChange={e=>setTechStack(e.target.value)} placeholder="e.g., React, Node, SQL" />
                  </Col>
                  <Col md={4}>
                    <Form.Label>Company Type</Form.Label>
                    <Form.Select value={companyType} onChange={e=>setCompanyType(e.target.value)}>
                      <option value="startup">Startup</option>
                      <option value="product">Product Company</option>
                      <option value="faang">FAANG-like</option>
                      <option value="services">Services / Consulting</option>
                    </Form.Select>
                  </Col>
                  <Col md={4}>
                    <Form.Label>Language</Form.Label>
                    <Form.Control value={language} onChange={e=>setLanguage(e.target.value)} />
                  </Col>
                  <Col md={4}>
                    <Form.Label>Length (minutes)</Form.Label>
                    <Form.Control type="number" min={5} max={90} value={lengthMinutes} onChange={e=>setLengthMinutes(+e.target.value||15)} />
                  </Col>
                </Row>

                <div className="mt-3">
                  <Form.Label>Focus Areas</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {['behavioral','system design','dsa','architecture','testing','devops'].map(tag => (
                      <Button key={tag} size="sm" variant={focusAreas.includes(tag)?'primary':'outline-primary'} onClick={(ev)=>{ev.preventDefault(); toggleFocus(tag);}}>
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Button type="submit" className="w-100 mb-3">Start Interview (Browser Voice)</Button>

          {ENABLE_PAYMENTS && (
            <>
              <div className="d-flex align-items-center gap-2">
                <Button variant="outline-info" type="button" onClick={upgradeToPro}>
                  Upgrade to PRO
                </Button>
                <small className="text-muted">Longer interviews, no free cap.</small>
              </div>
              {payMsg && <Alert variant="secondary" className="mt-2">{payMsg}</Alert>}
            </>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
}
