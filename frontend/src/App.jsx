import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./styles/index.css";
import Login from "./components/Login.jsx";
import TarotCards from "./components/TarotCards.jsx";
import Home from "./components/Home";
function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "20px", background: "#f0f0f0" }}>
        <Link to="/" style={{ marginRight: "10px" }}>
          Main page
        </Link>
        <Link to="/login">Login</Link>
      </nav>

      <Routes>
        <Route path="/" element={<TarotCards />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
