"use client";
import React, { useEffect, useState } from "react";
import {
  Newspaper,
  Users,
  Search,
  Home,
  Bookmark,
  Film,
  User,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { id: "home", label: "Home news feed", icon: Newspaper, href: "/" },
  {
    id: "community",
    label: "Community news feed",
    icon: Users,
    href: "/community",
  },
  { id: "search", label: "Real estate search", icon: Search, href: "/search" },
  {
    id: "advertise",
    label: "Advertise a property",
    icon: Home,
    href: "/advertise",
  },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
  { id: "vids", label: "Vids", icon: Film, href: "/videos" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
];

const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const path = usePathname();
  const router = useRouter();
  const [parsedUser, setParsedUser] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setParsedUser(JSON.parse(user));
    }
  }, []);

  return (
    <aside className="flex flex-col h-full w-72 bg-white border-r border-gray-100 px-3 py-6">
      {/* Logo / Brand */}
      <div className="px-3 mb-8 flex items-center gap-2">
        <div className="flex items-center gap-2 ">
          <img src="/images/logo.svg" alt="logo" className="size-10" />
        </div>
        <h1 className="text-2xl font-semibold tracking-wide">
          HOME<span className="text-blue-500">I</span>Z
        </h1>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ id, label, icon: Icon, href }) => {
          const isActive = path === href;
          return (
            <button
              key={id}
              onClick={() => {
                router.push(href);
                onClose?.();
              }}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 w-full text-left
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <Icon
                size={20}
                className={`shrink-0 transition-colors ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              <span className="text-base">{label}</span>
              {/* {isActive && (
                <ChevronRight size={14} className="ml-auto text-blue-400" />
              )} */}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="mt-6 px-3 py-3 rounded-xl bg-gray-50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <User size={15} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            {parsedUser ? parsedUser.name : "User"}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
