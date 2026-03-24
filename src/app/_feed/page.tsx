"use client";
import Avatar from "@/components/avatar";
import Dropdown from "@/components/dropdown";
// import { posts } from "@/components/feed/data";
import PostCard from "@/components/feed/post-card";
import SearchBox from "@/components/searchbox";
import { getPosts, Post } from "@/app/api-service/feed/feed-api-service";
import { ChevronDown, Menu } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Most Liked", value: "most_liked" },
  { label: "Following Only", value: "following" },
  { label: "Most Commented", value: "most_commented" },
];

const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [sortBy, setSortBy] = useState("newest");
  const selectedSort = SORT_OPTIONS.find((opt) => opt.value === sortBy);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleSortChange = (value: string) => {
    setSortBy(value);

    console.log("Sorting by:", value);
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const newPosts = await getPosts({
        page: page + 1,
        limit: 10,
      });

      if (newPosts.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => [...prev, ...newPosts]);
      setPage((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        threshold: 1,
      },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [page, loading, hasMore]);

  return (
    <>
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
              <button className="p-2 rounded-lg hover:bg-gray-100 font-bold text-sm flex items-center">
                {selectedSort?.label}
                <ChevronDown className="ml-2" />
              </button>
            }
            items={SORT_OPTIONS.map((item) => ({
              label: item.label,
              onClick: () => handleSortChange(item.value),
            }))}
          />
        </div>
      </div>
      <section id="posts" className="mt-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
      <div ref={observerRef} className="h-10 flex justify-center items-center">
        {loading && <span>Loading...</span>}
        {!hasMore && <span>No more posts</span>}
      </div>
    </>
  );
};

export default FeedPage;
