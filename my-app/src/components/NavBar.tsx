import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { handleSignOut } from '../utils/authUtils';
import '../styles/NavBar.css';

export default function NavBar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const onSignOut = async () => {
    await handleSignOut();
    navigate('/auth');
  };

  return (
    <nav className="app-nav">
      <Link className="nav-link" to="/">Home</Link>
      <Link className="nav-link" to="/scan">Scan</Link>
      <Link className="nav-link" to="/fridge">Fridge</Link>
      <Link className="nav-link" to="/fridgeInside">Fridge Inside</Link>
      <Link className="nav-link" to="/friends">Friends</Link>
      
      {user ? (
        <button 
          className="nav-link" 
          onClick={onSignOut}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            font: 'inherit'
          }}
        >
          Sign Out
        </button>
      ) : (
        <Link className="nav-link" to="/auth">Sign In</Link>
      )}
    </nav>
  );
}