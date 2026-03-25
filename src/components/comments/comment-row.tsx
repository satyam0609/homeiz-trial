"use client";

import { useState } from "react";
import { ChevronDown, ThumbsUp, Pencil } from "lucide-react";
import ReplyBox from "./reply-box";
import { Comment, CommentUser } from "./types";

const REPLIES_PREVIEW = 1;

function flattenReplies(replies: Comment[]): Comment[] {
  const result: Comment[] = [];
  for (const reply of replies) {
    result.push({ ...reply, replies: [] });
    result.push(...flattenReplies(reply.replies));
  }
  return result;
}

interface CommentRowProps {
  comment: Comment;
  postOwnerId: string;
  depth?: number;
  commentPath?: string;
  onReply: (
    commentId: string,
    replyToId: string,
    mentionName: string,
    commentPath: string,
  ) => void;
  onLike: (commentId: string) => void;
  replyTarget?: {
    commentId: string;
    replyToId: string;
    mentionName: string;
    commentPath: string;
  } | null;
  onCancelReply?: () => void;
  onSendReply?: (text: string) => void;
  currentUser?: CommentUser | null;
}

export default function CommentRow({
  comment,
  postOwnerId,
  depth = 0,
  commentPath = comment.id,
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

  const allRepliesFlat = isTopLevel ? flattenReplies(comment.replies) : [];
  const visibleReplies = isTopLevel
    ? showAllReplies
      ? allRepliesFlat
      : allRepliesFlat.slice(0, REPLIES_PREVIEW)
    : [];
  const hiddenCount = isTopLevel ? allRepliesFlat.length - REPLIES_PREVIEW : 0;

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
        <div className="flex-1 min-w-0 max-w-[60%]">
          <div className="px-3 py-2">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-bold text-[18px] text-black">
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
            <p className="text-[15px] font-semibold text-black mt-0.5 leading-snug">
              {depth > 0 && comment.mention && (
                <span className="text-blue-600 font-semibold pr-1">
                  {comment.mention}
                </span>
              )}
              {comment.text}
            </p>
          </div>

          <div className="flex items-center gap-5 mt-1.5 pl-3">
            <button
              className="text-[12px] text-gray-500 font-bold"
              onClick={() =>
                onReply(
                  comment.rootId || comment.id,
                  comment.id,
                  comment.user.name,
                  commentPath,
                )
              }
            >
              Reply
            </button>
            {comment.likes > 0 || comment.likedByMe ? (
              <button
                className="flex items-center gap-1 justify-center"
                onClick={() => onLike(comment.id)}
              >
                <div className="bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center">
                  <ThumbsUp
                    size={8}
                    className="text-white fill-white stroke-white"
                  />
                </div>

                <span className="text-[12px] text-gray-500">
                  {comment.likes}
                </span>
              </button>
            ) : null}
          </div>
        </div>

        {isTopLevel && (
          <button
            className={`mt-1 ml-5 flex-shrink-0 ${comment.likedByMe ? "text-blue-500" : "text-gray-300"}`}
            onClick={() => onLike(comment.id)}
          >
            <ThumbsUp size={16} strokeWidth={1.8} />
          </button>
        )}
      </div>

      {replyTarget &&
        replyTarget.replyToId === comment.id &&
        replyTarget.commentPath === commentPath &&
        currentUser && (
          <div className="mt-3 pl-8">
            <ReplyBox
              mentionName={replyTarget.mentionName}
              onCancel={onCancelReply!}
              onSend={onSendReply!}
              currentUser={currentUser}
              postOwnerId={postOwnerId}
            />
          </div>
        )}

      {visibleReplies.map((reply) => (
        <div key={`${commentPath}-${reply.id}`} className="mt-3">
          <CommentRow
            comment={reply}
            postOwnerId={postOwnerId}
            depth={1}
            commentPath={`${commentPath}-${reply.id}`}
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
            className="flex items-center gap-1 text-[12px] text-black font-semibold"
            onClick={() => setShowAllReplies(true)}
          >
            <ChevronDown size={13} />
            View {hiddenCount} more {hiddenCount === 1 ? "reply" : "replies"}...
          </button>
        </div>
      )}
      {showAllReplies && allRepliesFlat.length > REPLIES_PREVIEW && (
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
