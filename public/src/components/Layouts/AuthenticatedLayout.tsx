import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";

export default function AuthenticatedLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-900">
      <Sidebar />
      <div className="min-w-0 flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

