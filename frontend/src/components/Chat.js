import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./Chat.css";

// const socket = io("http://localhost:4000");
const socket = io("https://chat-app-socket-sv0t.onrender.com");

const Chat = ({ username }) => {
  const [sessions, setSessions] = useState({});
  const [currentSession, setCurrentSession] = useState(null);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const storedSessions = JSON.parse(localStorage.getItem(username)) || {};
    setSessions(storedSessions);
  }, [username]);

  useEffect(() => {
    if (username) {
      localStorage.setItem(username, JSON.stringify(sessions));
    }
  }, [sessions, username]);

  useEffect(() => {
    if (!currentSession) return;

    socket.on("message", (msg) => {
      setSessions((prevSessions) => ({
        ...prevSessions,
        [currentSession]: [
          ...prevSessions[currentSession],
          { content: msg, sender: "Server" },
        ],
      }));
    });

    return () => {
      socket.off("message");
    };
  }, [currentSession]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && currentSession) {
      const newMessage = messageInput.trim();
      setSessions((prevSessions) => ({
        ...prevSessions,
        [currentSession]: [
          ...prevSessions[currentSession],
          { content: newMessage, sender: "You" },
        ],
      }));
      socket.emit("message", newMessage);
      setMessageInput("");
    }
  };

  const handleSessionChange = (sessionName) => {
    setCurrentSession(sessionName);
  };

  const createNewSession = () => {
    const newSessionName = prompt("Enter new session name:");
    if (newSessionName && !sessions[newSessionName]) {
      setSessions((prevSessions) => ({
        ...prevSessions,
        [newSessionName]: [],
      }));
      setCurrentSession(newSessionName);
    }
  };

  const deleteSession = (sessionName) => {
    const updatedSessions = { ...sessions };
    delete updatedSessions[sessionName];
    setSessions(updatedSessions);

    localStorage.setItem(username, JSON.stringify(updatedSessions));

    if (sessionName === currentSession) {
      setCurrentSession(null);
    }
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <h2>Sessions</h2>
        <button onClick={createNewSession} className="newSessionButton">
          Create New Session
        </button>
        <div className="sessionsList">
          {Object.keys(sessions).map((session) => (
            <div key={session} className="sessionItem">
              <button
                onClick={() => handleSessionChange(session)}
                className="sessionButton"
              >
                {session}
              </button>
              {/* <button
                onClick={() => deleteSession(session)}
                className="deleteSessionButton"
              >
                Delete
              </button> */}
            </div>
          ))}
        </div>
      </div>

      <div className="chatArea">
        {currentSession ? (
          <>
            <div className="chat-header">
              <div className="session-title">
                {currentSession}
                <button onClick={() => deleteSession(currentSession)} className="deleteSessionButton">
                  Delete Session
                </button>
              </div>
            </div>
            <div className="chatBox">
              {sessions[currentSession].map((msg, index) => (
                <div
                  key={index}
                  className={
                    msg.sender === "You" ? "sentMessage" : "receivedMessage"
                  }
                >
                  <strong>{msg.sender}:</strong> {msg.content}
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="inputContainer">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="input"
                placeholder="Type a message..."
              />
              <button type="submit" className="sendButton">
                Send
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="noSessionMessage">
              Select or create a session to start chatting.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
