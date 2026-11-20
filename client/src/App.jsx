
import { useEffect, useState, useRef } from "react";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [tab, setTab] = useState("discover");
  const [matchPopup, setMatchPopup] = useState(null);
  const [loading, setLoading] = useState(true);

  const touchStartX = useRef(0);

function handleTouchStart(e) {
  touchStartX.current = e.touches[0].clientX;
}

function handleTouchEnd(e) {
  const difference = e.changedTouches[0].clientX - touchStartX.current;

  if (difference > 80) {
    swipe("like");
  } else if (difference < -80) {
    swipe("pass");
  }
}
  async function loadData() {
    try {
      const [feedRes, matchRes] = await Promise.all([
        fetch(`${API}/feed`),
        fetch(`${API}/matches`)
      ]);

      setProfiles(await feedRes.json());
      setMatches(await matchRes.json());
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (tab !== "discover" || matchPopup) return;

      if (e.key === "ArrowRight") swipe("like");
      if (e.key === "ArrowLeft") swipe("pass");
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tab, matchPopup, profiles]);

  async function swipe(action) {
    const profile = profiles[0];
    if (!profile) return;

    try {
      const response = await fetch(`${API}/swipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.id,
          action
        })
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Swipe failed");
        return;
      }

      setProfiles(prev => prev.slice(1));

      if (result.match) {
        setMatchPopup(result.match);
        setMatches(prev => [...prev, result.match]);
      }
    } catch (error) {
      alert("Cannot connect to server");
    }
  }

  if (loading) return <h2 className="center">Loading...</h2>;

  return (
    <div className="app">
      <header>
        <h1>💕 Coy Discover</h1>
        <nav>
          <button onClick={() => setTab("discover")}>Discover</button>
          <button onClick={() => setTab("matches")}>
            Matches ({matches.length})
          </button>
        </nav>
      </header>

      {tab === "discover" ? (
        <main>
          {profiles.length > 0 ? (
            <div className="profile-card">
              <img
  src={profiles[0].photo} alt={profiles[0].name} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
  style={{ touchAction: "pan-y" }}
/>
              <div className="details">
                <h2>{profiles[0].name}, {profiles[0].age}</h2>
                <p>{profiles[0].bio}</p>
                <p>📍 {profiles[0].city} · {profiles[0].college}</p>
                <div className="interests">
                  {profiles[0].interests.map(item => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
              <div className="actions">
                <button className="pass" onClick={() => swipe("pass")}>✕</button>
                <button className="like" onClick={() => swipe("like")}>♥</button>
              </div>
              <p className="remaining">{profiles.length} profiles remaining</p>
            </div>
          ) : (
            <h2 className="center">No more profiles! 🎉</h2>
          )}
        </main>
      ) : (
        <main className="matches">
          <h2>Your Matches ❤️</h2>
          {matches.length === 0 ? (
            <p>No matches yet. Keep discovering!</p>
          ) : (
            matches.map(match => (
              <div className="match-item" key={match.id}>
                <img src={match.photo} alt={match.name} />
                <strong>{match.name}</strong>
              </div>
            ))
          )}
        </main>
      )}

      {matchPopup && (
        <div className="overlay">
          <div className="popup">
            <h1>🎉 It's a Match!</h1>
            <img src={matchPopup.photo} alt={matchPopup.name} />
            <h2>You and {matchPopup.name} liked each other!</h2>
            <button onClick={() => setMatchPopup(null)}>Continue</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
