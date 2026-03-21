import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Volume2 } from "lucide-react";

function SentenceCard({ content }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-xl font-bold text-gray-100 leading-snug">
        "{content.en}"
      </div>
      <div className="text-sm text-gray-400 font-mono">{content.pronunciation}</div>
      <div className="text-base text-gray-300">{content.zh}</div>
      <div className="mt-1 p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-400">
        💡 {content.tip}
      </div>
    </div>
  );
}

function WordCard({ content, accent }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold" style={{ color: accent }}>{content.en}</span>
        <span className="text-sm text-gray-400 font-mono">{content.pronunciation}</span>
      </div>
      <div className="text-base text-gray-300">{content.zh}</div>
      {content.example && (
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="text-sm italic text-gray-200">"{content.example}"</div>
          <div className="text-xs text-gray-500 mt-1">{content.exampleZh}</div>
        </div>
      )}
      <div className="text-sm text-gray-400">💡 {content.tip}</div>
    </div>
  );
}

function DialogueCard({ content, accent }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">情景对话</div>
      {content.en.map((line, i) => (
        <div key={i} className={`flex gap-2 ${line.role === "B" ? "flex-row-reverse" : ""}`}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1"
            style={{ background: line.role === "A" ? accent + "33" : "#ffffff18", color: line.role === "A" ? accent : "#ccc" }}
          >
            {line.role}
          </div>
          <div
            className={`px-3 py-2 rounded-2xl max-w-[80%] ${line.role === "B" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
            style={{ background: line.role === "A" ? accent + "18" : "#ffffff0f", border: "1px solid " + (line.role === "A" ? accent + "30" : "#ffffff15") }}
          >
            <div className="text-sm text-gray-100">{line.text}</div>
            <div className="text-xs text-gray-500 mt-0.5">{content.zh[i].text}</div>
          </div>
        </div>
      ))}
      <div className="mt-1 p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-400">
        ⚡ {content.tip}
      </div>
    </div>
  );
}

const typeLabel = { sentence: "句子", word: "词汇", dialogue: "对话" };

export default function FeedCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : n;

  return (
    <article className="rounded-2xl overflow-hidden border border-white/10" style={{ background: "#111" }}>
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
          style={{ background: post.accent + "22", border: `1.5px solid ${post.accent}55` }}
        >
          {post.user.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-100">{post.user.name}</span>
            <span className="text-xs px-1.5 py-0.5 rounded font-mono font-bold" style={{ background: post.accent + "22", color: post.accent }}>
              {post.user.level}
            </span>
          </div>
        </div>
        <span
          className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: post.accent + "18", color: post.accent, border: `1px solid ${post.accent}33` }}
        >
          {typeLabel[post.content.type]}
        </span>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {post.content.type === "sentence" && <SentenceCard content={post.content} accent={post.accent} />}
        {post.content.type === "word" && <WordCard content={post.content} accent={post.accent} />}
        {post.content.type === "dialogue" && <DialogueCard content={post.content} accent={post.accent} />}
      </div>

      {/* Tags */}
      <div className="flex gap-1.5 px-4 pb-3 flex-wrap">
        {post.tags.map(tag => (
          <span key={tag} className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
            #{tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 py-2.5 border-t border-white/5">
        <button
          onClick={() => { setLiked(l => !l); setLikes(n => liked ? n - 1 : n + 1); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <Heart size={16} fill={liked ? "#f43f5e" : "none"} color={liked ? "#f43f5e" : "#6b7280"} />
          <span className="text-xs text-gray-500">{fmt(likes)}</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
          <MessageCircle size={16} color="#6b7280" />
          <span className="text-xs text-gray-500">{fmt(post.comments)}</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
          <Share2 size={16} color="#6b7280" />
          <span className="text-xs text-gray-500">{fmt(post.shares)}</span>
        </button>
        <button
          onClick={() => setBookmarked(b => !b)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors ml-auto"
        >
          <Bookmark size={16} fill={bookmarked ? "white" : "none"} color={bookmarked ? "white" : "#6b7280"} />
        </button>
      </div>
    </article>
  );
}
