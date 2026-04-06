"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MessageCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import api from "@/config/api";
import { getCachedUserDetails } from "@/utils/user-cache";

interface Comment {
  _id: string;
  text: string;
  user: {
    _id: string;
    name: string;
    profile?: string;
  };
  createdAt: string;
  likes?: number;
}

interface PostCommentsProps {
  postId: string;
  commentsCount: number;
  onViewAllComments: () => void;
  refreshTrigger?: number;
}

const COMMENTS_LIMIT = 5;
const INITIAL_DISPLAY = 1;
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

// Exponential backoff with jitter
const getRetryDelay = (attempt: number) => {
  const exponentialDelay = BASE_DELAY * Math.pow(2, attempt);
  const jitter = Math.random() * 0.1 * exponentialDelay;
  return Math.min(exponentialDelay + jitter, 10000); // Max 10 seconds
};

const isRetryableError = (error: any) => {
  if (!error) return false;

  if (error.code === "ECONNABORTED" || error.code === "NETWORK_ERROR")
    return true;

  if (error.message?.includes("timeout")) return true;

  if (error.response?.status >= 500) return true;

  if (error.response?.status === 429) return true;

  return false;
};

export default function PostComments({
  postId,
  commentsCount,
  onViewAllComments,
  refreshTrigger = 0,
}: PostCommentsProps) {
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [showingAll, setShowingAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<{
    message: string;
    canRetry: boolean;
  } | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const initUser = async () => {
      const user = await getCachedUserDetails();
      setCurrentUser(user);
    };
    initUser();
  }, []);

  const fetchComments = useCallback(
    async (attempt = 0): Promise<void> => {
      if (commentsCount === 0) return;

      if (attempt === 0) {
        setLoading(true);
        setError(null);
        setRetryAttempt(0);
      } else {
        setRetrying(true);
        setRetryAttempt(attempt);
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const res = await api.get(`/posts/${postId}/comments`, {
          params: { page: 1, limit: COMMENTS_LIMIT },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const fetchedComments = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || [];

        setAllComments(fetchedComments);
        setHasMore(fetchedComments.length < commentsCount);
        setError(null);
        setRetryAttempt(0);
      } catch (err: any) {
        console.error(`Comment fetch attempt ${attempt + 1} failed:`, err);

        if (attempt < MAX_RETRIES && isRetryableError(err)) {
          const delay = getRetryDelay(attempt);
          console.log(
            `Retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`,
          );

          setTimeout(() => {
            fetchComments(attempt + 1);
          }, delay);
          return;
        }

        const isRetryable = isRetryableError(err);
        let errorMessage = "Failed to load comments";

        if (err.name === "AbortError" || err.message?.includes("timeout")) {
          errorMessage = "Comments are taking too long to load";
        } else if (err.response?.status === 429) {
          errorMessage = "Too many requests. Please wait a moment";
        } else if (err.response?.status >= 500) {
          errorMessage = "Server error. Please try again";
        } else if (!navigator.onLine) {
          errorMessage = "No internet connection";
        }

        setError({ message: errorMessage, canRetry: isRetryable });
        setAllComments([]);
        setHasMore(false);
        setRetryAttempt(0);
      } finally {
        setLoading(false);
        setRetrying(false);
      }
    },
    [postId, commentsCount],
  );

  const handleManualRetry = () => {
    fetchComments(0);
  };

  const handleReadMore = () => {
    if (showingAll) {
      setShowingAll(false);
    } else {
      setShowingAll(true);
    }
  };

  useEffect(() => {
    fetchComments(0);
    setShowingAll(false);
  }, [fetchComments, refreshTrigger]);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - commentDate.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  if (commentsCount === 0) {
    return (
      <div className="px-4 py-2 text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <MessageCircle size={16} />
          <span>Be the first to comment</span>
        </div>
      </div>
    );
  }

  const commentsToShow = showingAll
    ? allComments
    : allComments.slice(0, INITIAL_DISPLAY);
  const hiddenCommentsCount = allComments.length - INITIAL_DISPLAY;

  return (
    <div className="px-4 py-2 border-t border-gray-100">
      {retrying && (
        <div className="py-2 mb-2">
          <div className="flex items-center gap-2 text-blue-600 text-sm">
            <RefreshCw size={14} className="animate-spin" />
            <span>
              Retrying... (attempt {retryAttempt}/{MAX_RETRIES})
            </span>
          </div>
        </div>
      )}

      {error && !retrying && (
        <div className="py-2 mb-2">
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle
              size={16}
              className="text-red-500 mt-0.5 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-red-700 text-sm font-medium">
                {error.message}
              </p>
              {error.canRetry && (
                <button
                  onClick={handleManualRetry}
                  className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium underline"
                >
                  Try again
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-8"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && allComments.length > 0 && (
        <div className="space-y-3">
          {commentsToShow.map((comment) => (
            <div key={comment._id} className="flex items-start gap-2">
              <img
                src={
                  comment.user.profile ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user.name}`
                }
                className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-0.5"
                alt={comment.user.name}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-black">
                    {comment.user.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-800 mt-0.5 break-words">
                  {comment.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && allComments.length > INITIAL_DISPLAY && (
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={handleReadMore}
            className="flex items-center gap-1 text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors"
          >
            {showingAll ? (
              <>
                <ChevronUp size={16} />
                <span>Show less</span>
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                <span>Read more ({hiddenCommentsCount} more)</span>
              </>
            )}
          </button>

          {hasMore && (
            <button
              onClick={onViewAllComments}
              className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors"
            >
              View all {commentsCount} comments
            </button>
          )}
        </div>
      )}

      {!loading && !error && commentsCount === 1 && allComments.length > 0 && (
        <div className="mt-2">
          <button
            onClick={onViewAllComments}
            className="text-gray-500 text-xs hover:text-gray-700 transition-colors"
          >
            Reply
          </button>
        </div>
      )}
    </div>
  );
}
