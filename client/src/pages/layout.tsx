import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 w-full">
      {/* Sidebar */}
      <AppSidebar />
      {/* Main Content */}
      <main className="flex-1 w-full p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
