"use client";
import Avatar from "@/components/avatar";
import Dropdown from "@/components/dropdown";
// import { posts } from "@/components/feed/data";
import PostCard from "@/components/feed/post-card";
import SearchBox from "@/components/searchbox";
import { getPosts, Post, reactPost } from "@/api-service/feed-api";
import { ChevronDown, Menu } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getCurrentUser } from "@/utils/utils";

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Most Liked", value: "most_liked" },
  { label: "Following Only", value: "following" },
  { label: "Most Commented", value: "most_commented" },
];

const FeedPage = () => {
  const [user, setUser] = useState<{ id: number; userName: string } | null>(
    null,
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");

  const selectedSort = SORT_OPTIONS.find((opt) => opt.value === sortBy);

  const { ref, inView } = useInView({ threshold: 1 });

  const handleReact = async (postId: number, reaction: string) => {
    if (!user) return;

    const userId = user.id;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const existingLike = post.likes.find((l) => l.userId === userId);

        let updatedLikes = [...post.likes];
        let updatedReactionCounts = { ...post.reactionCounts };
        let updatedCount = post._count.likes;

        // ✅ CASE 1: user already reacted
        if (existingLike) {
          const prevReaction = existingLike.reaction;

          // SAME reaction → REMOVE
          if (prevReaction === reaction) {
            updatedLikes = post.likes.filter((l) => l.userId !== userId);
            updatedCount -= 1;

            updatedReactionCounts[reaction] =
              (updatedReactionCounts[reaction] || 1) - 1;

            if (updatedReactionCounts[reaction] <= 0) {
              delete updatedReactionCounts[reaction];
            }
          } else {
            // DIFFERENT reaction → UPDATE
            updatedLikes = post.likes.map((l) =>
              l.userId === userId ? { ...l, reaction } : l,
            );

            // decrease old
            updatedReactionCounts[prevReaction] =
              (updatedReactionCounts[prevReaction] || 1) - 1;

            if (updatedReactionCounts[prevReaction] <= 0) {
              delete updatedReactionCounts[prevReaction];
            }

            // increase new
            updatedReactionCounts[reaction] =
              (updatedReactionCounts[reaction] || 0) + 1;
          }
        } else {
          // ✅ CASE 2: no reaction → ADD
          updatedLikes.push({
            id: Date.now(),
            userId,
            postId,
            reaction,
            createdAt: new Date().toISOString(),
          });

          updatedCount += 1;

          updatedReactionCounts[reaction] =
            (updatedReactionCounts[reaction] || 0) + 1;
        }

        return {
          ...post,
          likes: updatedLikes,
          _count: {
            ...post._count,
            likes: updatedCount,
          },
          reactionCounts: updatedReactionCounts,
        };
      }),
    );

    try {
      await reactPost({
        id: postId,
        body: { userId, reaction },
      });
    } catch (error) {
      console.error("Reaction failed");
    }
  };

  const handleLike = async (postId: number) => {
    if (!user) return; // safety

    const userId = user.id;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const existingLike = post.likes.find((l) => l.userId === userId);

        let updatedLikes = [...post.likes];
        let updatedReactionCounts = { ...post.reactionCounts };
        let updatedCount = post._count.likes;

        // CASE 1: already reacted → REMOVE
        if (existingLike) {
          const prevReaction = existingLike.reaction;

          updatedLikes = post.likes.filter((l) => l.userId !== userId);
          updatedCount -= 1;

          // decrease count
          updatedReactionCounts[prevReaction] =
            (updatedReactionCounts[prevReaction] || 1) - 1;

          if (updatedReactionCounts[prevReaction] <= 0) {
            delete updatedReactionCounts[prevReaction];
          }
        } else {
          // CASE 2: no reaction → ADD LIKE
          const newReaction = "LIKE";

          updatedLikes.push({
            id: Math.floor(Math.random() * 1_000_000_000), // random id
            userId,
            postId,
            reaction: newReaction,
            createdAt: new Date().toISOString(),
          });

          updatedCount += 1;

          updatedReactionCounts[newReaction] =
            (updatedReactionCounts[newReaction] || 0) + 1;
        }

        return {
          ...post,
          likes: updatedLikes,
          _count: {
            ...post._count,
            likes: updatedCount,
          },
          reactionCounts: updatedReactionCounts,
        };
      }),
    );

    try {
      await reactPost({
        id: postId,
        body: {
          userId,
          reaction: "LIKE",
        },
      });
    } catch (error) {
      console.error("Like failed");
    }
  };

  const loadMore = useCallback(
    async (currentPage: number) => {
      if (loading || !hasMore) return;

      try {
        setLoading(true);
        setError(null);

        const newPosts = await getPosts({ page: currentPage, limit: 10 });

        if (newPosts.length === 0) {
          setHasMore(false);
          return;
        }

        setPosts((prev) => [...prev, ...newPosts]);
        setPage(currentPage + 1);
      } catch (err) {
        setError("Failed to Load Posts");
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore],
  );

  useEffect(() => {
    if (inView && hasMore && !loading && !error) {
      loadMore(page);
    }
  }, [inView]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        setUser(getCurrentUser());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  };

  useEffect(() => {
    loadMore(1);
  }, [sortBy]);

  useEffect(() => {
    if (user) {
      setPosts([]);
      setPage(1);
      setHasMore(true);
      loadMore(1);
    }
  }, [user]);

  return (
    <>
      <div className="flex items-center gap-3 w-full px-4 mb-4">
        <div>
          <Avatar
            className="shrink-0"
            size={42}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDR8H0rgV-zmSodkT_erGjzA_VhfWE22Pg7Q&s"
          />
        </div>
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
      <section id="posts">
        {posts.map((post, index) => (
          <PostCard
            key={`${post.id}-${index}`}
            post={post}
            handleReact={handleReact}
            handleLike={handleLike}
          />
        ))}
      </section>
      <div ref={ref} className="h-10 flex justify-center items-center mb-20">
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex flex-col justify-center items-center gap-2">
            <p className="text-sm text-text-primary">
              Failed to load the posts.
            </p>
            <button
              onClick={() => {
                setError(null);
                loadMore(page); // 👈 resume from the failed page, not page + 1
              }}
              className="text-white border bg-blue-500 px-2 py-1 rounded-md"
            >
              Retry
            </button>
          </div>
        )}

        {!hasMore && !error && <span>No more posts</span>}
      </div>
    </>
  );
};

export default FeedPage;
