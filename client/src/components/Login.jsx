import { useState } from 'react';

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
    <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
      <h1>{isRegister ? 'Register' : 'Login'}</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '8px', width: '100%' }}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" style={{ padding: '10px 20px', marginBottom: '10px' }}>
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>

      <p>
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => { setIsRegister(!isRegister); setError(''); }}
          style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
        >
          {isRegister ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
}

export default Login;