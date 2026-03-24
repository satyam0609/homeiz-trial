export interface CommentUser {
  id: string;
  name: string;
  avatar: string;
}

export interface Comment {
  id: string;
  rootId?: string;
  text: string;
  mention?: string;
  timestamp: string;
  likes: number;
  likedByMe: boolean;
  user: CommentUser;
  replies: Comment[];
}

export interface PostAuthor {
  id: number;
  name: string;
  profile: string;
}

export interface PostDetail {
  id: number;
  content: string;
  image: string;
  location: string;
  createdAt: string;
  userId: number;
  user: { id: number; name: string; profile: string; role: string };
  comments: any[];
  likes: any[];
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
}

function buildReplyTree(replies: any[], commentUserName: string, rootId: string): Comment[] {
  const lookup: Record<string, string> = {};
  replies.forEach((r) => {
    lookup[String(r.id)] = r.user?.name || `User ${r.userId}`;
  });

  const mapped = replies.map((r) => {
    const mention = r.parentId
      ? lookup[String(r.parentId)] || commentUserName
      : commentUserName;
    return {
      raw: r,
      parentId: r.parentId ? String(r.parentId) : null,
      comment: {
        id: String(r.id),
        rootId,
        text: r.text || r.content || "",
        mention,
        timestamp: r.createdAt ? timeAgo(r.createdAt) : "",
        likes: r._count?.likes ?? r.likes?.length ?? 0,
        likedByMe: false,
        user: r.user
          ? { id: String(r.user.id), name: r.user.name, avatar: r.user.profile || "" }
          : { id: String(r.userId), name: `User ${r.userId}`, avatar: "" },
        replies: [] as Comment[],
      },
    };
  });

  const byId: Record<string, Comment> = {};
  mapped.forEach((m) => { byId[m.comment.id] = m.comment; });

  const roots: Comment[] = [];
  mapped.forEach((m) => {
    if (m.parentId && m.parentId !== rootId && byId[m.parentId]) {
      byId[m.parentId].replies.push(m.comment);
    } else {
      roots.push(m.comment);
    }
  });

  return roots;
}

export function mapComment(c: any): Comment {
  const userName = c.user?.name || `User ${c.userId}`;
  const commentId = String(c.id);

  return {
    id: commentId,
    text: c.text || c.content || "",
    timestamp: c.createdAt ? timeAgo(c.createdAt) : "",
    likes: c._count?.likes ?? c.likes?.length ?? 0,
    likedByMe: false,
    user: c.user
      ? { id: String(c.user.id), name: userName, avatar: c.user.profile || "" }
      : { id: String(c.userId), name: userName, avatar: "" },
    replies: Array.isArray(c.replies) ? buildReplyTree(c.replies, userName, commentId) : [],
  };
}
