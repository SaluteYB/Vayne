import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, ChevronRight } from "lucide-react";

const fmt = (n) =>
  n >= 10000 ? (n / 10000).toFixed(1) + "w" : n >= 1000 ? (n / 1000).toFixed(1) + "k" : n;

// Apple / Tesla — obsidian dark, each card a mood
const THEMES = [
  { bg: "radial-gradient(ellipse at 22% 28%, #1b2d4f 0%, #070d1c 100%)", accent: "#4d8eff" },
  { bg: "radial-gradient(ellipse at 78% 72%, #28142e 0%, #0a0509 100%)", accent: "#bf8aff" },
  { bg: "radial-gradient(ellipse at 38% 22%, #0b1f14 0%, #040908 100%)", accent: "#3ecf8e" },
  { bg: "radial-gradient(ellipse at 64% 78%, #221710 0%, #0d0905 100%)", accent: "#d4924a" },
  { bg: "radial-gradient(ellipse at 18% 62%, #14101d 0%, #08040e 100%)", accent: "#a88beb" },
  { bg: "linear-gradient(145deg, #0d1117 0%, #161d2c 45%, #0d1117 100%)", accent: "#58a6ff" },
  { bg: "radial-gradient(ellipse at 50% 50%, #161616 0%, #080808 100%)", accent: "#e0e0e0" },
  { bg: "radial-gradient(ellipse at 30% 68%, #1c1608 0%, #0c0a04 100%)", accent: "#c9a84c" },
];

export default function VideoCard({ post, isActive, cardIndex }) {
  const [subIdx, setSubIdx] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [vocabOpen, setVocabOpen] = useState(false);

  const { bg, accent } = THEMES[cardIndex % THEMES.length];
  const sub = post.subtitles[subIdx];
  const total = post.subtitles.length;

  // Reset on slide-away
  if (!isActive && subIdx !== 0) setSubIdx(0);

  const handleTap = () => setSubIdx(i => (i + 1) % total);

  return (
    <div
      style={{ height: "100%", position: "relative", background: bg, overflow: "hidden", userSelect: "none" }}
      onClick={handleTap}
    >
      {/* Ambient glow — top-right corner */}
      <div style={{
        position: "absolute", top: -120, right: -120, width: 360, height: 360,
        borderRadius: "50%", background: accent, opacity: 0.06,
        filter: "blur(90px)", pointerEvents: "none",
      }} />
      {/* Secondary glow — bottom-left */}
      <div style={{
        position: "absolute", bottom: -80, left: -80, width: 280, height: 280,
        borderRadius: "50%", background: accent, opacity: 0.04,
        filter: "blur(70px)", pointerEvents: "none",
      }} />

      {/* ── Top badge ── */}
      <div style={{ position: "absolute", top: 58, left: 20, right: 20, zIndex: 10 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7,
          background: "rgba(255,255,255,0.055)", backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "0.5px solid rgba(255,255,255,0.09)", borderRadius: 24,
          padding: "5px 14px",
        }}>
          <span style={{ color: accent, fontSize: 10, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase" }}>
            {post.show}
          </span>
          <span style={{ width: 1, height: 10, background: "rgba(255,255,255,0.15)" }} />
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: 0.5 }}>{post.episode}</span>
        </div>
        <div style={{ marginTop: 7, paddingLeft: 2,
          color: "rgba(255,255,255,0.28)", fontSize: 11, letterSpacing: 0.6 }}>
          {post.scene}
        </div>
      </div>

      {/* ── Main content (vertically centered) ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 28px 80px",
      }}>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 5, marginBottom: 36, alignItems: "center" }}>
          {post.subtitles.map((_, i) => (
            <div key={i} style={{
              height: 2, borderRadius: 2,
              width: i === subIdx ? 22 : 5,
              background: i === subIdx ? accent : "rgba(255,255,255,0.14)",
              transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
            }} />
          ))}
        </div>

        {/* English */}
        <div style={{
          fontSize: 27, fontWeight: 600, color: "#fff", lineHeight: 1.5,
          letterSpacing: -0.4,
          fontFamily: '-apple-system,"SF Pro Display",BlinkMacSystemFont,sans-serif',
          marginBottom: 18,
        }}>
          &ldquo;{sub.en}&rdquo;
        </div>

        {/* Chinese */}
        <div style={{
          fontSize: 15, color: "rgba(255,255,255,0.42)", lineHeight: 1.7,
          letterSpacing: 0.6, fontWeight: 400,
        }}>
          {sub.zh}
        </div>

        {/* Tap hint */}
        <div style={{
          display: "flex", alignItems: "center", gap: 3, marginTop: 30,
          color: "rgba(255,255,255,0.16)", fontSize: 11, letterSpacing: 0.6,
        }}>
          <ChevronRight size={11} strokeWidth={1.5} />
          <span>点击下一句 {subIdx + 1} / {total}</span>
        </div>
      </div>

      {/* ── Bottom area ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
        paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
      }}>
        {/* Hairline */}
        <div style={{ height: "0.5px", background: "rgba(255,255,255,0.07)", marginBottom: 14 }} />

        <div style={{ display: "flex", alignItems: "flex-end", padding: "0 20px" }}>
          {/* Vocab */}
          <div style={{ flex: 1 }}>
            {post.vocabulary?.length > 0 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setVocabOpen(v => !v); }}
                  style={{
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", letterSpacing: 0.8 }}>词汇</span>
                  <span style={{
                    background: accent + "22", color: accent,
                    fontSize: 10, fontWeight: 700, borderRadius: 8,
                    padding: "1px 6px", letterSpacing: 0.5,
                  }}>{post.vocabulary.length}</span>
                </button>
                {vocabOpen && (
                  <div
                    style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 7 }}
                    onClick={e => e.stopPropagation()}
                  >
                    {post.vocabulary.map((v, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                        <span style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{v.word}</span>
                        <span style={{ height: "0.5px", flex: 1, background: "rgba(255,255,255,0.08)" }} />
                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{v.meaning}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 22, paddingLeft: 16 }}>
            <Btn
              icon={<Heart size={21} fill={liked ? "#ff3b5c" : "none"} color={liked ? "#ff3b5c" : "rgba(255,255,255,0.6)"} strokeWidth={1.5} />}
              label={fmt(likes)}
              onClick={(e) => { e.stopPropagation(); setLiked(l => !l); setLikes(n => liked ? n - 1 : n + 1); }}
            />
            <Btn
              icon={<MessageCircle size={21} color="rgba(255,255,255,0.6)" strokeWidth={1.5} />}
              label={fmt(post.comments)}
              onClick={e => e.stopPropagation()}
            />
            <Btn
              icon={<Share2 size={21} color="rgba(255,255,255,0.6)" strokeWidth={1.5} />}
              label="分享"
              onClick={e => e.stopPropagation()}
            />
            <Btn
              icon={<Bookmark size={21} fill={saved ? "rgba(255,255,255,0.9)" : "none"} color="rgba(255,255,255,0.6)" strokeWidth={1.5} />}
              label={saved ? "已存" : "存"}
              onClick={(e) => { e.stopPropagation(); setSaved(s => !s); }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Btn({ icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
      background: "none", border: "none", cursor: "pointer", padding: 0,
    }}>
      {icon}
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.32)", letterSpacing: 0.3 }}>{label}</span>
    </button>
  );
}
