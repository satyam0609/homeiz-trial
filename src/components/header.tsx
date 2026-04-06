"use client";
import { Menu, Search, X } from "lucide-react";
import React, { useState } from "react";
import Navbar from "./navbar";
import SearchBox from "./searchbox";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header
      className={`flex items-center justify-between md:justify-end px-4 py-3 bg-white sticky top-0 z-999`}
    >
      <div className="flex items-center gap-2 md:hidden">
        <img src="/images/logo.svg" alt="logo" className="size-12" />
      </div>
      <h1 className="text-[1.625rem] font-semibold tracking-wide sm:ml-11 md:hidden">
        HOME<span className="text-primary text-blue-500">I</span>Z
      </h1>

      {/* Right side actions */}
      <div className="flex items-center gap-2 md:hidden">
        <button className="p-2 rounded-lg hover:bg-gray-100 transition ">
          <Search size={28} />
        </button>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-2 rounded-lg hover:bg-gray-100 transition "
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      <div className="hidden md:block">
        <SearchBox showSearch={true} classname="py-2! " />
      </div>

      <div
        className={`absolute top-full left-0 w-full bg-white shadow-md transition-all duration-300 overflow-hidden ${
          isOpen ? "min-h-98 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Navbar onClose={() => setIsOpen(false)} />
      </div>
    </header>
  );
};

export default Header;
