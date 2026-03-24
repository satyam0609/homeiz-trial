"use client";
import { useState } from "react";
import { REACTIONS } from "@/constants";
import { ChevronDown } from "lucide-react";

type Props = {
  onSelect: (id: string) => void;
  onMoreClick?: () => void;
};

const ReactionPicker = ({ onSelect, onMoreClick }: Props) => {
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  return (
    <div className="flex gap-2 bg-white shadow-lg rounded-full px-3 py-2 items-center">
      {REACTIONS.map((reaction) => (
        <button
          key={reaction.id}
          onClick={() => onSelect(reaction.id)}
          className="relative w-8 h-8 flex items-center justify-center hover:scale-125 transition-transform"
        >
          {!loaded[reaction.id] && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
            </div>
          )}

          <img
            src={`https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji/assets/3D/${reaction.file}`}
            alt={reaction.id}
            className={`w-8 h-8 ${
              loaded[reaction.id] ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() =>
              setLoaded((prev) => ({ ...prev, [reaction.id]: true }))
            }
            onError={() =>
              setLoaded((prev) => ({ ...prev, [reaction.id]: true }))
            }
          />
        </button>
      ))}

      {/* 🔽 More Button */}
      <button
        onClick={onMoreClick}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 transition"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ReactionPicker;
