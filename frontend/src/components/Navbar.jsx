import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService } from "../services/authService";

export default function Navbar() {
  const [isAuth, setIsAuth] = useState(authService.getAuth());

  useEffect(() => {
    const handler = (value) => setIsAuth(value);

    authService.subscribe(handler);

    return () => {
      authService.unsubscribe(handler);
    };
  }, []);

  return (
    <nav className="navbar">
      <Link to="/mainpage">Main page</Link>

      {isAuth && <Link to="/cards">Get spread</Link>}

      <Link to="/notifications">Notifications</Link>
    </nav>
  );
}