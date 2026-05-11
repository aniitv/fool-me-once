import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./styles/index.css";
import Signin from "./components/Signin.jsx";
import Signup from "./components/Signup.jsx";
import NotificationsPage from "./components/Notification.jsx";
import TarotCards from "./components/TarotCards.jsx";
import Result from "./components/Result.jsx";
import MainPage from "./components/MainPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/mainpage" className="nav-link">
          Main page
        </Link>
        <Link to="/notifications" className="nav-link">
          Notifications
        </Link>
      </nav>

      <div className="page-content">
        <Routes>
          <Route path="/" element={<TarotCards />} />
          <Route path="/cards" element={<TarotCards />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/result" element={<Result />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
