import { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

export default function EditPostModal({ show, handleClose, post, fetchPosts }) {
  const { API_URL } = useContext(UserContext);
  const notyf = new Notyf();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch(`${API_URL}/posts/updatePost/${post._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ title, content })
    })
    .then(res => res.json())
    .then(data => {
      if (data._id) {
        notyf.success('Post updated successfully!');
        fetchPosts();
        handleClose();
      } else {
        notyf.error(data.message || 'Failed to update post.');
      }
    })
    .finally(() => setIsLoading(false));
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className='text-white'>Edit Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control as="textarea" rows={8} value={content} onChange={e => setContent(e.target.value)} required />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Post'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
