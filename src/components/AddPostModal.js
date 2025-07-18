import { useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

export default function AddPostModal({ show, handleClose, fetchPosts }) {
  const { API_URL } = useContext(UserContext);
  const notyf = new Notyf();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch(`${API_URL}/posts/createPost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ title, content })
    })
    .then(res => res.json())
    .then(data => {
      if (data._id) {
        notyf.success('Post created successfully!');
        fetchPosts();
        handleClose();
        setTitle('');
        setContent('');
      } else {
        notyf.error(data.message || 'Failed to create post.');
      }
    })
    .finally(() => setIsLoading(false));
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton className="bg-dark text-light">
        <Modal.Title>Create New Post</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} required className="auth-input"/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control as="textarea" rows={8} value={content} onChange={e => setContent(e.target.value)} required className="auth-input"/>
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Post'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
