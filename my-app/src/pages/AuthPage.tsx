import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSignUp, handleLogin } from '../utils/authUtils';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await handleSignUp(email, password);
      } else {
        await handleLogin(email, password);
      }
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: '50px auto',
      padding: 24,
      border: '2px solid #ddd',
      borderRadius: 12,
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>
        {isSignUp ? '🎨 Sign Up' : '🎨 Log In'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 6,
              border: '1px solid #ccc',
              fontSize: 14
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 6,
              border: '1px solid #ccc',
              fontSize: 14
            }}
          />
        </div>

        {error && (
          <div style={{
            padding: 12,
            marginBottom: 16,
            backgroundColor: '#fee',
            color: '#c33',
            borderRadius: 6,
            fontSize: 14
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 16,
            fontWeight: 'bold',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
        </button>
      </form>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#4CAF50',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: 14
          }}
        >
          {isSignUp 
            ? 'Already have an account? Log in' 
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}