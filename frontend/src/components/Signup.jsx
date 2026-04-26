import { useState } from "react";
import { Link } from "react-router-dom";
import Background from "./Background";
import "../styles/signup.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const message = await response.text();

    if (!response.ok){
      alert(message);
      return;
    }
    alert(message);

    try {
      await fetch("http://localhost:5000/notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Account is created", type: "info", priority: 1 })
      });
    } catch (error) {
      console.error("Error occurred while fetching notifications:", error);

    }
  };

  return (
    <div className="signup-container">
      <Background />
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          placeholder="login"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className = "signup-button" type="submit">Create</button>
      </form>
      <p>
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </div>
  );
}

export default Signup;
