import { useState, useEffect } from "react";
import Header from "./components/Header";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("");

  const getGreeting = () => {
    const hours = new Date().getHours();
    let greetingMessage = "";

    if (hours < 12) {
      greetingMessage = "Good Morning";
    } else if (hours < 18) {
      greetingMessage = "Good Afternoon";
    } else {
      greetingMessage = "Good Evening";
    }

    setGreeting(`${greetingMessage} User! :D`);
  };

  useEffect(() => {
    getGreeting();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Login Failed: ${response.status}`);
      }

      const data = await response.json();
      window.location.href = data.redirectUrl;
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header title="TaskMasterAI" greeting={greeting}>
        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          <span className={`login-text ${loading ? "fade-text" : ""}`}>
            {loading ? "Logging in..." : "Log In"}
          </span>
        </button>
      </Header>
    </div>
  );
}

export default App;
