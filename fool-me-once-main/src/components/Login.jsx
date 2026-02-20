import React from "react";
import "../styles/login.css";

// import user_icon from "../assets/icons/person.png";
// import email_icon from "../assets/icons/email.png";
// import password_icon from "../assets/icons/password.png";

export default function Login() {
  return (
    <div className="container">
      <div className="header">
        <div className="text">Sign up</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {" "}
        {/* <div className="input">
          <img src={user_icon} alt="" />{" "}
          <input type="text" placeholder="Your Name" />{" "} 
        </div>*/}
        <div className="input">
          {" "}
          <input type="email" placeholder="Email" />{" "}
        </div>
        <div className="input">
          {" "}
          <input type="password" placeholder="Password" />{" "}
        </div>
      </div>
      <div className="submit-container">
        <div className="submit">Sign up</div>
        <div className="submit">Login</div>
      </div>{" "}
      <div className="reset-password">Reset password</div>
    </div>
  );
}
//  <img src={password_icon} alt="" />
//   <img src={email_icon} alt="" />
