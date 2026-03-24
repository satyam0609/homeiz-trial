"use client";
import AuthLayout from "@/components/auth-layout";
import Avatar from "@/components/avatar";

import SearchBox from "@/components/searchbox";
import FeedPage from "./_feed/page";

export default function Home() {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-2 flex-1 justify-center bg-zinc-50 font-sans ">
        <FeedPage />
      </div>
    </AuthLayout>
  );
}
