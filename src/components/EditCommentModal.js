import { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

export default function EditCommentModal({ show, handleClose, comment, postId, onCommentUpdated }) {
  const { API_URL } = useContext(UserContext);
  const notyf = new Notyf();

  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (comment) {
      setContent(comment.content);
    }
  }, [comment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch(`${API_URL}/posts/${postId}/updateComment/${comment._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ content })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message.includes('successfully')) {
        notyf.success('Comment updated!');
        onCommentUpdated();
        handleClose();
      } else {
        notyf.error(data.message || 'Failed to update comment.');
      }
    })
    .finally(() => setIsLoading(false));
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="text-white">Edit Comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Your Comment</Form.Label>
            <Form.Control as="textarea" rows={4} value={content} onChange={e => setContent(e.target.value)} required />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Comment'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
