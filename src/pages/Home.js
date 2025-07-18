import { useContext } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserContext from '../context/UserContext';

export default function Home() {
  const { user } = useContext(UserContext);

  return (
    <>
      <div className="hero-section text-center">
        <Container>
          <motion.h1 className="hero-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Welcome to the Blog
          </motion.h1>
          <motion.p className="hero-subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            Discover insightful articles, share your thoughts, and connect with the community.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Button as={Link} to="/blogs" variant="primary" size="lg">
              {user.id ? '📚 Browse Blogs' : '🚀 Get Started'}
            </Button>
          </motion.div>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="text-center">
          <Col md={4} className="mb-4">
            <h3>Discover Content</h3>
            <p className="text-secondary">Explore a wide range of topics and find articles that spark your interest.</p>
          </Col>
          <Col md={4} className="mb-4">
            <h3>Join the Conversation</h3>
            <p className="text-secondary">Leave comments, share your perspective, and engage with other readers.</p>
          </Col>
          <Col md={4} className="mb-4">
            <h3>Create & Manage</h3>
            <p className="text-secondary">Admins have full control to create, edit, and manage all blogs and comments.</p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
