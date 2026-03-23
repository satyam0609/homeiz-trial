"use client";
import AuthLayout from "@/components/auth-layout";
import Avatar from "@/components/avatar";
import Dropdown from "@/components/dropdown";
import { posts } from "@/components/home/data";
import PostCard from "@/components/home/post-card";
import Post from "@/components/home/post-card";
import SearchBox from "@/components/searchbox";
import { ArrowDown, ChevronDown, Menu, MoreVertical } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-2 flex-1 justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="flex items-center gap-3 w-full px-4 mb-4">
          <Avatar
            className="shrink-0"
            size={42}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDR8H0rgV-zmSodkT_erGjzA_VhfWE22Pg7Q&s"
          />

          <div className="flex-1">
            <SearchBox placeholder="Start a post" />
          </div>
        </div>
        <div className="flex justify-between bg-sky-200 px-4 py-4">
          <div className="flex gap-2 items-center">
            <Menu />
            <span className="font-bold text-sm">Sort posts by</span>
          </div>
          <div className="flex items-center">
            <Dropdown
              trigger={
                <button className="p-2 rounded-lg hover:bg-gray-100 font-bold text-sm whitespace-nowrap flex items-center">
                  Newest first
                  <ChevronDown className="ml-2" />
                </button>
              }
              items={[
                { label: "Edit", onClick: () => console.log("Edit") },
                { label: "Delete", onClick: () => console.log("Delete") },
                { label: "Logout", onClick: () => console.log("Logout") },
              ]}
            />
          </div>
        </div>
        <section id="posts" className="mt-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      </div>
    </AuthLayout>
  );
}
