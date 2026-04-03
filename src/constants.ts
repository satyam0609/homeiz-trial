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
  { id: "69cfc2f88e35fe70312765a9", value: 1, name: "User 1" },
  { id: "69cfc2fa8e35fe70312765ab", value: 2, name: "User 2" },
  { id: "69cfc2fb8e35fe70312765ad", value: 3, name: "User 3" },
  { id: "69cfc2fb8e35fe70312765b1", value: 4, name: "User 4" },
];
