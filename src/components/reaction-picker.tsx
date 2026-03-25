"use client";
import { REACTIONS } from "@/constants";
import { ChevronDown } from "lucide-react";

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
            w-10 h-10 rounded-full flex items-center justify-center
            animate-emoji-alive
            hover:scale-110
            active:scale-125
            transition-transform
          "
        >
          <img
            src={toTwemojiUrl(reaction.emoji)}
            alt={reaction.emoji}
            width={30}
            height={30}
            draggable={false}
            className="select-none pointer-events-none"
          />
        </button>
      ))}
    </div>
  );
};

export default ReactionPicker;

// "use client";
// import { useRef, useState } from "react";
// import { REACTIONS } from "@/constants";

// // Converts emoji → Twemoji URL
// const toTwemojiUrl = (emoji: string): string => {
//   const codePoint = [...emoji]
//     .map((char) => char.codePointAt(0)!.toString(16))
//     .filter((hex) => hex !== "fe0f")
//     .join("-");

//   return `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/${codePoint}.svg`;
// };

// type Props = {
//   onSelect: (id: string) => void;
//   onMoreClick?: () => void;
// };

// const ReactionPicker = ({ onSelect }: Props) => {
//   const [active, setActive] = useState<string | null>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   // 🔥 Detect finger movement
//   const handlePointerMove = (e: React.PointerEvent) => {
//     const el = document.elementFromPoint(e.clientX, e.clientY);
//     if (!el) return;

//     const id = el.getAttribute("data-reaction-id");
//     if (id) {
//       setActive(id);
//     }
//   };

//   // 🔥 Select on release
//   const handlePointerUp = () => {
//     if (active) {
//       onSelect(active);
//     }
//     setActive(null);
//   };

//   return (
//     <div
//       ref={containerRef}
//       onPointerMove={handlePointerMove}
//       onPointerUp={handlePointerUp}
//       className="flex gap-1 bg-white shadow-lg rounded-full px-1 py-1 items-center"
//     >
//       {REACTIONS.map((reaction, index) => (
//         <button
//           key={reaction.id}
//           data-reaction-id={reaction.id}
//           onClick={() => onSelect(reaction.id)} // desktop fallback
//           style={{ animationDelay: `${index * 0.05}s` }}
//           className={`
//             w-10 h-10 rounded-full flex items-center justify-center
//             animate-emoji-alive
//             transition-all
//             ${
//               active === reaction.id
//                 ? "scale-125 -translate-y-2"
//                 : "hover:scale-110 active:scale-125"
//             }
//           `}
//         >
//           <img
//             src={toTwemojiUrl(reaction.emoji)}
//             alt={reaction.emoji}
//             width={30}
//             height={30}
//             draggable={false}
//             className="select-none pointer-events-none"
//           />
//         </button>
//       ))}
//     </div>
//   );
// };

// export default ReactionPicker;
