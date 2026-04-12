import { useState } from "react";
import { Link } from "react-router-dom";
import Background from "./Background";
import "../styles/signin.css";

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.text();
    alert(result);
  };

  return (
    <div className="signin-container">
      <Background />
      <form onSubmit={handleSubmit} className="login-form">
        <input
          placeholder="login"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" type="submit">Log in</button>
      </form>
      <p>
        Dont have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default Signin;
