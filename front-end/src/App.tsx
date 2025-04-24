import PageLayout from "./components/PageLayout";;
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Classes from "./pages/Classes";
import Friends from "./pages/Friends";
import Settings from "./pages/Settings";
import SplashPage from "./pages/SplashPage";
import Tasks from "./pages/Tasks";
import FlashCards from "./pages/FlashCards";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/signup" element={<SignUp />} /> */}
        <Route path="/" element={<SplashPage/>} />

        {/* Routes using shared layout */}
        <Route element={<PageLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/flashcards" element={<FlashCards />} />
          <Route path="/setup" element={<SignUp />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
