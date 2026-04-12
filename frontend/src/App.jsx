import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./styles/index.css";
import Signin from "./components/Signin.jsx";
import Signup from "./components/Signup.jsx";
import NotificationsPage from "./components/Notification.jsx";
import TarotCards from "./components/TarotCards.jsx";
import Result from "./components/Result.jsx";
import Background from "./components/Background.jsx";
// import Card from "./components/Card.jsx";
import Home from "./components/Home";
function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "20px", background: "#030d33" }}>
        <Link to="/" style={{ marginRight: "15px" }}>
          Main page
        </Link>
        <Link to="/signin" style={{ marginRight: "15px" }}>
          Signin
        </Link>
        <Link to="/notifications" style={{ marginRight: "15px" }}>
          Notifications
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<TarotCards />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/result" element={<Result />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
