"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronDown,
  ThumbsUp,
  Camera,
  Smile,
  Send,
  Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/config/api";

interface PostDetail {
  id: number;
  content: string;
  image: string;
  location: string;
  createdAt: string;
  userId: number;
  user: PostAuthor;
  comments: any[];
  likes: any[];
}

interface PostAuthor {
  id: number;
  name: string;
  profile: string;
  role: string;
}

interface CommentUser {
  id: string;
  name: string;
  avatar: string;
}

interface Comment {
  id: string;
  user: CommentUser;
  text: string;
  mention?: string;
  timestamp: string;
  likes: number;
  likedByMe: boolean;
  replies: Comment[];
}

interface CommentRowProps {
  comment: Comment;
  postOwnerId: string;
  depth?: number;
  onReply: (parentId: string, mentionName: string) => void;
  onLike: (commentId: string) => void;
  replyTarget?: { parentId: string; mentionName: string } | null;
  onCancelReply?: () => void;
  onSendReply?: (text: string) => void;
  currentUser?: CommentUser | null;
}

const REPLIES_PREVIEW = 1;

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w`;
}

function CommentRow({
  comment,
  postOwnerId,
  depth = 0,
  onReply,
  onLike,
  replyTarget,
  onCancelReply,
  onSendReply,
  currentUser,
}: CommentRowProps) {
  const [showAllReplies, setShowAllReplies] = useState(false);
  const isAuthor = comment.user.id === postOwnerId;
  const isTopLevel = depth === 0;

  const visibleReplies = showAllReplies
    ? comment.replies
    : comment.replies.slice(0, REPLIES_PREVIEW);

  const hiddenCount = comment.replies.length - REPLIES_PREVIEW;

  return (
    <div className={depth > 0 ? "pl-8" : ""}>
      <div className="flex gap-2 items-start">
        {comment.user.avatar ? (
          <img
            src={comment.user.avatar}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-0.5"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gray-300 flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <div
            className={
              isTopLevel
                ? "border border-gray-300 rounded-2xl px-3 py-2.5"
                : "bg-gray-100 rounded-2xl px-3 py-2"
            }
          >
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-bold text-[13px] text-black">
                {comment.user.name}
              </span>
              <span className="text-[12px] text-gray-500">
                · {comment.timestamp}
              </span>
              {isAuthor && (
                <>
                  <span className="text-[12px] text-gray-400">·</span>
                  <Pencil size={11} className="text-blue-600" strokeWidth={2} />
                  <span className="text-blue-600 font-semibold text-[12px]">
                    Author
                  </span>
                </>
              )}
            </div>
            <p className="text-[13px] text-black mt-0.5 leading-snug">
              {comment.mention && (
                <span className="text-blue-600 font-semibold pr-1">
                  {comment.mention}
                </span>
              )}
              {comment.text}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-1.5 pl-1">
            <button
              className="text-[12px] text-gray-500 font-semibold"
              onClick={() => onReply(comment.id, comment.user.name)}
            >
              Reply
            </button>
            {comment.likes > 0 || comment.likedByMe ? (
              <button
                className="flex items-center gap-1"
                onClick={() => onLike(comment.id)}
              >
                <div className="bg-blue-500 rounded-full p-0.5">
                  <ThumbsUp size={10} className="text-white fill-white" />
                </div>
                <span className="text-[12px] text-gray-500">
                  {comment.likes}
                </span>
              </button>
            ) : null}
          </div>
        </div>

        <button
          className={`mt-1 flex-shrink-0 ${comment.likedByMe ? "text-blue-500" : "text-gray-300"}`}
          onClick={() => onLike(comment.id)}
        >
          <ThumbsUp size={16} strokeWidth={1.8} />
        </button>
      </div>

      {replyTarget && replyTarget.parentId === comment.id && currentUser && (
        <div className="mt-3 pl-8">
          <ReplyBox
            mentionName={replyTarget.mentionName}
            onCancel={onCancelReply!}
            onSend={onSendReply!}
            currentUser={currentUser}
          />
        </div>
      )}

      {visibleReplies.map((reply) => (
        <div key={reply.id} className="mt-3">
          <CommentRow
            comment={reply}
            postOwnerId={postOwnerId}
            depth={depth + 1}
            onReply={onReply}
            onLike={onLike}
            replyTarget={replyTarget}
            onCancelReply={onCancelReply}
            onSendReply={onSendReply}
            currentUser={currentUser}
          />
        </div>
      ))}

      {!showAllReplies && hiddenCount > 0 && (
        <div className="pl-8 mt-2">
          <button
            className="flex items-center gap-1 text-[12px] text-gray-500 font-medium"
            onClick={() => setShowAllReplies(true)}
          >
            <ChevronDown size={13} />
            View {hiddenCount} more {hiddenCount === 1 ? "reply" : "replies"}...
          </button>
        </div>
      )}
      {showAllReplies && comment.replies.length > REPLIES_PREVIEW && (
        <div className="pl-8 mt-2">
          <button
            className="flex items-center gap-1 text-[12px] text-gray-500 font-medium"
            onClick={() => setShowAllReplies(false)}
          >
            <ChevronDown size={13} className="rotate-180" />
            Hide replies
          </button>
        </div>
      )}
    </div>
  );
}

interface ReplyBoxProps {
  mentionName?: string;
  onCancel: () => void;
  onSend: (text: string) => void;
  currentUser: CommentUser;
}

function ReplyBox({
  mentionName,
  onCancel,
  onSend,
  currentUser,
}: ReplyBoxProps) {
  const [text, setText] = useState("");

  function handleSend() {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <div className="flex gap-2 items-start">
      <img
        src={currentUser.avatar}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-x-1 mb-1">
          <span className="font-bold text-[13px] text-black">
            {currentUser.name}
          </span>
          {mentionName && (
            <>
              <span className="text-gray-400 text-[12px]">·</span>
              <Pencil size={11} className="text-blue-600" strokeWidth={2} />
              <span className="text-blue-600 font-semibold text-[12px]">
                Author
              </span>
            </>
          )}
        </div>

        {mentionName && (
          <div className="flex items-center flex-wrap gap-x-1 mb-2">
            <span className="text-[13px] text-gray-700">Replying to</span>
            <span className="text-[13px] font-bold text-black">
              {mentionName}
            </span>
            <span className="text-gray-400 text-[12px]">·</span>
            <button
              className="text-[13px] text-black font-semibold"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        )}

        <div className="border border-gray-300 rounded-2xl px-3 py-2.5">
          {mentionName && (
            <div className="inline-flex items-center text-blue-500 text-[13px] font-medium mb-1.5">
              {mentionName}
            </div>
          )}
          <input
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={mentionName ? "Write a reply…" : "Write a comment…"}
            className="w-full text-[13px] text-black bg-transparent outline-none placeholder-gray-400 mb-2"
          />
          <div className="flex items-center justify-end gap-3">
            <button className="text-gray-500 hover:text-gray-700">
              <Camera size={18} strokeWidth={1.8} />
            </button>
            <button className="border border-gray-400 rounded px-1 py-0.5 text-[10px] font-bold text-gray-500 leading-none tracking-wide">
              GIF
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <Smile size={18} strokeWidth={1.8} />
            </button>
            <button
              onClick={handleSend}
              className={`transition-colors ${text.trim() ? "text-blue-500 hover:text-blue-600" : "text-gray-300"}`}
            >
              <Send size={18} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {!mentionName && (
          <button
            className="text-[12px] text-gray-500 mt-1.5 pl-1"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

function mapComment(c: any): Comment {
  return {
    id: String(c.id),
    user: {
      id: String(c.user?.id ?? c.userId),
      name: c.user?.name ?? `User ${c.userId}`,
      avatar: c.user?.profile ?? "",
    },
    text: c.text,
    timestamp: timeAgo(c.createdAt ?? ""),
    likes: 0,
    likedByMe: false,
    replies: (c.replies ?? []).map(mapComment),
  };
}

export default function CommentsPage({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [postDetail, setPostDetail] = useState<PostDetail | null>(null);
  const [postAuthor, setPostAuthor] = useState<PostAuthor | null>(null);
  const [currentUser, setCurrentUser] = useState<CommentUser | null>(null);
  const router = useRouter();

  const [replyTarget, setReplyTarget] = useState<
    { parentId: string; mentionName: string } | "new" | null
  >(null);

  function handleReply(parentId: string, mentionName: string) {
    setReplyTarget({ parentId, mentionName });
  }

  function handleLike(commentId: string) {}

  async function handleSend(text: string) {
    if (replyTarget === "new") {
      try {
        await api.post(`/posts/20/comment`, {
          userId: Number(currentUser!.id),
          text,
        });
        await getComments();
      } catch (error) {
        console.log(error);
      }
    } else if (replyTarget) {
      try {
        await api.post(`/comments/${replyTarget.parentId}/reply`, {
          userId: Number(currentUser!.id),
          text,
        });
        await getComments();
      } catch (error) {
        console.log(error);
      }
    }
    setReplyTarget(null);
  }

  function goTOHome() {
    router.replace("/");
  }

  const getPost = async () => {
    try {
      const res = await api.get(`/posts/20`);
      const post = res?.data?.data;
      setPostDetail(post);
      const user = post?.user;
      setPostAuthor(user);
      setCurrentUser({
        id: String(user?.id),
        name: user?.name,
        avatar: user?.profile,
      });
      if (post?.comments) {
        setComments(post.comments.map(mapComment));
      }
    } catch (error) {
      console.log("getPost error:", error);
    }
  };

  const getComments = async () => {
    try {
      const res = await api.get(`/posts/20/comments`);
      const raw = res?.data;
      const commentsArr = Array.isArray(raw) ? raw : (raw?.data || []);
      setComments(commentsArr.map(mapComment));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPost();
    getComments();
  }, []);

  return (
    <div className="min-h-screen flex justify-center bg-white">
      <div className="w-full max-w-sm bg-white min-h-screen flex flex-col font-sans">
        <div className="flex items-center gap-2 px-3 py-3">
          <button className="text-black" onClick={goTOHome}>
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className="font-bold text-[16px] text-black">
            {postAuthor ? `${postAuthor.name} post` : "Post"}
          </h1>
        </div>

        <div className="flex items-center gap-3 px-4 py-2">
          <button className="flex items-center gap-1 font-bold text-[14px] text-black">
            Newest <ChevronDown size={14} strokeWidth={2.5} />
          </button>
          <span className="text-[14px] text-black font-bold">All comments</span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pt-2 pb-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentRow
                comment={comment}
                postOwnerId={postAuthor ? String(postAuthor.id) : ""}
                onReply={handleReply}
                onLike={handleLike}
                replyTarget={replyTarget !== "new" ? replyTarget : null}
                onCancelReply={() => setReplyTarget(null)}
                onSendReply={handleSend}
                currentUser={currentUser}
              />
            </div>
          ))}

          {replyTarget === "new" && currentUser && (
            <ReplyBox
              onCancel={() => setReplyTarget(null)}
              onSend={handleSend}
              currentUser={currentUser}
            />
          )}
        </div>

        <div className="border-t border-gray-200 px-3 py-3">
          <button
            className="w-full flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5 text-[13px] text-gray-400"
            onClick={() => setReplyTarget("new")}
          >
            {currentUser && (
              <img
                src={currentUser.avatar}
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            Write a comment…
          </button>
        </div>
      </div>
    </div>
  );
}
