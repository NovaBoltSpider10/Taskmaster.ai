import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App.tsx";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";
import PageLayout from "./components/PageLayout.tsx"; // adjust path if needed

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Routes wrapped with shared PageLayout */}
        <Route element={<PageLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* fallback */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-10 text-xl">Page Not Found</h1>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
