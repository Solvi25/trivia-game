import { useNavigate } from 'react-router-dom';
import '../App.css';

function Home({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Trivia Game</h1>
      <p>Welcome, {user.username}!</p>

      <div className="home-buttons">
        <button onClick={() => navigate('/lobby')}>Play with Friends</button>
        <button onClick={() => navigate('/solo')}>Solo</button>
        <button onClick={() => navigate('/leaderboard')}>Leaderboard</button>
      </div>

      <button className="logout-button" onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Home;