import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: 18 
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  // Your existing Home page content goes here
  return (
    <div>
      <h1>Welcome to Fridge Art! 🎨</h1>
      {/* Add your home page content here */}
    </div>
  );
}