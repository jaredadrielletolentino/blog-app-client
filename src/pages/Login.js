import { useState, useContext } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

export default function Login() {
  const { API_URL, fetchUserProfile } = useContext(UserContext);
  const navigate = useNavigate();
  const notyf = new Notyf();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        fetchUserProfile(data.accessToken);
        notyf.success('Login successful!');
        navigate('/posts');
      } else {
        setError(data.message || 'Login failed.');
      }
    })
    .catch(() => setError('An error occurred.'))
    .finally(() => setIsLoading(false));
  };

  return (
    <Container className="mt-5 auth-container">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="auth-card">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4 auth-title">Login</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Email or Username</Form.Label>
                  <Form.Control type="text" value={email} onChange={e => setEmail(e.target.value)} required className="auth-input" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Password</Form.Label>
                  <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required className="auth-input" />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isLoading} className="w-100 mt-3">
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>
              <div className="text-center mt-4">
                <Link to="/register" className="auth-toggle-link">Don't have an account? Register</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
