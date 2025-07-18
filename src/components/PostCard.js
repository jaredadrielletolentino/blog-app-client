import { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

export default function PostCard({ post, onEditClick }) {
  const { user, API_URL } = useContext(UserContext);
  const notyf = new Notyf();

  const excerpt = post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '');

  const deletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete your post?')) {
      fetch(`${API_URL}/posts/deletePost/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.message.includes('successfully')) {
          notyf.success('Post deleted.');
          window.location.reload();
        } else {
          notyf.error(data.message || 'Failed to delete post.');
        }
      });
    }
  };

  return (
    <Card className="post-card h-100">
      <Card.Body className="d-flex flex-column">
        <Card.Title className="card-title">{post.title}</Card.Title>
        <Card.Subtitle className="mb-2 card-subtitle">
          By {post.author?.username || '...'}
        </Card.Subtitle>
        <Card.Text className="card-text flex-grow-1">
          {excerpt}
        </Card.Text>
        <div className="mt-auto">
          <Button as={Link} to={`/blogs/${post._id}`} variant="primary" className="me-2">
            Read More
          </Button>
          {user.id === post.author?._id && !user.isAdmin && (
            <>
              <Button variant="warning" size="sm" onClick={() => onEditClick(post)} className="me-2">
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => deletePost(post._id)}>
                Delete
              </Button>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
