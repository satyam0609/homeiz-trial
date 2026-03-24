export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  mention?: string;
  timestamp: string;
  likes: number;
  likedByMe: boolean;
  replies: Comment[];
}

export interface CommentsState {
  postId: string;
  postOwner: User;
  comments: Comment[];
}

export const MOCK_POST_OWNER: User = {
  id: "user_john",
  name: "John Doe",
  avatar: "https://i.pravatar.cc/150?img=12",
};

export const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    user: {
      id: "user_lisa",
      name: "Lisa Carter",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
    text: "Awesome. Looking for a home in Lebanon TN",
    timestamp: "1d",
    likes: 1,
    likedByMe: false,
    replies: [
      {
        id: "c1_r1",
        user: MOCK_POST_OWNER,
        text: "thank you",
        mention: "Lisa Carter",
        timestamp: "19h",
        likes: 0,
        likedByMe: false,
        replies: [],
      },
      {
        id: "c1_r2",
        user: {
          id: "user_mike",
          name: "Mike Johnson",
          avatar: "https://i.pravatar.cc/150?img=33",
        },
        text: "Lebanon TN is a great area! Lots of new builds going up.",
        mention: "Lisa Carter",
        timestamp: "15h",
        likes: 2,
        likedByMe: false,
        replies: [],
      },
      {
        id: "c1_r3",
        user: {
          id: "user_sara",
          name: "Sara Williams",
          avatar: "https://i.pravatar.cc/150?img=25",
        },
        text: "We just moved there last year, love it!",
        mention: "Lisa Carter",
        timestamp: "10h",
        likes: 0,
        likedByMe: false,
        replies: [],
      },
    ],
  },
  {
    id: "c2",
    user: {
      id: "user_david",
      name: "David Brown",
      avatar: "https://i.pravatar.cc/150?img=60",
    },
    text: "What's the price range you're looking at?",
    timestamp: "22h",
    likes: 0,
    likedByMe: false,
    replies: [
      {
        id: "c2_r1",
        user: MOCK_POST_OWNER,
        text: "around 350k–450k ideally",
        mention: "David Brown",
        timestamp: "21h",
        likes: 1,
        likedByMe: false,
        replies: [],
      },
    ],
  },
  {
    id: "c3",
    user: {
      id: "user_emma",
      name: "Emma Davis",
      avatar: "https://i.pravatar.cc/150?img=44",
    },
    text: "Great post! I'm also in the market. Let's connect.",
    timestamp: "18h",
    likes: 3,
    likedByMe: false,
    replies: [],
  },
  {
    id: "c4",
    user: {
      id: "user_emma",
      name: "Emma Davis",
      avatar: "https://i.pravatar.cc/150?img=44",
    },
    text: "Great post! I'm also in the market. Let's connect.",
    timestamp: "18h",
    likes: 3,
    likedByMe: false,
    replies: [],
  },
  {
    id: "c5",
    user: {
      id: "user_emma",
      name: "Emma Davis",
      avatar: "https://i.pravatar.cc/150?img=44",
    },
    text: "Great post! I'm also in the market. Let's connect.",
    timestamp: "18h",
    likes: 3,
    likedByMe: false,
    replies: [],
  },
  {
    id: "c6",
    user: {
      id: "user_emma",
      name: "Emma Davis",
      avatar: "https://i.pravatar.cc/150?img=44",
    },
    text: "Great post! I'm also in the market. Let's connect.",
    timestamp: "18h",
    likes: 3,
    likedByMe: false,
    replies: [],
  },
];

export function generateId(): string {
  return `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function addComment(
  comments: Comment[],
  user: User,
  text: string,
): Comment[] {
  const newComment: Comment = {
    id: generateId(),
    user,
    text,
    timestamp: "Just now",
    likes: 0,
    likedByMe: false,
    replies: [],
  };
  return [newComment, ...comments];
}

export function addReply(
  comments: Comment[],
  parentId: string,
  user: User,
  mentionName: string,
  text: string,
): Comment[] {
  return comments.map((c) => {
    if (c.id === parentId) {
      const reply: Comment = {
        id: generateId(),
        user,
        text,
        mention: mentionName,
        timestamp: "Just now",
        likes: 0,
        likedByMe: false,
        replies: [],
      };
      return { ...c, replies: [...c.replies, reply] };
    }
    if (c.replies.length > 0) {
      return {
        ...c,
        replies: addReply(c.replies, parentId, user, mentionName, text),
      };
    }
    return c;
  });
}

export function toggleLike(comments: Comment[], commentId: string): Comment[] {
  return comments.map((c) => {
    if (c.id === commentId) {
      return {
        ...c,
        likedByMe: !c.likedByMe,
        likes: c.likedByMe ? c.likes - 1 : c.likes + 1,
      };
    }
    if (c.replies.length > 0) {
      return { ...c, replies: toggleLike(c.replies, commentId) };
    }
    return c;
  });
}
