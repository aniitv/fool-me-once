import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(authService.getAuth());

  useEffect(() => {
    const unsubscribe = authService.subscribe(setIsAuth);

    return unsubscribe;
  }, []);

  if (!isAuth) {
    return <Navigate to="/signin" />;
  }

  return children;
}