import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService } from "../services/authService";

export default function Navbar() {
  const [isAuth, setIsAuth] = useState(authService.getAuth());

  useEffect(() => {
    const unsubscribe = authService.subscribe(setIsAuth);

    return unsubscribe;
  }, []);

  return (
    <nav className="navbar">
      <Link to="/mainpage">Main page</Link>

      {isAuth && <Link to="/cards">Get spread</Link>}

      <Link to="/notifications">Notifications</Link>
    </nav>
  );
}