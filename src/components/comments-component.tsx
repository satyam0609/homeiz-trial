"use client";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronDown,
  Send,
  MoreHorizontal,
  X,
  Star,
  Edit2Icon,
  Trash2Icon,
  Globe2Icon,
  ThumbsUp,
  MessageCircle,
  Eye,
} from "lucide-react";
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
import Avatar from "@/components/avatar";
import Separator from "@/components/separator";
import ActionButton from "@/components/action-button";
import ShareIcon from "@/assets/icons/forward";
import ImageRenderer from "@/components/image-renderer";
import ReactionPopover from "@/components/popover";
import ReactionPicker from "@/components/reaction-picker";
import { REACTION_MAP } from "@/constants";
import { toTwemojiUrl } from "@/utils/utils";
import SendIcon from "@/assets/icons/send-svgrepo-com";

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
  const mobileCommentsSectionRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);
  const [ready, setReady] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  const { ref: loadMoreRef, inView } = useInView();

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

  function handleReactComment(commentId: string, reaction: string) {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          const alreadySame = comment.myReaction === reaction;
          return {
            ...comment,
            myReaction: alreadySame ? undefined : reaction,
            likedByMe: !alreadySame,
            likes: alreadySame
              ? comment.likes - (comment.likedByMe ? 1 : 0)
              : comment.likes + (comment.likedByMe ? 0 : 1),
          };
        }

        const updateReplies = (
          replies: typeof comment.replies,
        ): typeof comment.replies =>
          replies.map((reply) => {
            if (reply.id === commentId) {
              const alreadySame = reply.myReaction === reaction;
              return {
                ...reply,
                myReaction: alreadySame ? undefined : reaction,
                likedByMe: !alreadySame,
                likes: alreadySame
                  ? reply.likes - (reply.likedByMe ? 1 : 0)
                  : reply.likes + (reply.likedByMe ? 0 : 1),
              };
            }
            return { ...reply, replies: updateReplies(reply.replies) };
          });

        return { ...comment, replies: updateReplies(comment.replies) };
      }),
    );
  }

  async function handleSendComment() {
    if (!newCommentText.trim() || !currentUser) return;
    const text = newCommentText.trim();
    const tempId = `temp-${Date.now()}`;

    // Optimistic: add to local state immediately
    const optimisticComment: Comment = {
      id: tempId,
      text,
      timestamp: "now",
      likes: 0,
      likedByMe: false,
      user: currentUser,
      replies: [],
    };
    setComments((prev) => [optimisticComment, ...prev]);
    setNewCommentText("");

    // Fire API in background
    try {
      await api.post(`/posts/${postId}/comment`, {
        userId: Number(currentUser.id),
        text,
      });
      // Silently refresh to get real IDs
      fetchComments(1, true);
    } catch (error) {
      console.log(error);
      // Remove optimistic comment on failure
      setComments((prev) => prev.filter((c) => c.id !== tempId));
    }
  }

  async function handleSendReply(text: string) {
    if (!replyTarget || !currentUser) return;
    const tempId = `temp-${Date.now()}`;
    const { commentId, replyToId, mentionName } = replyTarget;

    // Optimistic: insert reply into the correct comment's replies
    const optimisticReply: Comment = {
      id: tempId,
      rootId: commentId,
      text,
      mention: mentionName,
      timestamp: "now",
      likes: 0,
      likedByMe: false,
      user: currentUser,
      replies: [],
    };

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, optimisticReply],
          };
        }
        return comment;
      }),
    );
    setReplyTarget(null);

    // Fire API in background
    try {
      await api.post(`/comments/${commentId}/reply`, {
        userId: Number(currentUser.id),
        text,
        parentId: replyToId === commentId ? null : Number(replyToId),
      });
      // Silently refresh to get real IDs
      fetchComments(1, true);
    } catch (error) {
      console.log(error);
      // Remove optimistic reply on failure
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: comment.replies.filter((r) => r.id !== tempId),
            };
          }
          return comment;
        }),
      );
    }
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
    });
  }, []);

  // Mobile: auto-scroll to comments section
  useEffect(() => {
    if (!postDetail || !comments || hasScrolled.current) return;
    if (!loadingComments) {
      const scrollToComments = () => {
        const container = scrollRef.current;
        const target = mobileCommentsSectionRef.current;
        if (container && target) {
          const targetTop = target.offsetTop - container.offsetTop;
          container.scrollTop = targetTop;
          hasScrolled.current = true;
          setReady(true);
        }
      };
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

  /* ─── Shared: Comments list ─── */
  const commentsContent = (
    <>
      <div ref={commentsSectionRef} className="flex items-center px-4 py-2">
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

      <div className="px-3 pt-2 pb-4 space-y-4">
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
                  onReact={handleReactComment}
                  replyTarget={replyTarget}
                  onCancelReply={() => setReplyTarget(null)}
                  onSendReply={handleSendReply}
                  currentUser={currentUser}
                />
              </div>
            ))}
            {loadingComments && (
              <div className="text-center py-4">
                <span className="text-[12px] text-text-secondary">
                  Loading comments...
                </span>
              </div>
            )}
          </>
        )}

        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-4">
            {loadingComments && (
              <span className="text-[12px] text-gray-400">Loading...</span>
            )}
          </div>
        )}
      </div>
    </>
  );

  const commentInput = (
    <div className="bg-white border-t border-gray-200 px-3 py-3 flex items-center gap-2">
      {currentUser && (
        <img
          src={currentUser.avatar}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      )}
      <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 relative">
        {!newCommentText && (
          <span className="absolute inset-0 flex items-center px-4 text-[14px] text-gray-400 pointer-events-none">
            Comment as{" "}
            <span className="font-bold text-black ml-1">
              {currentUser?.name}
            </span>
          </span>
        )}
        <input
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
          className="w-full text-[13px] text-black bg-transparent outline-none"
        />
      </div>
      <button
        onClick={handleSendComment}
        className={`flex-shrink-0 ${newCommentText.trim() ? "text-blue-500" : "text-gray-300"}`}
      >
        <SendIcon size={26} color="#0064FF" />
      </button>
    </div>
  );

  /* ─── Shared: Post header ─── */
  const postHeader = postDetail && (
    <div className="flex gap-3 p-4">
      <div className="flex-shrink-0">
        <Avatar
          size={42}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDR8H0rgV-zmSodkT_erGjzA_VhfWE22Pg7Q&s"
        />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex flex-1 justify-between">
          <div className="flex gap-2 items-center min-w-0">
            <h1 className="text-[16px] font-bold truncate">
              {postDetail?.user?.name}
            </h1>
          </div>
          <div className="flex gap-3 items-center shrink-0">
            <Dropdown
              trigger={
                <button>
                  <MoreHorizontal size={20} />
                </button>
              }
              items={[
                {
                  icon: <Edit2Icon size={14} />,
                  label: "Edit Post",
                  onClick: () => console.log("Edit Post"),
                },
                {
                  icon: <Trash2Icon size={14} />,
                  label: "Delete Post",
                  onClick: () => console.log("Delete post"),
                },
              ]}
            />
            <button onClick={goTOHome}>
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="text-[14px] font-semibold">{postDetail.location}</div>
        <div className="flex text-xs font-bold items-center gap-2 flex-wrap mt-0.5">
          <span>{postDetail?.user?.role}</span>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={12}
                className={
                  i <= 3
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-300 text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-blue-500 font-semibold text-xs">{3}</span>
        </div>
        <div className="flex gap-2 items-center text-text-primary mt-0.5">
          <span className="text-[11px] font-bold">41 m</span>
          <span className="h-0.5 w-0.5 bg-text-secondary" />
          <Globe2Icon className="h-[11px] w-[11px] text-text-secondary" />
        </div>
      </div>
    </div>
  );

  /* ─── Loading state ─── */
  if (initialLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const desktopLayout = (
    <div className="hidden md:flex h-screen bg-gray-100 flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-6 py-3 flex-shrink-0">
        <button className="text-black" onClick={goTOHome}>
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 className="font-bold text-[16px] text-black">
          {postAuthor ? `${postAuthor.name}'s post` : "Post"}
        </h1>
      </div>

      {/* Modal card */}
      <div className="flex-1 flex items-center justify-center px-6 pb-6">
        <div
          className="flex bg-white rounded-xl shadow-xl overflow-hidden max-w-5xl w-full"
          style={{ maxHeight: "85vh" }}
        >
          {/* Left: Post image */}
          <div className="w-[55%] bg-black flex items-center justify-center flex-shrink-0">
            {postDetail?.image ? (
              <img
                src={postDetail.image}
                alt="post"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-500">
                No image
              </div>
            )}
          </div>

          {/* Right: Header + Comments + Input */}
          <div className="w-[45%] flex flex-col min-h-0">
            {/* Post header */}
            <div className="border-b border-gray-200 flex-shrink-0">
              {postHeader}
            </div>

            {/* Post details */}
            {postDetail && (
              <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
                <div className="text-base font-bold">$98 000</div>
                <div className="flex text-sm flex-wrap items-center text-gray-700">
                  2 bds
                  <Separator orientation="vertical" className="h-3 mx-1" />
                  2 ba
                  <Separator orientation="vertical" className="h-3 mx-1" />
                  5,800
                  <Separator orientation="vertical" className="h-3 mx-1" />
                  House for sale
                </div>
                <div className="text-sm text-gray-600">
                  {postDetail.location}
                </div>

                {/* Action buttons */}
                {postCardData && (
                  <div className="flex items-center justify-between text-gray-500 text-sm pt-2 mt-2 border-t border-gray-100">
                    <ReactionPopover
                      onTap={() => {}}
                      trigger={
                        <ActionButton
                          icon={ThumbsUp}
                          count={postCardData._count.likes.toString()}
                        />
                      }
                    ></ReactionPopover>
                    <ActionButton
                      icon={MessageCircle}
                      count={postCardData._count.comments.toString()}
                    />
                    <ActionButton icon={ShareIcon} count={"30"} />
                    <ActionButton icon={Eye} count={"200"} />
                  </div>
                )}
              </div>
            )}

            {/* Scrollable comments */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {commentsContent}
            </div>

            {/* Fixed comment input */}
            <div className="flex-shrink-0">{commentInput}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const mobileLayout = (
    <div className="md:hidden flex justify-center bg-white h-screen">
      <div className="w-full bg-white flex flex-col font-sans h-full">
        <div className="flex items-center gap-2 py-3 max-w-sm mx-auto w-full">
          <button className="text-black" onClick={goTOHome}>
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className="font-bold text-[16px] text-black">
            {postAuthor ? `${postAuthor.name} post` : "Post"}
          </h1>
        </div>

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
            <div ref={mobileCommentsSectionRef} />
            <div className="min-h-screen">{commentsContent}</div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto w-full z-50">
          {commentInput}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {desktopLayout}
      {mobileLayout}
    </>
  );
}
