"use client";
import Avatar from "@/components/avatar";
import Separator from "@/components/separator";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useCallback } from "react";

const MAX_CHARS = 500;

type Privacy = "Public" | "Friends" | "Only me";
type MediaFile = {
  id: string;
  file: File;
  url: string;
  type: "image" | "video";
};
type AttachedFile = { id: string; file: File };
interface TaggedPerson {
  id: string;
  name: string;
}

const MOCK_PEOPLE = [
  "Alice Johnson",
  "Bob Martinez",
  "Carol White",
  "David Kim",
  "Emma Brown",
  "Frank Lee",
  "Grace Chen",
  "Henry Wilson",
];

const GIF_MOCKS = [
  "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Lg7russbC0/giphy.gif",
  "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif",
  "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
  "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif",
];

const EMOJIS = [
  "😀",
  "😂",
  "🥹",
  "😍",
  "🤩",
  "😎",
  "🥳",
  "😅",
  "🤔",
  "🤣",
  "❤️",
  "🔥",
  "✨",
  "👏",
  "🙌",
  "👍",
  "🎉",
  "💯",
  "🚀",
  "🌈",
  "🎨",
  "💡",
  "⭐",
  "🌸",
  "🍕",
  "🎵",
  "🏆",
  "💪",
  "🙏",
  "😭",
  "🤯",
  "😇",
  "🥰",
  "😬",
  "🤗",
  "🫶",
  "💖",
  "🌟",
  "🎯",
  "👀",
];

