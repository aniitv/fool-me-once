import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/index.css";

import Navbar from "./components/Navbar.jsx";
import Signin from "./components/Signin.jsx";
import Signup from "./components/Signup.jsx";
import NotificationsPage from "./components/Notification.jsx";
import TarotCards from "./components/TarotCards.jsx";
import Result from "./components/Result.jsx";
import MainPage from "./components/MainPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <div className="page-content">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/cards"
            element={
              <ProtectedRoute>
                <TarotCards />
              </ProtectedRoute>
            }
          />

          <Route path="/result" element={<Result />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </div>

    </BrowserRouter>
  );
}

export default App;