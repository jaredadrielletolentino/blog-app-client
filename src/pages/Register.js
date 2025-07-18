import { useState, useContext } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

export default function Register() {
  const { API_URL } = useContext(UserContext);
  const navigate = useNavigate();
  const notyf = new Notyf();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'Successfully Registered') {
        notyf.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed.');
      }
    })
    .catch(() => setError('An error occurred. Please try again.'))
    .finally(() => setIsLoading(false));
  };

  return (
    <Container className="mt-5 auth-container">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="auth-card">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4 auth-title">Register</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Email Address</Form.Label>
                  <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required className="auth-input" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Username</Form.Label>
                  <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} required className="auth-input" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Password</Form.Label>
                  <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength="8" className="auth-input" />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isLoading} className="w-100 mt-3">
                  {isLoading ? 'Registering...' : 'Register'}
                </Button>
              </Form>
              <div className="text-center mt-4">
                <Link to="/login" className="auth-toggle-link">Already have an account? Login</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
