import { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        // "http://localhost:1337/api/auth/local/register",
        "https://chat-app-backend-hm10.onrender.com/api/auth/local/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();
      if (
        data.error &&
        data.error.message === "Email or Username are already taken"
      ) {
        setError("Already a User");
        return;
      }
      if (response.ok) {
        localStorage.setItem("jwt", data.jwt); 
        localStorage.setItem("user", JSON.stringify(data.user));
        window.alert("Registration Successfull");
        navigate("/");
      } else {
        setError(data.message || "Failed to register. Please try again.");
      }
    } catch (error) {
      setError("An error occurred during registration.");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-box">
          <h2>Register</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="register-button">
              Register
            </button>
          </form>
        </div>
        <p>
          Already a user?
          <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
