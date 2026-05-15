import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Background from "./Background";
import "../styles/mainpage.css";
import { CardList } from "../../../backend/src/data/Cards.js";
import { authService } from "../services/authService";

function MainPage() {
  const [isAuth, setIsAuth] = useState(authService.getAuth());

  useEffect(() => {
    const handler = (value) => setIsAuth(value);

    authService.subscribe(handler);

    return () => {
      authService.unsubscribe(handler);
    };
  }, []);

  const handleLogin = async () => {
    await authService.login("guest");
  };

  const handleLogout = async () => {
    await authService.logout();
  };

  const cardPast = CardList.find((c) => c.name === "The Fool");
  const cardPresent = CardList.find((c) => c.name === "The Star");
  const cardFuture = CardList.find((c) => c.name === "Death");

  const sampleCards = [
    {
      id: 1,
      title: "Past",
      desc: "Reflect on your journey.",
      img: cardPast?.image,
    },
    {
      id: 2,
      title: "Present",
      desc: "Energy surrounding you.",
      img: cardPresent?.image,
    },
    {
      id: 3,
      title: "Future",
      desc: "Possibilities of tomorrow.",
      img: cardFuture?.image,
    },
  ];

  return (
    <div className="main-page-container">
      <Background />

      {isAuth && (
        <div className="auth-panel">
          <p className="auth-status">
            Status: <span>ONLINE</span>
          </p>

          <button className="auth-btn secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      <header className="hero-section">
        <h1>
          Welcome to <span className="highlight">Fool Me Once</span>
        </h1>
        <p className="project-intro">
          This project is a nice platform that gives you the opportunity to
          choose 3 cards that will tell you about your past, present, and future
          with the power of AI guidance.
        </p>
      </header>

      <section className="preview-cards">
        {sampleCards.map((card) => (
          <div key={card.id} className="preview-card">
            <div className="card-image-wrapper">
              {card.img && (
                <img
                  src={card.img}
                  alt={card.title}
                  className="card-preview-img"
                />
              )}
            </div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </section>

      <section className="cta-section">
        <h2>Ready to explore?</h2>
        <p>Join our community and start managing your collection today.</p>
        <div className="cta-links">
          <Link to="/signin" className="cta-button">
            Sign In
          </Link>
          <Link to="/signup" className="cta-button secondary">
            Sign Up
          </Link>
        </div>
      </section>

      <footer className="authors-footer">
        <div className="author-info">
          <p>Created by:</p>
          <div className="author-names">
            <span>Anastasiia Zotova</span>
            <span className="separator">|</span>
            <span>Yaroslava Semeniuk</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainPage;
