import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';
import EditCommentModal from '../components/EditCommentModal';
import Loading from '../components/Loading';

export default function BlogDetails() {
  const { postId } = useParams();
  const { user, API_URL } = useContext(UserContext);
  const notyf = new Notyf();

  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const fetchPost = () => {
    fetch(`${API_URL}/posts/getSpecificPost/${postId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data._id) {
          setPost(data);
          setError(null);
        } else {
          setError(data.message || 'Post not found.');
        }
      })
      .catch(() => setError('Could not fetch post data.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    fetch(`${API_URL}/posts/addComment/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ content: newComment })
    })
    .then(res => res.json())
    .then(data => {
      if (data && data._id) {
        notyf.success('Comment added!');
        setNewComment('');
        fetchPost();
      } else {
        notyf.error(data.message || 'Failed to add comment.');
      }
    });
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      const endpoint = user.isAdmin 
        ? `${API_URL}/posts/adminDeleteComment/${postId}/comments/${commentId}`
        : `${API_URL}/posts/${postId}/comments/${commentId}`;

      fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.message.includes('successfully')) {
          notyf.success('Comment deleted!');
          fetchPost();
        } else {
          notyf.error(data.message || 'Failed to delete comment.');
        }
      });
    }
  };

  const handleEditClick = (comment) => {
    setSelectedComment(comment);
    setShowEditModal(true);
  };

  if (isLoading) return <Loading />;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="mt-5">
      {post && (
        <>
          <Card className="mb-4 bg-dark text-light">
            <Card.Body>
              <Card.Title as="h1">{post.title}</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                By {post.author?.username || '...'} on {new Date(post.createdAt).toLocaleDateString()}
              </Card.Subtitle>
              <Card.Text as="div" style={{ whiteSpace: 'pre-wrap' }}>{post.content}</Card.Text>
            </Card.Body>
          </Card>

          <section>
            <h3 className="mb-4 text-light">Comments ({post.comments.length})</h3>
            {user.id && !user.isAdmin && (
              <Form onSubmit={handleAddComment} className="mb-4">
                <Form.Group>
                  <Form.Control as="textarea" rows={3} value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Join the discussion..." className="auth-input"/>
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-2">Post Comment</Button>
              </Form>
            )}
            {!user.id && (
                 <Alert variant="info">Please <Link to="/login">login</Link> to leave a comment.</Alert>
            )}
            
            {post.comments.slice().reverse().map(comment => (
              <Card key={comment._id} className="mb-3 bg-dark text-light">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{comment.userId?.username || 'User'}</strong>
                      <p className="mb-1">{comment.content}</p>
                      <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
                    </div>
                    <div className="d-flex gap-2 align-items-start">
                      {user.id === comment.userId?._id && (
                        <Button variant="outline-warning" size="sm" onClick={() => handleEditClick(comment)}>Edit</Button>
                      )}
                      {(user.id === comment.userId?._id || user.isAdmin) && (
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteComment(comment._id)}>Delete</Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </section>

          <EditCommentModal show={showEditModal} handleClose={() => setShowEditModal(false)} comment={selectedComment} postId={postId} onCommentUpdated={fetchPost} />
        </>
      )}
    </Container>
  );
}
