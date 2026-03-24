// import {
//   MoreHorizontal,
//   X,
//   Star,
//   ThumbsUp,
//   MessageCircle,
//   Repeat2,
//   Eye,
//   Share,
// } from "lucide-react";
// import React from "react";
// import property from "./images/property1.jpg";
// import Image from "next/image";
// import Separator from "../separator";
// import ActionButton from "../action-button";

// const Post = () => {
//   return (
//     <div>
//       <div className="flex justify-between px-4">
//         <div className="flex gap-2 items-center min-w-0">
//           <h1 className="text-[18px] font-bold truncate max-w-37.5">
//             Jhon Zimmer Very Long Name Example
//           </h1>

//           <button
//             type="button"
//             className="text-[18px] font-bold text-blue-500 shrink-0"
//           >
//             + Follow
//           </button>
//         </div>

//         <div className="flex gap-4 items-center shrink-0">
//           <button>
//             <MoreHorizontal />
//           </button>
//           <button>
//             <X size={18} />
//           </button>
//         </div>
//       </div>
//       <div className="text-base font-bold px-4">Agoura Hills, CA</div>
//       <div className="text-sm font-bold px-4 flex items-center gap-3 flex-wrap">
//         <span>Real Estate Agent</span>

//         {/* Stars */}
//         <div className="flex items-center">
//           {[1, 2, 3, 4, 5].map((i) => (
//             <Star
//               key={i}
//               size={14}
//               className={`${
//                 i <= 3
//                   ? "fill-yellow-400 text-yellow-400"
//                   : "fill-gray-300 text-gray-300"
//               }`}
//             />
//           ))}
//         </div>

//         {/* Rating */}
//         <span className="text-blue-500 font-semibold">3.5</span>

//         <Star size={14} className={"text-text-tertary"} />
//         <button className="text-gray-700 hover:underline">Review</button>
//       </div>
//       <div className="mt-4">
//         <div className="w-full">
//           <Image
//             src={property}
//             alt="property"
//             className="w-full h-auto object-contain"
//           />
//         </div>
//         <div className="px-4 mt-2">
//           <div className="text-base font-bold">$ 980000</div>
//           <div className="flex relative text-sm">
//             5 bds <Separator orientation="vertical" className="h-4 mt-0.5" />
//             5 ba <Separator orientation="vertical" className="h-4 mt-0.5" />
//             5,050 sqrt
//             <Separator orientation="vertical" className="h-4 mt-0.5" />
//             House for sale
//           </div>
//           <div className="text-sm">
//             8246 Woodshill Tri, Los Angles , CA 90890
//           </div>
//           <div className="text-sm text-text-tertary">LUXURY COLLECTIVE</div>
//         </div>
//       </div>

//       <div className="flex items-center justify-between text-gray-500 text-sm px-4 py-2">
//         <ActionButton
//           icon={ThumbsUp}
//           count="1K"
//           onClick={() => console.log("Like")}
//         />
//         <ActionButton
//           icon={MessageCircle}
//           count="220"
//           onClick={() => console.log("Comment")}
//         />
//         <ActionButton
//           icon={Share}
//           count="24"
//           onClick={() => console.log("Share")}
//         />
//         <ActionButton
//           icon={Eye}
//           count="50"
//           onClick={() => console.log("View")}
//         />

//         <div className="flex items-center gap-1 px-2">
//           <span className="text-blue-500">👍</span>
//           <span>😂</span>
//         </div>
//       </div>
//       <Separator />
//     </div>
//   );
// };

// export default Post;

// components/post-card.tsx
import {
  MoreHorizontal,
  X,
  Star,
  ThumbsUp,
  MessageCircle,
  Eye,
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

const PostCard = ({ post }: { post: Post }) => {
  const [openEmojiPickerV1, setOpenEmojiPickerV1] = useState(false);
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex justify-between px-4">
        <div className="flex gap-2 items-center min-w-0">
          <h1 className="text-[18px] font-bold truncate max-w-40">
            {post?.user?.name}
          </h1>
          <button className="text-[18px] font-bold text-blue-500 shrink-0">
            + Follow
          </button>
        </div>

        <div className="flex gap-4 items-center shrink-0">
          <button>
            <MoreHorizontal />
          </button>
          <button>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="text-base font-bold px-4">{post.location}</div>

      <div className="text-sm font-bold px-4 flex items-center gap-3 flex-wrap">
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
            />
          }
        >
          <ReactionPicker
            onSelect={(reaction) => {
              console.log(reaction);
            }}
          />
        </ReactionPopover>
        <ActionButton
          icon={MessageCircle}
          count={post?._count?.comments.toString()}
        />
        <ActionButton icon={ShareIcon} count={"30"} />
        <ActionButton icon={Eye} count={"200"} />

        <div className="flex items-center gap-1 px-2">
          <span className="text-blue-500">👍</span>
          <span>😂</span>
        </div>
      </div>

      <Separator />
    </div>
  );
};

export default PostCard;
