import api from "@/config/api";

export interface User {
  id: number;
  name: string;
  profile: string;
  role: "ADMIN" | "USER"; // extend if needed
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  user: User;
}

export interface Like {
  id: number;
  userId: number;
  postId: number;
  reaction: string;
  createdAt: any;
}

export interface Post {
  id: number;
  content: string;
  image: string;
  location: string;
  createdAt: string;
  userId: number;
  user: User;
  //   comments: Comment[];
  likes: Like[];
  _count: {
    likes: number;
    comments: number;
  };
  isCommentPage?: boolean;
  reactionCounts: any;
  userReaction: any;
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

export const reactPost = async (payload: {
  id: number;
  body: { userId: number; reaction: string };
}) => {
  const res = await api.post(`/posts/${payload.id}/reaction`, payload.body);
  return res.data.data;
};
