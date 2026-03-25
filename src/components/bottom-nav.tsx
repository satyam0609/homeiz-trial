"use client";

import DropdownIcon from "@/assets/icons/dropdown";
import NavigationArrowIcon from "@/assets/icons/navigation";
import PlayCircleIcon from "@/assets/icons/playIcon";
import Dropdown from "@/components/dropdown";
import {
  Home,
  Bell,
  Send,
  Play,
  MapPin,
  ChevronDown,
  Divide,
} from "lucide-react";
import { useEffect } from "react";

export const NAV_ITEMS = [
  {
    id: "home",
    href: "/",
    icon: Home,
    label: "Home",
  },
  {
    id: "notifications",
    href: "/notifications",
    icon: Bell,
    label: "Notifications",
  },
  {
    id: "messages",
    href: "/messages",
    icon: NavigationArrowIcon,
    label: "Messages",
  },

  {
    id: "create",
    href: "/create",
    icon: PlayCircleIcon,
    label: "Create",
  },
  {
    id: "location",
    href: "/location",
    icon: MapPin,
    label: "Location",
  },
  {
    id: "profile",
    href: "/profile",
    icon: null,
    label: "Profile",
    isProfile: true,
  },
];

export default function BottomNav() {
  useEffect(() => {
    const existingUser = localStorage.getItem("user");

    if (!existingUser) {
      localStorage.setItem(
        "user",
        JSON.stringify({ userName: "User 1", id: 1 }),
      );
    }
  }, []);
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 py-3 bg-bluish-black backdrop-blur-md shadow-lg border border-white/10">
        {NAV_ITEMS.map((item: any) => {
          const Icon = item.icon;

          return item.isProfile ? (
            <div
              key={item.id}
              className="text-white hover:text-white transition"
            >
              <Dropdown
                trigger={
                  <div className="flex items-center gap-1 cursor-pointer">
                    <div className="h-8 w-8 bg-primary-blue rounded-full flex justify-center items-center text-sm font-normal">
                      CJ
                    </div>
                    <DropdownIcon size={18} />
                  </div>
                }
                items={[1, 2, 3, 4].map((i) => ({
                  label: `User ${i}`,
                  onClick: () => {
                    localStorage.setItem(
                      "user",
                      JSON.stringify({ userName: `User ${i}`, id: i }),
                    );
                    window.dispatchEvent(
                      new StorageEvent("storage", {
                        key: "user",
                        newValue: JSON.stringify({
                          userName: `User ${i}`,
                          id: i,
                        }),
                      }),
                    );
                  },
                }))}
                side="right"
                position="top"
              />
            </div>
          ) : (
            <button
              key={item.id}
              className={
                item?.isCenter
                  ? "bg-blue-600 text-white p-3 rounded-full shadow-md scale-110"
                  : "text-white hover:text-white transition"
              }
            >
              {Icon && <Icon size={item.id !== "create" ? 24 : 28} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
