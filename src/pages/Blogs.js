import { useState, useEffect, useContext } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';
import AdminDashboard from '../components/AdminDashboard';
import UserView from '../components/UserView';

export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, API_URL } = useContext(UserContext);
  const notyf = new Notyf();

  const fetchPosts = () => {
    setIsLoading(true);
    fetch(`${API_URL}/posts/getAllPosts`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts([]);
        }
      })
      .catch(() => notyf.error('Failed to load posts.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (isLoading) {
    return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
  }

  return user.isAdmin ? (
    <AdminDashboard postsData={posts} fetchPosts={fetchPosts} />
  ) : (
    <UserView postsData={posts} fetchPosts={fetchPosts} />
  );
}
