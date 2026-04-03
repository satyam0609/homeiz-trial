// "use client";

// import {
//   Home,
//   User,
//   Settings,
//   Search,
//   X,
//   LayoutDashboard,
//   Bell,
//   ChevronRight,
// } from "lucide-react";
// import React, { ReactNode, useState } from "react";
// import Header from "./header";
// import BottomNav from "./bottom-nav";
// import Sidebar from "./sidebar";

// const AuthLayout = ({ children }: { children: ReactNode }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex flex-col  h-screen bg-gray-200">
//       {/* ── Header ── always visible, sits on top */}
//       <Header />

//       {/* <div className="mx-auto overflow-hidden"> */}
//       <div className="flex flex-1 overflow-hidden">
//         <div className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 ml-[6vw]">
//           <div className="sticky top-0 h-screen overflow-y-auto">
//             <Sidebar />
//           </div>
//         </div>

//         <main className="flex-1 overflow-y-auto px-4 pb-6 lg:px-8">
//           <div className="max-w-3xl ">{children}</div>
//         </main>
//       </div>

//       <BottomNav />
//     </div>
//   );
// };

// export default AuthLayout;

"use client";

import {
  Home,
  User,
  Settings,
  Search,
  LayoutDashboard,
  Bell,
  Users,
  Tv,
  ShoppingBag,
  Gamepad2,
  BookMarked,
  Calendar,
  ChevronDown,
} from "lucide-react";

import { ReactNode } from "react";
import Header from "./header";
import BottomNav from "./bottom-nav";
import Sidebar from "./sidebar";

/* ─────────────────────────────────────────────
   LEFT SIDEBAR  (hidden on mobile / tablet)
───────────────────────────────────────────── */
const navItems = [
  { icon: Home, label: "Home" },
  { icon: User, label: "Profile" },
  { icon: Users, label: "Friends" },
  { icon: Tv, label: "Watch" },
  { icon: ShoppingBag, label: "Marketplace" },
  { icon: Gamepad2, label: "Gaming" },
  { icon: BookMarked, label: "Saved" },
  { icon: Calendar, label: "Events" },
  { icon: LayoutDashboard, label: "Pages" },
  { icon: Bell, label: "Notifications" },
  { icon: Settings, label: "Settings" },
];

const LeftSidebar = () => (
  <aside className="hidden lg:flex flex-col w-[280px] xl:w-[360px] shrink-0 h-full overflow-y-auto py-4 pr-2 scrollbar-thin">
    <nav className="flex flex-col gap-0.5">
      {navItems.map(({ icon: Icon, label }) => (
        <button
          key={label}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-200 transition-colors text-gray-800 font-medium text-[15px] group"
        >
          <span className="w-9 h-9 rounded-full bg-gray-200 group-hover:bg-gray-300 flex items-center justify-center shrink-0 transition-colors">
            <Icon size={20} className="text-gray-700" />
          </span>
          {label}
        </button>
      ))}
    </nav>

    <div className="mt-4 px-3">
      <hr className="border-gray-300" />
      <p className="text-xs text-gray-500 mt-3 leading-relaxed">
        Privacy · Terms · Advertising · Ad choices · Cookies · More · Meta ©
        2025
      </p>
    </div>
  </aside>
);

/* ─────────────────────────────────────────────
   RIGHT SIDEBAR  (hidden below xl)
───────────────────────────────────────────── */
const contacts = [
  { name: "Alice Johnson", online: true },
  { name: "Bob Smith", online: true },
  { name: "Carol White", online: false },
  { name: "David Lee", online: true },
  { name: "Eva Martinez", online: false },
];

const RightSidebar = () => (
  <aside className="hidden xl:flex flex-col w-[280px] xl:w-[340px] shrink-0 h-full overflow-y-auto py-4 pl-2 scrollbar-thin">
    {/* Sponsored */}
    <div className="mb-4">
      <h3 className="font-semibold text-gray-700 text-[15px] px-2 mb-2">
        Sponsored
      </h3>
      <div className="flex gap-3 px-2 py-2 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg shrink-0" />
        <div>
          <p className="text-sm font-medium text-gray-800 leading-tight">
            Check out this amazing product
          </p>
          <p className="text-xs text-gray-500 mt-1">example.com</p>
        </div>
      </div>
    </div>

    <hr className="border-gray-300 mx-2 mb-4" />

    {/* Contacts */}
    <div>
      <div className="flex items-center justify-between px-2 mb-1">
        <h3 className="font-semibold text-gray-700 text-[15px]">Contacts</h3>
        <div className="flex gap-1">
          <button className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors">
            <Search size={16} className="text-gray-600" />
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors">
            <ChevronDown size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {contacts.map(({ name, online }) => (
        <button
          key={name}
          className="flex items-center gap-3 px-2 py-2 w-full rounded-lg hover:bg-gray-200 transition-colors"
        >
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
            {online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-100" />
            )}
          </div>
          <span className="text-[15px] font-medium text-gray-800">{name}</span>
        </button>
      ))}
    </div>
  </aside>
);

/* ─────────────────────────────────────────────
   MAIN LAYOUT
───────────────────────────────────────────── */
const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Sticky top header */}
      <div className="sticky top-0 z-50  md:hidden">
        <Header />
      </div>

      {/* Three-column body */}
      <div className="flex flex-1 overflow-hidden max-w-480 mx-auto w-full">
        {/* Left nav sidebar */}
        <div className="hidden md:block h-full">
          <Sidebar />
        </div>

        {/* Center feed */}
        <main className="flex-1 overflow-y-auto ">
          <div className="hidden md:block md:sticky md:top-0 z-10">
            <Header />
          </div>
          <div className="max-w-170 mx-auto w-full">{children}</div>
        </main>

        {/* Right info / contacts sidebar */}
        {/* <div className="hidden xl:block h-full">
          <RightSidebar />
        </div> */}
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
};

export default AuthLayout;
