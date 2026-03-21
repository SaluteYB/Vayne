import { useState, useRef } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Volume2, ChevronDown } from "lucide-react";

function SentenceCard({ content, accent }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-1">
        <Volume2 size={16} style={{ color: accent }} />
        <span className="text-xs font-mono" style={{ color: accent }}>发音</span>
      </div>
      <div className="text-2xl font-bold leading-snug">"{content.en}"</div>
      <div style={{ color: accent }} className="text-sm font-mono">{content.pronunciation}</div>
      <div className="text-gray-300 text-lg">{content.zh}</div>
      <div className="mt-2 p-3 rounded-xl bg-white/10 border border-white/10">
        <span className="text-xs text-gray-400 block mb-1">💡 学习笔记</span>
        <span className="text-sm text-gray-200">{content.tip}</span>
      </div>
    </div>
  );
}

function WordCard({ content, accent }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-5xl font-bold tracking-tight" style={{ color: accent }}>
        {content.en}
      </div>
      <div className="text-sm font-mono text-gray-400">{content.pronunciation}</div>
      <div className="text-xl text-gray-200">{content.zh}</div>
      {content.example && (
        <div className="mt-2 p-4 rounded-xl bg-white/10 border border-white/10">
          <div className="text-base italic text-white mb-1">"{content.example}"</div>
          <div className="text-sm text-gray-400">{content.exampleZh}</div>
        </div>
      )}
      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
        <span className="text-xs text-gray-400 block mb-1">💡 词源记忆</span>
        <span className="text-sm text-gray-300">{content.tip}</span>
      </div>
    </div>
  );
}

function DialogueCard({ content, accent }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1">
        情景对话
      </div>
      {content.en.map((line, i) => (
        <div
          key={i}
          className={`flex gap-2 ${line.role === "B" ? "flex-row-reverse" : ""}`}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: line.role === "A" ? accent + "33" : "#ffffff22", color: line.role === "A" ? accent : "#fff" }}
          >
            {line.role}
          </div>
          <div
            className={`px-4 py-2.5 rounded-2xl max-w-[75%] ${line.role === "B" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
            style={{ background: line.role === "A" ? accent + "22" : "#ffffff15", borderColor: line.role === "A" ? accent + "44" : "transparent", border: "1px solid" }}
          >
            <div className="text-sm font-medium">{line.text}</div>
            <div className="text-xs text-gray-400 mt-0.5">{content.zh[i].text}</div>
          </div>
        </div>
      ))}
      <div className="mt-2 p-3 rounded-xl bg-white/10 border border-white/10">
        <span className="text-xs text-gray-400 block mb-1">⚡ 语言陷阱</span>
        <span className="text-sm text-gray-200">{content.tip}</span>
      </div>
    </div>
  );
}

export default function FeedCard({ post, isActive }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [floatingHeart, setFloatingHeart] = useState(false);
  const lastTap = useRef(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!liked) {
        setLiked(true);
        setLikes(l => l + 1);
        setFloatingHeart(true);
        setTimeout(() => setFloatingHeart(false), 1200);
      }
    }
    lastTap.current = now;
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(l => !l);
    setLikes(l => liked ? l - 1 : l + 1);
    if (!liked) {
      setFloatingHeart(true);
      setTimeout(() => setFloatingHeart(false), 1200);
    }
  };

  const formatNum = (n) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : n;

  return (
    <div
      className={`scroll-snap-item relative w-full shrink-0`}
      style={{ height: "calc(100vh - 60px)" }}
      onClick={handleDoubleTap}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${post.gradient}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      {/* Floating heart animation */}
      {floatingHeart && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl float-up pointer-events-none z-30">
          ❤️
        </div>
      )}

      {/* Content area */}
      <div className="absolute inset-0 flex flex-col justify-end pb-24 px-5 z-10">
        {/* Tags */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: post.accent + "33", color: post.accent, border: `1px solid ${post.accent}44` }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Main content */}
        <div className="mb-4">
          {post.content.type === "sentence" && <SentenceCard content={post.content} accent={post.accent} />}
          {post.content.type === "word" && <WordCard content={post.content} accent={post.accent} />}
          {post.content.type === "dialogue" && <DialogueCard content={post.content} accent={post.accent} />}
        </div>

        {/* User info */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold"
            style={{ background: post.accent + "33", border: `2px solid ${post.accent}` }}
          >
            {post.user.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{post.user.name}</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded font-mono font-bold"
                style={{ background: post.accent + "22", color: post.accent }}
              >
                {post.user.level}
              </span>
            </div>
            <div className="text-xs text-gray-400">今日打卡第 3 天 🔥</div>
          </div>
          <button
            className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-full border"
            style={{ borderColor: post.accent, color: post.accent }}
          >
            + 关注
          </button>
        </div>
      </div>

      {/* Right action buttons */}
      <div className="absolute right-4 bottom-28 flex flex-col items-center gap-5 z-10">
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all ${liked ? "scale-110" : ""}`}>
            <Heart size={22} fill={liked ? "#f43f5e" : "none"} color={liked ? "#f43f5e" : "white"} />
          </div>
          <span className="text-xs text-white font-medium">{formatNum(likes)}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <MessageCircle size={22} color="white" />
          </div>
          <span className="text-xs text-white font-medium">{formatNum(post.comments)}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <Share2 size={22} color="white" />
          </div>
          <span className="text-xs text-white font-medium">{formatNum(post.shares)}</span>
        </button>

        <button onClick={(e) => { e.stopPropagation(); setBookmarked(b => !b); }} className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <Bookmark size={22} fill={bookmarked ? "white" : "none"} color="white" />
          </div>
          <span className="text-xs text-white font-medium">{formatNum(post.bookmarks + (bookmarked ? 1 : 0))}</span>
        </button>
      </div>

      {/* Scroll hint */}
      {isActive && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <ChevronDown size={16} />
          <span className="text-xs">下滑看更多</span>
        </div>
      )}
    </div>
  );
}
