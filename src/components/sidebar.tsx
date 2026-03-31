"use client";
import React from "react";
import {
  Newspaper,
  Users,
  Search,
  Home,
  Bookmark,
  Film,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
  const path = usePathname();
  const router = useRouter();

  const navItems = [
    {
      id: "home",
      label: "Home news feed",
      icon: <Newspaper size={20} />,
      href: "/",
    },
    {
      id: "community",
      label: "Community news feed",
      icon: <Users size={20} />,
      href: "/community",
    },
    {
      id: "search",
      label: "Real estate search",
      icon: <Search size={20} />,
      href: "/search",
    },
    {
      id: "advertise",
      label: "Advertise a property",
      icon: <Home size={20} />,
      href: "/advertise",
    },
    {
      id: "bookmarks",
      label: "Bookmarks",
      icon: <Bookmark size={20} />,
      href: "/bookmarks",
    },
    { id: "vids", label: "Vids", icon: <Film size={20} />, href: "/videos" },
    {
      id: "profile",
      label: "Profile",
      icon: <User size={20} />,
      href: "/profile",
    },
  ];

  return (
    <div
      className="
        hidden md:flex flex-col
        w-80  h-screen
        sticky top-0
        p-4 
      "
    >
      {/* Logo */}
      {/* <h1 className="text-2xl font-semibold tracking-wide ml-4 mb-6">
        HOME<span className="text-blue-500">I</span>Z
      </h1> */}

      {/* Nav */}
      <div className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = path === item.href;

          return (
            <button
              key={item.id}
              onClick={() => router.push(item.href)}
              className={`flex items-center space-x-3 p-3 rounded-lg transition
                ${
                  isActive
                    ? "text-blue-600 bg-blue-50 font-semibold"
                    : "hover:bg-gray-100"
                }`}
            >
              <span className={isActive ? "text-blue-600" : ""}>
                {item.icon}
              </span>
              <span className="text-base font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
