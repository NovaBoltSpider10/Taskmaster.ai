import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function PageLayout() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header on top */}
      <Header />

      {/* Sidebar and content below */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-grow overflow-y-auto px-6 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PageLayout;
