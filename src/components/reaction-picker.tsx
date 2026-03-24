// "use client";
// import { useState } from "react";
// import { REACTIONS } from "@/constants";
// import { ChevronDown } from "lucide-react";

// type Props = {
//   onSelect: (id: string) => void;
//   onMoreClick?: () => void;
// };

// const ReactionPicker = ({ onSelect, onMoreClick }: Props) => {
//   const [loaded, setLoaded] = useState<Record<string, boolean>>({});

//   return (
//     <div className="flex gap-2 bg-white shadow-lg rounded-full px-3 py-2 items-center">
//       {REACTIONS.map((reaction) => (
//         <button
//           key={reaction.id}
//           onClick={() => onSelect(reaction.id)}
//           className="relative w-8 h-8 flex items-center justify-center hover:scale-125 transition-transform"
//         >
//           {!loaded[reaction.id] && (
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
//             </div>
//           )}

//           <img
//             src={`https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji/assets/3D/${reaction.file}`}
//             alt={reaction.id}
//             className={`w-8 h-8 ${
//               loaded[reaction.id] ? "opacity-100" : "opacity-0"
//             }`}
//             onLoad={() =>
//               setLoaded((prev) => ({ ...prev, [reaction.id]: true }))
//             }
//             onError={() =>
//               setLoaded((prev) => ({ ...prev, [reaction.id]: true }))
//             }
//           />
//         </button>
//       ))}

//       {/* 🔽 More Button */}
//       <button
//         onClick={onMoreClick}
//         className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 transition"
//       >
//         <ChevronDown className="h-4 w-4" />
//       </button>
//     </div>
//   );
// };

// export default ReactionPicker;

"use client";
import { REACTIONS } from "@/constants";
import { ChevronDown } from "lucide-react";

// type Props = {
//   onSelect: (id: string) => void;
//   onMoreClick?: () => void;
// };

// const ReactionPicker = ({ onSelect, onMoreClick }: Props) => {
//   return (
//     <div className="flex gap-1 bg-white shadow-lg rounded-full px-1 py-1 items-center">
//       {REACTIONS.map((reaction, index) => (
//         <button
//           key={reaction.id}
//           onClick={() => onSelect(reaction.id)}
//           style={{ animationDelay: `${index * 0.1}s` }} // 🔥 stagger effect
//           className="
//     w-8 h-8 rounded-full overflow-hidden flex items-center justify-center
//     animate-emoji-alive
//     hover:scale-110
//     active:scale-125
//     transition-transform
//   "
//         >
//           <span className="text-2xl">{reaction.emoji}</span>
//         </button>
//       ))}

//       {/* <button
//         onClick={onMoreClick}
//         className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
//       >
//         <ChevronDown className="h-4 w-4" />
//       </button> */}
//     </div>
//   );
// };

// export default ReactionPicker;

// Converts an emoji character to its Twemoji CDN URL
const toTwemojiUrl = (emoji: string): string => {
  const codePoint = [...emoji]
    .map((char) => char.codePointAt(0)!.toString(16))
    .filter((hex) => hex !== "fe0f") // strip variation selector
    .join("-");

  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/${codePoint}.svg`;
};

type Props = {
  onSelect: (id: string) => void;
  onMoreClick?: () => void;
};

const ReactionPicker = ({ onSelect, onMoreClick }: Props) => {
  return (
    <div className="flex gap-1 bg-white shadow-lg rounded-full px-1 py-1 items-center">
      {REACTIONS.map((reaction, index) => (
        <button
          key={reaction.id}
          onClick={() => onSelect(reaction.id)}
          style={{ animationDelay: `${index * 0.05}s` }}
          className="
            w-8 h-8 rounded-full flex items-center justify-center
            animate-emoji-alive
            hover:scale-110
            active:scale-125
            transition-transform
          "
        >
          <img
            src={toTwemojiUrl(reaction.emoji)}
            alt={reaction.emoji}
            width={24}
            height={24}
            draggable={false}
            className="select-none pointer-events-none"
          />
        </button>
      ))}
    </div>
  );
};

export default ReactionPicker;
