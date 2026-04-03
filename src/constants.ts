// export const REACTIONS = [
//   { id: "LIKE", emoji: "👍", file: "1f44d.png" },
//   { id: "LOVE", emoji: "❤️", file: "2764-fe0f.png" },
//   { id: "HAHA", emoji: "😂", file: "1f602.png" },
//   { id: "WOW", emoji: "😮", file: "1f62e.png" },
//   { id: "SAD", emoji: "😞", file: "1f525.png" },
//   { id: "ANGRY", emoji: "😡", file: "1f525.png" },
// ];

export const REACTIONS = [
  { id: "LIKE", emoji: "👍", file: "1f44d.png" },
  { id: "LOVE", emoji: "❤️", file: "2764.png" },
  { id: "HAHA", emoji: "😂", file: "1f602.png" },
  { id: "WOW", emoji: "😮", file: "1f62e.png" },
  { id: "SAD", emoji: "😞", file: "1f61e.png" },
  { id: "ANGRY", emoji: "😡", file: "1f620.png" },
] as const;

export type ReactionType = (typeof REACTIONS)[number]["id"];

// export const REACTION_MAP = Object.fromEntries(
//   REACTIONS.map((r) => [r.id, r.emoji]),
// );
export const REACTION_MAP: Record<ReactionType, string> = Object.fromEntries(
  REACTIONS.map((r) => [r.id, r.emoji]),
) as Record<ReactionType, string>;

export const Users = [
  { id: "69cf7d84bfe20eefbd695ed6", value: 1, name: "User 1" },
  { id: "69cf7d84bfe20eefbd695ed8", value: 2, name: "User 2" },
  { id: "69cf7d85bfe20eefbd695eda", value: 3, name: "User 3" },
  { id: "69cf7d85bfe20eefbd695edc", value: 4, name: "User 4" },
];
