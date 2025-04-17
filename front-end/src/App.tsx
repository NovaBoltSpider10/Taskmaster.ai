import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SplashPage from "./pages/SplashPage";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Friends from "./pages/Friends";
import Syllabus from "./pages/SyllabusDrop";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Settings from "./SetPages/Settings"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/settings" element={<Settings />} /> 
      </Routes>
    </Router>
  );
}

export default App;
