"use client";

import { Menu, Home, User, Settings, Search, X } from "lucide-react";
import React, { ReactNode, useState } from "react";
import Navbar from "./navbar";
import BottomNav from "./bottom-nav";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-50">
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

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div
          className={`absolute top-full left-0 w-full bg-white shadow-md transition-all duration-300 overflow-hidden ${
            isOpen ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <Navbar />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto  py-4">{children}</main>

      <BottomNav />
    </div>
  );
};

export default AuthLayout;
