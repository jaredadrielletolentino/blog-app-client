import { useContext } from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

export default function AdminDashboard({ postsData, fetchPosts }) {
  const { API_URL } = useContext(UserContext);
  const notyf = new Notyf();

  const deletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      fetch(`${API_URL}/posts/adminDeletePost/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.message.includes('successfully')) {
          notyf.success('Post deleted!');
          fetchPosts();
        } else {
          notyf.error(data.message || 'Failed to delete post.');
        }
      });
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title">Admin Dashboard</h1>
      </div>
      <Table responsive className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Created On</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {postsData.map(post => (
            <tr key={post._id}>
              <td>{post.title}</td>
              <td>{post.author?.username || 'N/A'}</td>
              <td>{new Date(post.createdAt).toLocaleDateString()}</td>
              <td className="text-center">
                <Button as={Link} to={`/blogs/${post._id}`} size="sm" variant="info" className="me-2">
                  View
                </Button>
                <Button variant="danger" size="sm" onClick={() => deletePost(post._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
