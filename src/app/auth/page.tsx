"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Dropdown from "@/components/dropdown";

const users = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  userName: `User ${i + 1}`,
}));

export default function AuthPage() {
  const [selected, setSelected] = useState(users[0]);
  const router = useRouter();

  function handleLogin() {
    localStorage.setItem("user", JSON.stringify(selected));
    router.replace("/");
  }

  return (
    <div className="min-h-screen flex justify-center bg-white">
      <div className="w-full max-w-sm flex flex-col items-center justify-center gap-6 px-4">
        <h1 className="text-xl font-bold text-black">Select a user</h1>

        <Dropdown
          trigger={
            <button className="flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2.5 text-[14px] font-semibold text-black">
              {selected.userName} <ChevronDown size={14} strokeWidth={2.5} />
            </button>
          }
          items={users.map((u) => ({
            label: u.userName,
            onClick: () => setSelected(u),
          }))}
          side="left"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white font-semibold text-[15px] rounded-full py-3 hover:bg-blue-600 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
