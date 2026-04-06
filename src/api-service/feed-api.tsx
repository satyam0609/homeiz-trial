import api from "@/config/api";

export interface User {
  _id: string;
  name: string;
  profile: string;
}

export type ReactionType = "LIKE" | "LOVE" | "HAHA" | "WOW" | "SAD" | "ANGRY";

export interface Reaction {
  _id: string;
  user: string; // userId
  type: ReactionType;
}

export interface ReactionCounts {
  LIKE: number;
  LOVE: number;
  HAHA: number;
  WOW: number;
  SAD: number;
  ANGRY: number;
}

export interface Post {
  _id: string;
  content: string;
  image: string;
  location?: string;

  createdAt: string;
  updatedAt: string;

  user: User;

  reactions: Reaction[];
  reactionCounts: ReactionCounts;

  commentsCount: number;

  __v: number;

  // optional UI helpers
  userReaction?: ReactionType | null;
  isCommentPage?: boolean;
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
}

export const getPosts = async ({
  page = 1,
  limit = 10,
}: GetPostsParams): Promise<Post[]> => {
  const res = await api.get("/posts", {
    params: {
      page,
      limit,
    },
  });

  return res.data.data;
};

export const createPost = async (payload: any) => {
  const res = await api.post("/posts", payload);
  return res.data.data;
};

export const reactPost = async (payload: {
  id: string;
  body: { userId: string; reaction: string };
}) => {
  const res = await api.post(`/posts/${payload.id}/reaction`, payload.body);
  return res.data.data;
};

export const commentOnPost = async (postId: string, payload: {
  userId: string;
  text: string;
}) => {
  const res = await api.post(`/posts/${postId}/comment`, payload);
  return res.data.data;
};
