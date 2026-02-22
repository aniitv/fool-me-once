import React, { useState } from "react";
import "../styles/login.css";
import modalBg from "../assets/modal.png";

// import user_icon from "../assets/icons/person.png";
// import email_icon from "../assets/icons/email.png";
// import password_icon from "../assets/icons/password.png";

export default function Login() {
  const [action, setAction] = useState("Sign Up");
  return (
    <div className="container">
      <img src={modalBg} className="container-background" />
      <div className="modal-content">
        <div className="header">
          <div className="text">{action}</div>
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
          <div
            className={`${action === "Login" ? "submit gray" : "submit"} signup`}
            onClick={() => {
              setAction("Sign Up");
            }}
          >
            Sign up
          </div>
          <div
            className={`${action === "Sign Up" ? "submit gray" : "submit"} login`}
            onClick={() => {
              setAction("Login");
            }}
          >
            Login
          </div>
        </div>
        {/* {action === "Sign Up" ? (
          <div></div>
        ) : (
          <div className="reset-password">Reset password</div>
        )} */}
      </div>
    </div>
  );
}
//  <img src={password_icon} alt="" />
//   <img src={email_icon} alt="" />
