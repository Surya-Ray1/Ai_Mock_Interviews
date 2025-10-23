import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Home(){
  const nav = useNavigate();
  const token = localStorage.getItem('token');

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section text-center py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">
                <span className="brand-gradient">Ace Your Next Interview</span>
              </h1>
              <p className="lead text-secondary mb-4">
                Practice behavioral and technical interviews with AI-powered mock sessions. 
                Get real-time feedback, improve your communication, and land your dream job.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                {token ? (
                  <>
                    <Button size="lg" onClick={()=>nav('/setup')} className="px-4">
                      Start New Interview
                    </Button>
                    <Button size="lg" variant="outline-primary" onClick={()=>nav('/history')} className="px-4">
                      View History
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="lg" onClick={()=>nav('/register')} className="px-4">
                      Get Started Free
                    </Button>
                    <Button size="lg" variant="outline-primary" onClick={()=>nav('/login')} className="px-4">
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 feature-card">
              <Card.Body className="text-center p-4">
                <div className="feature-icon mb-3">🎯</div>
                <h5 className="fw-bold mb-3">Personalized Practice</h5>
                <p className="text-secondary">
                  Customize your interview by role, difficulty, tech stack, and focus areas. 
                  Get questions tailored to your experience level.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 feature-card">
              <Card.Body className="text-center p-4">
                <div className="feature-icon mb-3">🎤</div>
                <h5 className="fw-bold mb-3">Voice Interaction</h5>
                <p className="text-secondary">
                  Practice with browser-based voice recognition. Speak naturally and get 
                  conversational feedback just like a real interview.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 feature-card">
              <Card.Body className="text-center p-4">
                <div className="feature-icon mb-3">📊</div>
                <h5 className="fw-bold mb-3">Detailed Feedback</h5>
                <p className="text-secondary">
                  Review your performance with AI-generated insights. Track your progress 
                  and identify areas for improvement.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Pricing/Free Tier Section */}
      <div className="pricing-section py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h2 className="fw-bold mb-4">Start Free, Upgrade When Ready</h2>
              <Row className="g-4 mt-3">
                <Col md={6}>
                  <Card className="pricing-card h-100">
                    <Card.Body className="p-4">
                      <h4 className="fw-bold mb-2">Free Trial</h4>
                      <div className="display-6 fw-bold mb-3">₹0</div>
                      <ul className="list-unstyled text-start mb-4">
                        <li className="mb-2">✓ Up to 5 question turns</li>
                        <li className="mb-2">✓ 60 seconds per session</li>
                        <li className="mb-2">✓ Browser voice mode</li>
                        <li className="mb-2">✓ Basic feedback</li>
                      </ul>
                      {!token && (
                        <Button variant="outline-primary" onClick={()=>nav('/register')} className="w-100">
                          Start Free Trial
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="pricing-card pricing-card-pro h-100 border-primary">
                    <Card.Body className="p-4">
                      <div className="pro-badge mb-2">POPULAR</div>
                      <h4 className="fw-bold mb-2">Pro Access</h4>
                      <div className="display-6 fw-bold mb-3 text-primary">₹299</div>
                      <ul className="list-unstyled text-start mb-4">
                        <li className="mb-2">✓ Unlimited turns</li>
                        <li className="mb-2">✓ Longer sessions</li>
                        <li className="mb-2">✓ Priority support</li>
                        <li className="mb-2">✓ Advanced analytics</li>
                      </ul>
                      {token ? (
                        <Button className="w-100" onClick={()=>nav('/setup')}>
                          Upgrade Now
                        </Button>
                      ) : (
                        <Button className="w-100" onClick={()=>nav('/register')}>
                          Get Started
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <p className="text-secondary mt-4">
                💡 <strong>Pro tip:</strong> Contact admin for an invite code to unlock premium features for free!
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* How It Works */}
      <Container className="py-5">
        <h2 className="text-center fw-bold mb-5">How It Works</h2>
        <Row className="g-4">
          <Col md={3} className="text-center">
            <div className="step-number mb-3">1</div>
            <h5 className="fw-bold mb-2">Sign Up</h5>
            <p className="text-secondary">Create your free account in seconds</p>
          </Col>
          <Col md={3} className="text-center">
            <div className="step-number mb-3">2</div>
            <h5 className="fw-bold mb-2">Customize</h5>
            <p className="text-secondary">Set your role, difficulty, and focus areas</p>
          </Col>
          <Col md={3} className="text-center">
            <div className="step-number mb-3">3</div>
            <h5 className="fw-bold mb-2">Practice</h5>
            <p className="text-secondary">Answer questions using voice or text</p>
          </Col>
          <Col md={3} className="text-center">
            <div className="step-number mb-3">4</div>
            <h5 className="fw-bold mb-2">Improve</h5>
            <p className="text-secondary">Review feedback and track progress</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}