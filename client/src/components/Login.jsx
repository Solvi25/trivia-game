import { useState } from 'react';
import './Login.css';

const API_URL = import.meta.env.VITE_SERVER_URL;

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegister ? '/auth/register' : '/auth/login';

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      onLogin(data.token, data.user);
    } catch (err) {
      setError('Cannot connect to server');
    }
  };

  return (
    <div className="login-container">
      <h1>{isRegister ? 'Register' : 'Login'}</h1>

      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button type="submit">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>

      <p>
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          className="login-toggle"
          onClick={() => { setIsRegister(!isRegister); setError(''); }}
        >
          {isRegister ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
}

export default Login;