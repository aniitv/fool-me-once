import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./styles/index.css";
import Signin from "./components/Signin.jsx";
import Signup from "./components/Signup.jsx";
import TarotCards from "./components/TarotCards.jsx";
import Home from "./components/Home";
function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "20px", background: "#f0f0f0" }}>
        <Link to="/" style={{ marginRight: "10px" }}>
          Main page
        </Link>
        <Link to="/signin">Signin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<TarotCards />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
