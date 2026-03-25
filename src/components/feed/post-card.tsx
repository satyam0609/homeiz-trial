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
import { toTwemojiUrl } from "@/utils/utils";
import { REACTION_MAP, REACTIONS } from "@/constants";
import { useRouter } from "next/navigation";
import Dropdown from "../dropdown";
import Avatar from "../avatar";

const PostCard = ({
  post,
  handleReact,
}: {
  post: Post;
  handleReact: (userId: number, reaction: string) => void;
}) => {
  const [openEmojiPickerV1, setOpenEmojiPickerV1] = useState(false);
  const [showFollow, setShowFollow] = useState(true);
  const isLiked = post.likes.some((like) => like.userId === 1);

  const router = useRouter();

  const handleRedirect = () => {
    router.push(`/comment/${post.id}`);
  };
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex gap-2 px-4">
        <div>
          <Avatar
            size={48}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDR8H0rgV-zmSodkT_erGjzA_VhfWE22Pg7Q&s"
          />
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex flex-1 justify-between">
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
              <Dropdown
                trigger={
                  <button>
                    <MoreHorizontal />
                  </button>
                }
                items={[
                  {
                    icon: <Edit2Icon />,
                    label: "Edit Post",
                    onClick: () => {
                      console.log("Edit Post");
                    },
                  },
                  {
                    icon: <Trash2Icon />,
                    label: "Delete Post",
                    onClick: () => console.log("Delete post"),
                  },
                ]}
              />

              <button>
                <X size={18} />
              </button>
            </div>
          </div>
          {/* Info */}
          <div className="flex-1 text-base font-bold ">{post.location}</div>

          <div className="flex-1 text-sm font-bold flex items-center gap-3 flex-wrap">
            <span>{post?.user?.role}</span>

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

            <button className="text-gray-700 hover:underline">Reviews</button>
          </div>
        </div>
      </div>

      <ImageRenderer src={post?.image} />

      {/* Details */}
      <div className="px-4 mt-2">
        <div className="text-base font-bold">{"$98 000"}</div>

        {/* <div className="flex text-sm flex-wrap items-center">
          {post?.beds} bds
          <Separator orientation="vertical" className="h-4 mx-1" />
          {post?.baths} ba
          <Separator orientation="vertical" className="h-4 mx-1" />
          {post?.area}
          <Separator orientation="vertical" className="h-4 mx-1" />
          House for sale
        </div> */}

        <div className="flex text-sm flex-wrap items-center">
          2 bds
          <Separator orientation="vertical" className="h-4 mx-1" />
          2 ba
          <Separator orientation="vertical" className="h-4 mx-1" />
          5,800
          <Separator orientation="vertical" className="h-4 mx-1" />
          House for sale
        </div>

        <div className="text-sm">{post.location}</div>
        <div className="text-sm text-gray-400">{"LUXURY"}</div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between text-gray-500 text-sm px-4 py-2">
        <ReactionPopover
          trigger={
            <ActionButton
              icon={ThumbsUp}
              count={post?._count?.likes.toString()}
              className={isLiked ? "text-blue-500" : ""}
            />
          }
        >
          <ReactionPicker
            onSelect={(reaction) => {
              handleReact(post.id, reaction);
            }}
          />
        </ReactionPopover>
        <ActionButton
          icon={MessageCircle}
          count={post?._count?.comments.toString()}
          onClick={handleRedirect}
        />
        <ActionButton icon={ShareIcon} count={"30"} />
        <ActionButton icon={Eye} count={"200"} />

        {/* <div className="flex items-center px-2">
          <span className="w-6 h-6 flex items-center justify-center bg-white rounded-full  -ml-1 first:ml-0">
            👍
          </span>
          <span className="w-6 h-6 flex items-center justify-center bg-white rounded-full  -ml-1">
            😂
          </span>
        </div> */}
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
      </div>

      <Separator />
    </div>
  );
};

export default PostCard;
