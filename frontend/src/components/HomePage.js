import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirecting after logout
import Chat from "./Chat";
import "./HomePage.css"; // Import the CSS file

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Assuming logged in state
  const [username, setUsername] = useState("");
  // Initialize useNavigate hook
  const navigate = useNavigate();

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/"); // Redirect to login page after logout
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("user=", user);

    if (user) {
      setIsLoggedIn(true);
      setUsername(user.username); // Store username after login
      console.log("username=", user.username); // Directly log the username
    } else {
      setIsLoggedIn(false);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="homePage">
      <div className="homePageHeader">
        <h2>Welcome to the HomePage - {username}</h2>
        {isLoggedIn && (
          <button onClick={handleLogout} className="logoutButton">
            Logout
          </button>
        )}
      </div>
      <Chat username={username} />
    </div>
  );
};

export default HomePage;
