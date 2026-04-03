"use client";

import DropdownIcon from "@/assets/icons/dropdown";
import Dropdown from "@/components/dropdown";
import { getCurrentUser } from "@/utils/utils";
import { Users } from "@/constants";
import { Home, Bell, MapPin, PlayCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import NavigationArrowIcon from "@/assets/icons/navigation";

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

type CurrentUser = {
  id: string;
  name: string;
  value: number;
};

export default function BottomNav() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const defaultUser = Users[0];
    localStorage.setItem("user", JSON.stringify(defaultUser));
    setUser(defaultUser);

    const syncUser = () => {
      const current = getCurrentUser();
      if (current) setUser(current);
    };

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const getInitials = (name: string) => {
    console.log(name);
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-4 py-2 bg-bluish-black backdrop-blur-md shadow-lg border border-white/10">
        {NAV_ITEMS.map((item: any) => {
          const Icon = item.icon;

          return item.isProfile ? (
            <div key={item.id} className="text-white">
              <Dropdown
                trigger={
                  <div className="flex items-center gap-1 cursor-pointer">
                    <div className="h-8 w-8 text-xs bg-primary-blue rounded-full flex justify-center items-center font-medium">
                      {user ? getInitials(user.name) : "U"}
                    </div>
                    <DropdownIcon size={18} />
                  </div>
                }
                items={Users.map((u) => ({
                  label: u.name,
                  onClick: () => {
                    localStorage.setItem("user", JSON.stringify(u));

                    window.dispatchEvent(
                      new StorageEvent("storage", {
                        key: "user",
                        newValue: JSON.stringify(u),
                      }),
                    );
                  },
                  selected: user?.id === u.id,
                }))}
                side="right"
                position="top"
              />
            </div>
          ) : (
            <button
              key={item.id}
              className="text-white hover:text-white transition"
            >
              {Icon && <Icon size={24} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