const PrivacyIcon = ({ value }: { value: Privacy }) => {
  if (value === "Friends")
    return (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="15" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
        <path
          d="M3 20c0-3.314 2.686-6 6-6h6c3.314 0 6 2.686 6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  if (value === "Only me")
    return (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
        <rect
          x="5"
          y="11"
          width="14"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M8 11V7a4 4 0 018 0v4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M2 12h20M12 2c-3 4-3 16 0 20M12 2c3 4 3 16 0 20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default function CreatePostPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [privacy, setPrivacy] = useState<Privacy>("Public");
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [taggedPeople, setTaggedPeople] = useState<TaggedPerson[]>([]);
  const [selectedGifs, setSelectedGifs] = useState<string[]>([]);
  const [showSheet, setShowSheet] = useState<null | "tag" | "gif" | "emoji">(
    null,
  );
  const [tagSearch, setTagSearch] = useState("");
  const [posted, setPosted] = useState(false);

  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const remaining = MAX_CHARS - text.length;

  const handlePhotoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const valid = files.filter((f) => f.size <= 3 * 1024 * 1024);
      const invalid = files.filter((f) => f.size > 3 * 1024 * 1024);
      if (invalid.length)
        alert(`${invalid.length} file(s) exceed 3 MB and were skipped.`);
      setMediaFiles((p) => [
        ...p,
        ...valid.map((f) => ({
          id: Math.random().toString(36).slice(2),
          file: f,
          url: URL.createObjectURL(f),
          type: "image" as const,
        })),
      ]);
      e.target.value = "";
    },
    [],
  );

  const handleVideoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setMediaFiles((p) => [
        ...p,
        ...files.map((f) => ({
          id: Math.random().toString(36).slice(2),
          file: f,
          url: URL.createObjectURL(f),
          type: "video" as const,
        })),
      ]);
      e.target.value = "";
    },
    [],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setAttachedFiles((p) => [
        ...p,
        ...files.map((f) => ({
          id: Math.random().toString(36).slice(2),
          file: f,
        })),
      ]);
      e.target.value = "";
    },
    [],
  );

  const removeMedia = (id: string) =>
    setMediaFiles((p) => {
      const m = p.find((x) => x.id === id);
      if (m) URL.revokeObjectURL(m.url);
      return p.filter((x) => x.id !== id);
    });
  const removeFile = (id: string) =>
    setAttachedFiles((p) => p.filter((x) => x.id !== id));
  const removeGif = (url: string) =>
    setSelectedGifs((p) => p.filter((x) => x !== url));
  const toggleTag = (name: string) =>
    setTaggedPeople((p) =>
      p.find((t) => t.name === name)
        ? p.filter((t) => t.name !== name)
        : [...p, { id: Math.random().toString(36).slice(2), name }],
    );
  const toggleGif = (url: string) =>
    setSelectedGifs((p) =>
      p.includes(url) ? p.filter((x) => x !== url) : [...p, url],
    );

  const insertEmoji = (emoji: string) => {
    const ta = textareaRef.current;
    if (!ta) {
      setText((p) => p + emoji);
      return;
    }
    const start = ta.selectionStart ?? text.length;
    const end = ta.selectionEnd ?? text.length;
    const next = text.slice(0, start) + emoji + text.slice(end);
    if (next.length <= MAX_CHARS) {
      setText(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + emoji.length;
        ta.focus();
      });
    }
  };

  const handlePost = () => {
    if (
      !text.trim() &&
      mediaFiles.length === 0 &&
      attachedFiles.length === 0 &&
      selectedGifs.length === 0
    ) {
      alert("Please add some content before posting.");
      return;
    }
    setPosted(true);
    setTimeout(() => {
      setPosted(false);
      setText("");
      setMediaFiles([]);
      setAttachedFiles([]);
      setTaggedPeople([]);
      setSelectedGifs([]);
    }, 2500);
  };

  const filteredPeople = MOCK_PEOPLE.filter((n) =>
    n.toLowerCase().includes(tagSearch.toLowerCase()),
  );
  const totalMedia = mediaFiles.length + selectedGifs.length;
  const gridClass =
    totalMedia === 1
      ? "grid-cols-1"
      : totalMedia === 2
        ? "grid-cols-2"
        : "grid-cols-3";

  const mediaActions = [
    {
      key: "photo",
      label: "Photo",
      sublabel: "User upload picture limit to 3 MB size",
      badge: mediaFiles.filter((m) => m.type === "image").length || null,
      action: () => photoRef.current?.click(),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle
            cx="8.5"
            cy="10.5"
            r="1.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M3 16l4.5-4.5 3 3 3-3 4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "video",
      label: "Video",
      sublabel:
        "Regardless of upload size (even 100 MB), videos must be compressed to a target bitrate suitable for 15-second clips, resulting in approximately 3–5 MB files at 720p",
      badge: mediaFiles.filter((m) => m.type === "video").length || null,
      action: () => videoRef.current?.click(),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
          <rect
            x="2"
            y="6"
            width="14"
            height="12"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M16 10l5-3v10l-5-3V10z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "file",
      label: "File",
      sublabel: "",
      badge: attachedFiles.length || null,
      action: () => fileRef.current?.click(),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
          <path
            d="M13.5 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8.5L13.5 3z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M13 3v6h6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "tag",
      label: "Tag people",
      sublabel: "",
      badge: taggedPeople.length || null,
      action: () => setShowSheet((s) => (s === "tag" ? null : "tag")),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
          <circle
            cx="15"
            cy="8"
            r="3"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M3 20c0-3.314 2.686-6 6-6h6c3.314 0 6 2.686 6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      key: "gif",
      label: "GIF",
      sublabel: "",
      badge: selectedGifs.length || null,
      action: () => setShowSheet((s) => (s === "gif" ? null : "gif")),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
          <rect
            x="3"
            y="6"
            width="18"
            height="12"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <text
            x="6"
            y="16"
            fontSize="7.5"
            fontWeight="bold"
            fill="currentColor"
          >
            GIF
          </text>
        </svg>
      ),
    },
    {
      key: "emoji",
      label: "Emoji",
      sublabel: "",
      badge: null,
      action: () => setShowSheet((s) => (s === "emoji" ? null : "emoji")),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M8.5 14s1 1.5 3.5 1.5 3.5-1.5 3.5-1.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
        </svg>
      ),
    },
  ];

  if (posted)
    return (
      <div className="min-h-screen bg-gray-100 flex md:items-center md:justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-4 w-full md:max-w-sm">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center animate-bounce">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="text-xl font-bold text-gray-900">Posted!</p>

          <p className="text-sm text-gray-500 text-center">
            Your post is now live as{" "}
            <span className="font-semibold text-blue-600">{privacy}</span>
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center sm:p-6">
      <style>{`
       
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style:none; scrollbar-width:none; }
        @keyframes slideUp { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        .slide-up { animation: slideUp 0.2s ease-out both; }
        @media(max-width:430px){.cp-card{border-radius:0;min-height:100dvh;}}
      `}</style>

      {/* Hidden inputs */}
      <input
        ref={photoRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handlePhotoChange}
      />
      <input
        ref={videoRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={handleVideoChange}
      />
      <input
        ref={fileRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="cp-card bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col sm:max-h-[92vh] overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-full text-text-primary hover:bg-gray-100 transition-colors"
          >
            <X className="size-6" />
          </button>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            Create post
          </span>
          <button
            onClick={handlePost}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-full px-8 py-2 text-sm font-semibold transition-all"
          >
            Post
          </button>
        </div>

        {/* User types + char */}

        {/* Scrollable body */}
        <div className="overflow-y-auto hide-scroll flex-1">
          <div className="flex items-center px-4 sm:px-6 py-2.5 border-b border-gray-100 shrink-0">
            <span className="text-sm font-bold text-text-primary border-l-[3px] border-blue-600 pl-2.5">
              User types
            </span>
          </div>
          {/* Composer */}
          <div className="px-4 sm:px-6 pt-4 pb-8 relative">
            <textarea
              ref={textareaRef}
              className="w-full border-none outline-none resize-none text-base text-gray-900 leading-relaxed bg-transparent placeholder-gray-400 min-h-17.5"
              placeholder="What's on your mind, Riva?"
              maxLength={MAX_CHARS}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
            />
            <span
              className={`absolute bottom-0 right-4 text-sm font-semibold px-2.5 py-0.5 rounded-full transition-all ${remaining < 0 ? "text-red-600 bg-red-50" : remaining < 50 ? "text-amber-600 bg-amber-50" : "text-text-primary "}`}
            >
              {remaining}
            </span>
          </div>
          <Separator />
          <div className="flex gap-3 px-4 sm:px-6 py-4 border-b border-gray-100">
            <div className="relative shrink-0">
              <Avatar name="Riva" online="online" />
            </div>
            <div className="flex-1 min-w-0 ">
              <div className="flex items-center justify-between mt-2">
                <span className="text-[15px] font-bold text-gray-900">
                  Riva Bika
                </span>
                <div className="relative">
                  <button
                    onClick={() => setShowPrivacy((v) => !v)}
                    className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-text-primary rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors"
                  >
                    <PrivacyIcon value={privacy} />
                    {privacy}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {showPrivacy && (
                    <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl z-50 w-36 overflow-hidden slide-up">
                      {(["Public", "Friends", "Only me"] as Privacy[]).map(
                        (opt) => (
                          <button
                            key={opt}
                            onClick={() => {
                              setPrivacy(opt);
                              setShowPrivacy(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors ${privacy === opt ? "text-blue-600 bg-blue-50 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                          >
                            <PrivacyIcon value={opt} />
                            {opt}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tagged chips */}
              {taggedPeople.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {taggedPeople.map((p) => (
                    <span
                      key={p.id}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full px-2.5 py-1"
                    >
                      {p.name}
                      <button
                        onClick={() => toggleTag(p.name)}
                        className="hover:text-blue-900"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M18 6L6 18M6 6l12 12"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Media grid */}
          {totalMedia > 0 && (
            <div className="px-4 sm:px-6 pb-4 border-b border-gray-100">
              <div className={`grid ${gridClass} gap-1.5`}>
                {mediaFiles.map((m) => (
                  <div
                    key={m.id}
                    className={`relative rounded-xl overflow-hidden bg-gray-100 group ${totalMedia === 3 && mediaFiles.indexOf(m) === 0 ? "col-span-2" : ""}`}
                    style={{ aspectRatio: "1" }}
                  >
                    {m.type === "image" ? (
                      <img
                        src={m.url}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    ) : (
                      <video
                        src={m.url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                    <button
                      onClick={() => removeMedia(m.id)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 shrink-0 bg-black/80 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="text-white" />
                    </button>
                  </div>
                ))}
                {selectedGifs.map((url) => (
                  <div
                    key={url}
                    className="relative rounded-xl overflow-hidden bg-gray-100 group"
                    style={{ aspectRatio: "1" }}
                  >
                    <img
                      src={url}
                      className="w-full h-full object-cover"
                      alt="gif"
                    />
                    <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      GIF
                    </span>
                    <button
                      onClick={() => removeGif(url)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-100 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M18 6L6 18M6 6l12 12"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File attachments */}
          {attachedFiles.length > 0 && (
            <div className="px-4 sm:px-6 pb-4 border-b border-gray-100 flex flex-col gap-2 pt-3">
              {attachedFiles.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 group"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M13.5 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8.5L13.5 3z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M13 3v6h6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {f.file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(f.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(f.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tag sheet */}
          {showSheet === "tag" && (
            <div className="border-b border-gray-100 px-4 sm:px-6 py-4 slide-up">
              <div className="flex items-center gap-2 mb-3">
                <p className="text-sm font-bold text-gray-800 flex-1">
                  Tag people
                </p>
                <button
                  onClick={() => setShowSheet(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                placeholder="Search friends..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 mb-2"
              />
              <div className="flex flex-col gap-1 max-h-44 overflow-y-auto hide-scroll">
                {filteredPeople.map((name) => {
                  const tagged = taggedPeople.some((t) => t.name === name);
                  return (
                    <button
                      key={name}
                      onClick={() => toggleTag(name)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${tagged ? "bg-blue-50 text-blue-700 font-semibold" : "hover:bg-gray-50 text-gray-700"}`}
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {name[0]}
                      </div>
                      {name}
                      {tagged && (
                        <svg
                          className="w-4 h-4 ml-auto text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* GIF sheet */}
          {showSheet === "gif" && (
            <div className="border-b border-gray-100 px-4 sm:px-6 py-4 slide-up">
              <div className="flex items-center gap-2 mb-3">
                <p className="text-sm font-bold text-gray-800 flex-1">
                  Choose a GIF
                </p>
                <button
                  onClick={() => setShowSheet(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto hide-scroll">
                {GIF_MOCKS.map((url) => {
                  const sel = selectedGifs.includes(url);
                  return (
                    <button
                      key={url}
                      onClick={() => toggleGif(url)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all ${sel ? "border-blue-500 scale-95" : "border-transparent"}`}
                      style={{ aspectRatio: "1" }}
                    >
                      <img
                        src={url}
                        className="w-full h-full object-cover"
                        alt="gif"
                        loading="lazy"
                      />
                      {sel && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white drop-shadow"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Emoji sheet */}
          {showSheet === "emoji" && (
            <div className="border-b border-gray-100 px-4 sm:px-6 py-4 slide-up">
              <div className="flex items-center gap-2 mb-3">
                <p className="text-sm font-bold text-gray-800 flex-1">Emojis</p>
                <button
                  onClick={() => setShowSheet(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-8 gap-1 max-h-36 overflow-y-auto hide-scroll">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => insertEmoji(e)}
                    className="text-xl p-1.5 rounded-lg hover:bg-gray-100 active:scale-90 transition-transform text-center"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action list */}
          {mediaActions.map((item) => (
            <button
              key={item.key}
              onClick={item.action}
              className={`w-full flex items-start gap-4 px-4 sm:px-6 py-3.5 border-t border-gray-50 hover:bg-gray-50 active:bg-blue-50 transition-colors text-left ${showSheet === item.key ? "bg-blue-50/60" : ""}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${showSheet === item.key ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"}`}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-900">
                    {item.label}
                  </span>
                  {item.badge ? (
                    <span className="bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                {item.sublabel && (
                  <p className="text-xs text-red-500 font-medium mt-0.5 leading-relaxed">
                    {item.sublabel}
                  </p>
                )}
              </div>
              <svg
                className="w-4 h-4 text-gray-300 mt-2 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
