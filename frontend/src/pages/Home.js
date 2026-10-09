import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Home.css";

function Home() {
  const user = useSelector((state) => state.user);
  return (
    <div className="home">
      <div className="home-content">
        <div className="home-badge">✨ Real-time messaging</div>
        <h1 className="home-title">
          Chat without limits.
          <br />
          <span>Connect instantly.</span>
        </h1>
        <p className="home-sub">
          Join rooms, message teammates, and stay in sync — all in one place.
        </p>
        <div className="home-actions">
          <Link to="/chat" className="btn-primary-home">
            {user ? "Open Chat" : "Get Started"} →
          </Link>
          {!user && (
            <Link to="/signup" className="btn-ghost-home">
              Create account
            </Link>
          )}
        </div>
        <div className="home-stats">
          <div>
            <strong>4</strong>
            <span>Rooms</span>
          </div>
          <div>
            <strong>∞</strong>
            <span>Messages</span>
          </div>
          <div>
            <strong>⚡</strong>
            <span>Real-time</span>
          </div>
        </div>
      </div>
      <div className="home-visual">
        <div className="mock-chat">
          <div className="mock-msg mock-other">
            <span>Hey, anyone in Techtalks? 👋</span>
          </div>
          <div className="mock-msg mock-own">
            <span>Yeah! Just joined 🚀</span>
          </div>
          <div className="mock-msg mock-other">
            <span>Let's discuss the new stack</span>
          </div>
          <div className="mock-msg mock-own">
            <span>I'm in! 💻</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
