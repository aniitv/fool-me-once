import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(authService.getAuth());

  useEffect(() => {
    const handler = (value) => setIsAuth(value);

    authService.subscribe(handler);

    return () => {
      authService.unsubscribe(handler);
    };
  }, []);

  if (!isAuth) {
    return <Navigate to="/signin" />;
  }

  return children;
}