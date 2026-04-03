import type { ReactionCounts } from "@/api-service/feed-api";

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
  myReaction?: string;
  user: CommentUser;
  replies: Comment[];
}

export interface PostAuthor {
  _id: string;
  name: string;
  profile: string;
}

export interface PostDetail {
  _id: string;
  content: string;
  image: string;
  location: string;
  createdAt: string;
  user: { _id: string; name: string; profile: string };
  reactions: any[];
  reactionCounts: ReactionCounts;
  commentsCount: number;
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
    lookup[String(r._id ?? r.id)] = r.user?.name || "User";
  });

  const mapped = replies.map((r) => {
    const parentStr = r.parentId ? String(r.parentId) : null;
    const mention = !parentStr || parentStr === rootId
      ? commentUserName
      : lookup[parentStr] || commentUserName;
    return {
      raw: r,
      parentId: parentStr,
      comment: {
        id: String(r._id ?? r.id),
        rootId,
        text: r.text || r.content || "",
        mention,
        timestamp: r.createdAt ? timeAgo(r.createdAt) : "",
        likes: r._count?.likes ?? r.likes?.length ?? 0,
        likedByMe: false,
        user: r.user
          ? { id: String(r.user._id ?? r.user.id), name: r.user.name, avatar: r.user.profile || "" }
          : { id: String(r.userId ?? r._id), name: "User", avatar: "" },
        replies: [] as Comment[],
      },
    };
  });

  const byId: Record<string, Comment> = {};
  mapped.forEach((m) => { byId[m.comment.id] = m.comment; });

  const roots: Comment[] = [];
  mapped.forEach((m) => {
    if (m.parentId && m.parentId !== m.comment.id && byId[m.parentId]) {
      byId[m.parentId].replies.push(m.comment);
    } else {
      roots.push(m.comment);
    }
  });

  return roots;
}

export function mapComment(c: any): Comment {
  const userName = c.user?.name || "User";
  const commentId = String(c._id ?? c.id);

  return {
    id: commentId,
    text: c.text || c.content || "",
    timestamp: c.createdAt ? timeAgo(c.createdAt) : "",
    likes: c._count?.likes ?? c.likes?.length ?? 0,
    likedByMe: false,
    user: c.user
      ? { id: String(c.user._id ?? c.user.id), name: userName, avatar: c.user.profile || "" }
      : { id: String(c.userId ?? c._id), name: userName, avatar: "" },
    replies: Array.isArray(c.replies) ? buildReplyTree(c.replies, userName, commentId) : [],
  };
}
