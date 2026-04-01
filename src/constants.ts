// export const REACTIONS = [
//   { id: "LIKE", emoji: "👍", file: "1f44d.png" },
//   { id: "LOVE", emoji: "❤️", file: "2764-fe0f.png" },
//   { id: "HAHA", emoji: "😂", file: "1f602.png" },
//   { id: "WOW", emoji: "😮", file: "1f62e.png" },
//   { id: "SAD", emoji: "😞", file: "1f525.png" },
//   { id: "ANGRY", emoji: "😠", file: "1f525.png" },
// ];

export const REACTIONS = [
  { id: "LIKE", emoji: "👍", file: "1f44d.png" },
  { id: "LOVE", emoji: "❤️", file: "2764.png" }, // simplified
  { id: "HAHA", emoji: "😂", file: "1f602.png" },
  { id: "WOW", emoji: "😮", file: "1f62e.png" },
  { id: "SAD", emoji: "😞", file: "1f61e.png" }, // ✅ fixed
  // { id: "ANGRY", emoji: "😠", file: "1f620.png" }, // ✅ fixed
  { id: "ANGRY", emoji: "😠", file: "1f620" }, // ✅ fixed
];

export const REACTION_MAP = Object.fromEntries(
  REACTIONS.map((r) => [r.id, r.emoji]),
);
