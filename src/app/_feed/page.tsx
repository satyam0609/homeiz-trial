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
import SearchButton from "@/components/search-button";
import { useRouter } from "next/navigation";
import { ReactionType } from "@/constants";

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Most Liked", value: "most_liked" },
  { label: "Following Only", value: "following" },
  { label: "Most Commented", value: "most_commented" },
];

const FeedPage = () => {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    value: number;
  } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const router = useRouter();

  const selectedSort = SORT_OPTIONS.find((opt) => opt.value === sortBy);

  const { ref, inView } = useInView({ rootMargin: "300px", threshold: 1 });

  const handleReact = async (postId: string, reaction: ReactionType) => {
    if (!user) return;

    const userId = user.id;

    setPosts((prev) =>
      prev.map((post) => {
        if (post._id !== postId) return post;

        const existingReaction = post.reactions.find((r) => r.user === userId);

        let updatedReactions = [...post.reactions];
        let updatedReactionCounts = { ...post.reactionCounts };

        // ✅ CASE 1: user already reacted
        if (existingReaction) {
          const prevReaction = existingReaction.type;

          // 👉 SAME → REMOVE
          if (prevReaction === reaction) {
            updatedReactions = post.reactions.filter((r) => r.user !== userId);

            updatedReactionCounts[reaction] =
              (updatedReactionCounts[reaction] || 1) - 1;
          } else {
            // 👉 DIFFERENT → UPDATE
            updatedReactions = post.reactions.map((r) =>
              r.user === userId ? { ...r, type: reaction } : r,
            );

            // decrease old
            updatedReactionCounts[prevReaction] =
              (updatedReactionCounts[prevReaction] || 1) - 1;

            // increase new
            updatedReactionCounts[reaction] =
              (updatedReactionCounts[reaction] || 0) + 1;
          }
        } else {
          // ✅ CASE 2: ADD
          updatedReactions.push({
            _id: Date.now().toString(),
            user: userId,
            type: reaction,
          });

          updatedReactionCounts[reaction] =
            (updatedReactionCounts[reaction] || 0) + 1;
        }

        return {
          ...post,
          reactions: updatedReactions,
          reactionCounts: updatedReactionCounts,
          userReaction: existingReaction?.type === reaction ? null : reaction,
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

  const handleLike = async (postId: string) => {
    if (!user) return; // safety

    const userId = user?.id;

    setPosts((prev) =>
      prev.map((post) => {
        if (post?._id !== postId) return post;

        const existingLike = post?.reactions.find((l) => l.user === userId);

        let updatedLikes = [...post?.reactions];
        let updatedReactionCounts = { ...post?.reactionCounts };
        let updatedCount = post?.reactions.length;

        // CASE 1: already reacted → REMOVE
        if (existingLike) {
          const prevReaction = existingLike?.type;

          updatedLikes = post?.reactions.filter((l) => l.user !== userId);
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
            _id: "xyz",
            type: newReaction,
            user: userId,
          });

          updatedCount += 1;

          updatedReactionCounts[newReaction] =
            (updatedReactionCounts[newReaction] || 0) + 1;
        }

        return {
          ...post,
          likes: updatedLikes,
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

        const newPosts = await getPosts({ page: currentPage, limit: 4 });

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

  const handleCommentAdded = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
          };
        }
        return post;
      })
    );
  };

  const handleRemovePost = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post?._id !== postId));
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
      <div className="flex flex-wrap items-center gap-3 w-full px-4 mb-4 py-2 md:py-6">
        <div className="shrink-0">
          <Avatar
            className="shrink-0"
            size={42}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDR8H0rgV-zmSodkT_erGjzA_VhfWE22Pg7Q&s"
          />
        </div>

        <div className="flex-1 min-w-0">
          <SearchButton
            className="w-full"
            onClick={() => router.push("/create-post")}
            label="Start a post, Jhon"
          />
        </div>
      </div>
      {/* <div className="flex items-center gap-3 w-full px-4 mb-4 py-2 md:py-6">
        <div>
          <Avatar
            className="shrink-0"
            size={42}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDR8H0rgV-zmSodkT_erGjzA_VhfWE22Pg7Q&s"
          />
        </div>
        <div className="flex-1">
          <SearchButton
            onClick={() => {
              router.push("/create-post");
            }}
            label="Start a post, Jhon"
          />
        </div>
      </div> */}
      {/* <div className="flex justify-between bg-[#b3e3ff] px-4 py-1.5 mb-4">
        <div className="flex gap-2 items-center">
          <Menu strokeWidth={2} />
          <span className="font-bold text-lg">Sort By</span>
        </div>

        <div className="flex items-center">
          <Dropdown
            trigger={
              <button className="p-2 rounded-lg hover:bg-gray-100 font-bold text-lg flex items-center">
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
      </div> */}
      <div className="flex flex-wrap items-center justify-between gap-2  bg-[rgb(186,242,242)] px-4 py-2 mb-4">
        <div className="flex gap-2 items-center">
          <Menu strokeWidth={2} />
          <span className="font-bold text-lg whitespace-nowrap">Sort By</span>
        </div>

        <div className="flex items-center">
          <Dropdown
            trigger={
              <button className="p-2 rounded-lg hover:bg-gray-100 font-bold text-lg flex items-center whitespace-nowrap">
                <span className="truncate max-w-35">{selectedSort?.label}</span>
                <ChevronDown className="ml-2 shrink-0" />
              </button>
            }
            items={SORT_OPTIONS.map((item) => ({
              label: item.label,
              onClick: () => handleSortChange(item.value),
            }))}
          />
        </div>
      </div>
      <section id="posts" className="">
        {posts.map((post, index) => (
          <PostCard
            key={`${post._id}-${index}`}
            post={post}
            handleReact={handleReact}
            handleLike={handleLike}
            handleRemove={handleRemovePost}
            onCommentAdded={handleCommentAdded}
          />
        ))}
      </section>
      <div
        ref={ref}
        className={`flex justify-center  mb-20 ${posts.length === 0 ? "min-h-[60vh]" : "h-10"}`}
      >
        {loading && (
          <div className="flex items-start justify-center">
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
