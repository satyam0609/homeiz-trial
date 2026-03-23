"use client";

import { Menu, Home, User, Settings, Search } from "lucide-react";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/images/logo.svg" alt="logo" className="w-8 h-8" />
          <h1 className="text-lg font-semibold tracking-wide">
            HOME<span className="text-primary text-blue-500">I</span>Z
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition">
            <Search size={22} />
          </button>

          <button className="p-2 rounded-lg hover:bg-gray-100 transition">
            <Menu size={24} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">{children}</main>

      <nav className="border-t bg-white sticky bottom-0 z-50">
        <div className="flex justify-around items-center py-2">
          <button className="flex flex-col items-center text-gray-600 hover:text-black transition">
            <Home size={22} />
            <span className="text-xs">Home</span>
          </button>

          <button className="flex flex-col items-center text-gray-600 hover:text-black transition">
            <User size={22} />
            <span className="text-xs">Profile</span>
          </button>

          <button className="flex flex-col items-center text-gray-600 hover:text-black transition">
            <Settings size={22} />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AuthLayout;
