"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronDown, Send } from "lucide-react";
import Dropdown from "@/components/dropdown";
import { useRouter } from "next/navigation";
import api from "@/config/api";
import PostCard from "@/components/feed/post-card";
import { Post } from "@/api-service/feed-api";
import { useInView } from "react-intersection-observer";
import CommentRow from "@/components/comments/comment-row";
import {
  Comment,
  CommentUser,
  PostAuthor,
  PostDetail,
  mapComment,
} from "@/components/comments/types";

const COMMENTS_LIMIT = 5;

export default function CommentsPage({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [postDetail, setPostDetail] = useState<PostDetail | null>(null);
  const [postAuthor, setPostAuthor] = useState<PostAuthor | null>(null);
  const [currentUser, setCurrentUser] = useState<CommentUser | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const loadingRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const commentsSectionRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);
  const [ready, setReady] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  const { ref: loadMoreRef, inView } = useInView();

  console.log(postId, "post id");

  const [replyTarget, setReplyTarget] = useState<{
    commentId: string;
    replyToId: string;
    mentionName: string;
    commentPath: string;
  } | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [sortLabel, setSortLabel] = useState("Newest");
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  function handleReply(
    commentId: string,
    replyToId: string,
    mentionName: string,
    commentPath: string,
  ) {
    setReplyTarget({ commentId, replyToId, mentionName, commentPath });
  }

  function handleLike(commentId: string) {
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          const isLiked = likedComments.has(commentId);
          return {
            ...comment,
            likedByMe: !isLiked,
            likes: isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }

        const updateReplies = (
          replies: typeof comment.replies,
        ): typeof comment.replies =>
          replies.map((reply) => {
            if (reply.id === commentId) {
              const isLiked = likedComments.has(commentId);
              return {
                ...reply,
                likedByMe: !isLiked,
                likes: isLiked ? reply.likes - 1 : reply.likes + 1,
              };
            }
            return {
              ...reply,
              replies: updateReplies(reply.replies),
            };
          });

        return {
          ...comment,
          replies: updateReplies(comment.replies),
        };
      }),
    );
  }

  async function handleSendComment() {
    if (!newCommentText.trim()) return;
    try {
      await api.post(`/posts/${postId}/comment`, {
        userId: Number(currentUser!.id),
        text: newCommentText.trim(),
      });
      setNewCommentText("");
      await fetchComments(1, true);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSendReply(text: string) {
    if (!replyTarget) return;
    try {
      await api.post(`/comments/${replyTarget.commentId}/reply`, {
        userId: Number(currentUser!.id),
        text,
        parentId:
          replyTarget.replyToId === replyTarget.commentId
            ? null
            : Number(replyTarget.replyToId),
      });
      await fetchComments(1, true);
    } catch (error) {
      console.log(error);
    }
    setReplyTarget(null);
  }

  function goTOHome() {
    router.replace("/");
  }

  const getPost = async () => {
    try {
      const res = await api.get(`/posts/${postId}`);
      const post = res?.data?.data;
      setPostDetail(post);
      const user = post?.user;
      setPostAuthor(user);

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setCurrentUser({
          id: String(userData.id),
          name: userData.userName,
          avatar: `no-image`,
        });

        // Fetch detailed user info in background
        api
          .get(`/users/${userData.id}`)
          .then((userRes) => {
            const userDetails = userRes?.data?.data;
            if (userDetails) {
              setCurrentUser({
                id: String(userDetails.id),
                name: userDetails.name,
                avatar:
                  userDetails.profile ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${userDetails.name}`,
              });
            }
          })
          .catch((error) => {
            console.log("Error fetching user details:", error);
          });
      } else {
        setCurrentUser({
          id: String(user?.id),
          name: user?.name,
          avatar:
            user?.profile ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`,
        });
      }
    } catch (error) {
      console.log("getPost error:", error);
    }
  };

  const fetchComments = async (pageNum: number, reset = false) => {
    if (!reset && loadingRef.current) return;
    loadingRef.current = true;
    setLoadingComments(true);
    try {
      const res = await api.get(`/posts/${postId}/comments`, {
        params: { page: pageNum, limit: COMMENTS_LIMIT },
      });
      const raw = res?.data;
      const commentsArr = Array.isArray(raw) ? raw : raw?.data || [];
      const mapped = commentsArr.map(mapComment);

      if (reset) {
        setComments(mapped);
        setPage(1);
      } else {
        setComments((prev) => [...prev, ...mapped]);
      }
      setHasMore(mapped.length >= COMMENTS_LIMIT);
    } catch (error) {
      console.log("fetchComments error:", error);
    } finally {
      loadingRef.current = false;
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    Promise.all([getPost(), fetchComments(1, true)]).finally(() => {
      setInitialLoading(false);
      // Don't set ready here - let the scroll effect handle it
    });
  }, []);

  useEffect(() => {
    if (!postDetail || !comments || hasScrolled.current) return;
    if (!loadingComments) {
      const scrollToComments = () => {
        const container = scrollRef.current;
        const target = commentsSectionRef.current;
        if (container && target) {
          const targetTop = target.offsetTop - container.offsetTop;
          container.scrollTop = targetTop; // Instant scroll
          hasScrolled.current = true;
          setReady(true); // Show content immediately after scroll
        }
      };

      // Immediate scroll with no delay
      requestAnimationFrame(scrollToComments);
    }
  }, [postDetail, comments, loadingComments]);

  useEffect(() => {
    if (inView && hasMore && !loadingComments) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchComments(nextPage);
    }
  }, [inView]);

  const postCardData: Post | null = postDetail
    ? {
        id: postDetail.id,
        content: postDetail.content,
        image: postDetail.image,
        location: postDetail.location,
        createdAt: postDetail.createdAt,
        userId: postDetail.userId,
        user: {
          ...postDetail.user,
          role: postDetail.user.role as "ADMIN" | "USER",
        },
        _count: {
          likes: postDetail.likes?.length ?? 0,
          comments: postDetail.comments?.length ?? 0,
        },
        likes: postDetail.likes ?? [],
        isCommentPage: true,
        reactionCounts: 0,
        userReaction: 0,
      }
    : null;

  return (
    <div className="h-screen flex justify-center bg-white">
      <div className="w-full bg-white h-screen flex flex-col font-sans">
        <div className="flex items-center gap-2 py-3 max-w-sm mx-auto w-full">
          <button className="text-black" onClick={goTOHome}>
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className="font-bold text-[16px] text-black">
            {postAuthor ? `${postAuthor.name} post` : "Post"}
          </h1>
        </div>

        {initialLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div
            ref={scrollRef}
            className={`flex-1 overflow-y-auto overflow-x-hidden pb-16 ${ready ? "" : "invisible"}`}
          >
            {postCardData && (
              <div className="py-2">
                <PostCard
                  post={postCardData}
                  handleReact={() => {}}
                  handleLike={() => {}}
                />
              </div>
            )}

            <div className="max-w-sm mx-auto">
              <div
                ref={commentsSectionRef}
                className="flex items-center px-4 py-2"
              >
                <Dropdown
                  trigger={
                    <button className="flex items-center gap-1 font-semibold text-[18px] text-black">
                      {sortLabel} <ChevronDown size={14} strokeWidth={2.5} />
                    </button>
                  }
                  items={[
                    { label: "Newest", onClick: () => setSortLabel("Newest") },
                    {
                      label: "All comments",
                      onClick: () => setSortLabel("All comments"),
                    },
                  ]}
                  side="left"
                />
              </div>

              <div className="px-3 pt-2 pb-4 space-y-4 min-h-screen">
                {comments.length === 0 && !loadingComments ? (
                  <p className="text-center text-gray-400 text-[14px] py-8">
                    No comments yet
                  </p>
                ) : (
                  <>
                    {comments.map((comment) => (
                      <div key={comment.id}>
                        <CommentRow
                          comment={comment}
                          postOwnerId={postAuthor ? String(postAuthor.id) : ""}
                          onReply={handleReply}
                          onLike={handleLike}
                          replyTarget={replyTarget}
                          onCancelReply={() => setReplyTarget(null)}
                          onSendReply={handleSendReply}
                          currentUser={currentUser}
                        />
                      </div>
                    ))}
                    {loadingComments && (
                      <div className="text-center py-4">
                        <span className="text-[12px] text-gray-400">
                          Loading comments...
                        </span>
                      </div>
                    )}
                  </>
                )}

                {hasMore && (
                  <div ref={loadMoreRef} className="flex justify-center py-4">
                    {loadingComments && (
                      <span className="text-[12px] text-gray-400">
                        Loading...
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-3 flex items-center gap-2 max-w-sm mx-auto w-full z-50">
          {currentUser && (
            <img
              src={currentUser.avatar}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          )}
          <input
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
            placeholder="Write a comment…"
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-[13px] text-black outline-none placeholder-gray-400"
          />
          <button
            onClick={handleSendComment}
            className={`flex-shrink-0 ${newCommentText.trim() ? "text-blue-500" : "text-gray-300"}`}
          >
            <Send size={20} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
