// import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
 // import AnimatedBackground from "../components/AnimatedBackground";

function PageLayout() {
  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      {/* Animated Background Component /}
      <AnimatedBackground />

      {/ Sidebar and Page Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="ml-56 flex-grow overflow-y-auto px-6 py-4 z-10 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PageLayout;