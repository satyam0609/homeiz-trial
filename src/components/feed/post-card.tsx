"use client";
import {
  MoreHorizontal,
  X,
  Star,
  ThumbsUp,
  MessageCircle,
  Eye,
  Edit2Icon,
  Trash2Icon,
  Globe2,
  Globe,
  GlobeIcon,
  Globe2Icon,
} from "lucide-react";

import Separator from "../separator";
import ActionButton from "../action-button";
import { Post } from "@/api-service/feed-api";
import ShareIcon from "@/assets/icons/forward";
import ReactionPicker from "../reaction-picker";
import { useState } from "react";
import ReactionPopover from "../popover";
import PostImage from "../image-renderer";
import ImageRenderer from "../image-renderer";
import { getCurrentUser, toTwemojiUrl } from "@/utils/utils";
import { REACTION_MAP, REACTIONS, ReactionType } from "@/constants";
import { useRouter } from "next/navigation";
import CommentInput from "../comment-input";
import { commentOnPost } from "@/api-service/feed-api";
import PostComments from "../post-comments";
import Dropdown from "../dropdown";
import Avatar from "../avatar";

const PostCard = ({
  post,
  handleReact,
  handleLike,
  handleRemove,
  onCommentAdded,
}: {
  post: Post;
  handleRemove?: (postId: string) => void;
  handleReact: (postId: string, reaction: ReactionType) => void;
  handleLike: (userId: string) => void;
  onCommentAdded?: (postId: string) => void;
}) => {
  console.log(post, "-----post data");
  const [openEmojiPickerV1, setOpenEmojiPickerV1] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [commentRefreshTrigger, setCommentRefreshTrigger] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  const user = getCurrentUser();
  const [showFollow, setShowFollow] = useState(user.id !== post.user._id);

  // Find user's reaction
  const userReaction = user
    ? post?.reactions?.find((reaction) => reaction.user === user.id)
    : null;

  const isLiked = !!userReaction;

  const router = useRouter();

  const handleRedirect = () => {
    router.push(`/comment/${post._id}`);
  };

  const handleHidePost = () => {
    setIsHidden(true);
  };

  const handleUndoHide = () => {
    setIsHidden(false);
  };

  const handleComment = async (postId: string, text: string) => {
    const user = getCurrentUser();
    if (!user) return;

    try {
      await commentOnPost(postId, {
        userId: user.id,
        text,
      });
      onCommentAdded?.(postId);
      setCommentRefreshTrigger((prev) => prev + 1); // Trigger comment refresh

      router.push(`/comment/${postId}`);
    } catch (error) {
      console.error("Failed to post comment:", error);
      throw error;
    }
  };

  const MAX_LENGTH = 50;

  const isLong = post?.content.length > MAX_LENGTH;
  const displayedText = expanded
    ? post?.content
    : post?.content.slice(0, MAX_LENGTH);

  // Show hidden state
  if (isHidden) {
    return (
      <div className="bg-white border-l-4 border-gray-300">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-sm font-medium">Post hidden</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndoHide}
              className="text-gray-900 hover:text-gray-900 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors bg-gray-300 rounded-xl"
            >
              Undo
            </button>
            <Dropdown
              trigger={
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              }
              items={[
                {
                  icon: <Edit2Icon strokeWidth={2.5} size={14} />,
                  label: "Edit Post",
                  onClick: () => {
                    console.log("Edit Post");
                  },
                },
                {
                  icon: (
                    <Trash2Icon
                      strokeWidth={2.5}
                      size={14}
                      className="text-red-600"
                    />
                  ),
                  label: "Delete Post",
                  onClick: () => handleRemove?.(post._id),
                  type: "item",
                },
              ]}
            />
            <button
              onClick={() => handleRemove?.(post._id)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <Separator />
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex gap-2 px-4">
        <div>
          <Avatar
            size={42}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDR8H0rgV-zmSodkT_erGjzA_VhfWE22Pg7Q&s"
          />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex flex-1 justify-between flex-wrap gap-2">
            <div className="flex gap-2 items-center min-w-0">
              <h1 className="text-[18px] font-bold truncate max-w-40">
                {post?.user?.name}
              </h1>
              {showFollow && (
                <button
                  type="button"
                  onClick={() => {
                    console.log("follow clicked");
                    setShowFollow(false);
                  }}
                  className="text-[18px] font-bold text-blue-500 shrink-0"
                >
                  + Follow
                </button>
              )}
            </div>

            <div className="flex gap-4 items-center shrink-0">
              {user.id === post?.user?._id && (
                <Dropdown
                  trigger={
                    <button>
                      <MoreHorizontal />
                    </button>
                  }
                  items={[
                    {
                      icon: <Edit2Icon strokeWidth={2.5} size={14} />,
                      label: "Edit Post",
                      onClick: () => {
                        console.log("Edit Post");
                      },
                    },
                    {
                      icon: (
                        <Trash2Icon
                          strokeWidth={2.5}
                          size={14}
                          className="text-red-600"
                        />
                      ),
                      label: "Delete Post",
                      onClick: handleHidePost,
                      type: "item",
                    },
                  ]}
                />
              )}

              <button
                onClick={handleHidePost}
                className="bg-[rgb(242,251,255)] p-2 rounded-full"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          {/* Info */}
          <div className="flex-1 text-[18px] font-bold ">
            {post.location ?? "Kathmandu, Nepal"}
          </div>

          <div className="flex-1 text-sm font-bold flex items-center gap-3 flex-wrap">
            <span>{"AGENT"}</span>

            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i <= Math.floor(3)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-300 text-gray-300"
                  }
                />
              ))}
            </div>

            <span className="text-blue-500 font-semibold">{3}</span>

            <button className="text-gray-700 hover:underline flex items-center gap-1">
              <Star size={14} className={"text-gray-400"} />
              Reviews
            </button>
          </div>
          <div className="flex gap-2 items-center text-text-primary">
            <span className="text-base font-bold text-text-secondary">
              41 m
            </span>
            <span className="h-0.5 w-0.5 bg-text-secondary"></span>
            <Globe2Icon className="h-[18px] w-[18px] text-text-secondary" />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 mt-2">
        <div className="text-base font-bold">
          $98 000
          {!expanded && (
            <>
              <span>... </span>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-base text-text-secondary ml-1 font-semibold"
              >
                See more
              </button>
            </>
          )}
        </div>

        {expanded && (
          <>
            <div className="flex text-base font-semibold flex-wrap items-center">
              2 bds
              <Separator
                orientation="vertical"
                className="h-4 mx-1 font-semibold"
              />
              2 ba
              <Separator
                orientation="vertical"
                className="h-4 mx-1 font-semibold"
              />
              sqrt 5,800
              <Separator
                orientation="vertical"
                className="h-4 mx-1 font-semibold"
              />
              House for sale
            </div>
            <div className="text-base font-semibold">
              {post?.content || "Random Post 18"}
            </div>
            <div className="text-base font-semibold">{post.location}</div>
            <div className="text-base font-semibold">
              LUXURY
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-base text-text-secondary ml-2 font-semibold"
              >
                See less
              </button>
            </div>
          </>
        )}
      </div>

      <ImageRenderer src={post?.image} />

      {/* Actions */}
      {/* <div className="flex items-center justify-between text-gray-500 text-sm px-4 py-2">
        <ReactionPopover
          handleReact={(reaction) => {
            handleReact(post.id, reaction);
          }}
          trigger={
            <ActionButton
              icon={ThumbsUp}
              count={post?._count?.likes.toString()}
              className={isLiked ? "text-blue-500" : ""}
            />
          }
        />
        <ActionButton
          icon={MessageCircle}
          count={post?._count?.comments.toString()}
          onClick={handleRedirect}
        />
        <ActionButton icon={ShareIcon} count={"30"} />
        <ActionButton icon={Eye} count={"200"} />

        {Object.keys(post.reactionCounts).length > 0 && (
          <div className="flex items-center px-2">
            {Object.entries(post.reactionCounts || {})
              .slice(0, 3)
              .map(([type], index) => {
                const emoji = REACTION_MAP[type];

                if (!emoji) return null;

                return (
                  <span
                    key={type}
                    style={{ zIndex: 10 - index }}
                    className="w-6 h-6 flex items-center justify-center
                     bg-white rounded-full shadow-sm
                     -ml-1 first:ml-0"
                  >
                    <img
                      src={toTwemojiUrl(emoji)}
                      className="w-4 h-4"
                      alt={type}
                    />
                  </span>
                );
              })}
          </div>
        )}
      </div> */}

      <div className="flex items-center justify-between text-gray-500 text-sm px-4 py-2 gap-2">
        <div className="flex gap-1 flex-wrap min-w-0">
          <ReactionPopover
            handleReact={(reaction) => handleReact(post._id, reaction)}
            trigger={
              <ActionButton
                icon={userReaction ? undefined : ThumbsUp}
                count={post?.reactions.length.toString()}
                className={isLiked ? "text-blue-500" : ""}
                customIcon={
                  userReaction ? (
                    <img
                      src={toTwemojiUrl(REACTION_MAP[userReaction.type])}
                      className="w-4 h-4"
                      alt={userReaction.type}
                    />
                  ) : undefined
                }
              />
            }
          />

          <ActionButton
            icon={MessageCircle}
            count={post?.commentsCount.toString()}
            onClick={handleRedirect}
          />

          <ActionButton icon={ShareIcon} count={"30"} />
          <ActionButton icon={Eye} count={"200"} />
        </div>

        {/* Reactions - with better responsive handling */}
        <div className="flex items-center flex-shrink-0">
          {(
            Object.entries(post?.reactionCounts || {}) as [
              ReactionType,
              number,
            ][]
          )
            .filter(([_, count]) => count > 0) // ✅ only show non-zero
            .slice(0, 3)
            .map(([type], index) => {
              const emoji = REACTION_MAP[type];
              if (!emoji) return null;

              return (
                <span
                  key={type}
                  style={{ zIndex: 10 - index }}
                  className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm -ml-1 first:ml-0"
                >
                  <img src={toTwemojiUrl(emoji)} className="w-4 h-4" />
                </span>
              );
            })}
        </div>
      </div>

      <CommentInput postId={post._id} onComment={handleComment} />

      {/* <PostComments
        postId={post._id}
        commentsCount={post.commentsCount}
        onViewAllComments={handleRedirect}
        refreshTrigger={commentRefreshTrigger}
      /> */}

      <Separator />
    </div>
  );
};

export default PostCard;
