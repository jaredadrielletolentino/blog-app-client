import { useState, useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import PostCard from './PostCard';
import AddPostModal from './AddPostModal';
import EditPostModal from './EditPostModal';

export default function UserView({ postsData, fetchPosts }) {
  const { user } = useContext(UserContext);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setShowEditModal(true);
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title text-light">Latest Posts</h1>
        {user.id && !user.isAdmin && (
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Create Post
          </Button>
        )}
      </div>

      <Row>
        {postsData.length > 0 ? (
          postsData.map(post => (
            <Col key={post._id} lg={4} md={6} className="mb-4">
              <PostCard post={post} onEditClick={handleEditClick} />
            </Col>
          ))
        ) : (
          <p className="text-center text-secondary">No posts available at the moment.</p>
        )}
      </Row>

      <AddPostModal show={showAddModal} handleClose={() => setShowAddModal(false)} fetchPosts={fetchPosts} />
      {selectedPost && (
        <EditPostModal show={showEditModal} handleClose={() => setShowEditModal(false)} post={selectedPost} fetchPosts={fetchPosts} />
      )}
    </Container>
  );
}
