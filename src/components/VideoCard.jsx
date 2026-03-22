import { useState, useEffect, useRef, useCallback } from "react";
import { Heart, MessageCircle, Bookmark, Volume2, Square, ChevronRight } from "lucide-react";

function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const uttRef = useRef(null);
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "en-US"; utt.rate = 0.88; utt.pitch = 1;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    uttRef.current = utt;
    window.speechSynthesis.speak(utt);
  }, []);
  const stop = useCallback(() => { window.speechSynthesis?.cancel(); setSpeaking(false); }, []);
  return { speaking, speak, stop };
}

const fmt = (n) =>
  n >= 10000 ? (n / 10000).toFixed(1) + "w" : n >= 1000 ? (n / 1000).toFixed(1) + "k" : n;

const THEMES = [
  {
    bg: "linear-gradient(160deg,#08152e 0%,#0c1d3d 40%,#060e1f 100%)",
    card: "rgba(30,60,120,0.18)", accent: "#4d8eff", dim: "#0d2050",
    tag: "#1a3a7a", num: "01",
  },
  {
    bg: "linear-gradient(160deg,#160825 0%,#1e0c35 40%,#0a0414 100%)",
    card: "rgba(120,40,200,0.14)", accent: "#bf8aff", dim: "#3d1280",
    tag: "#3a1060", num: "02",
  },
  {
    bg: "linear-gradient(160deg,#051610 0%,#081f14 40%,#030a06 100%)",
    card: "rgba(20,130,80,0.14)", accent: "#3ecf8e", dim: "#0a5030",
    tag: "#0c3d22", num: "03",
  },
  {
    bg: "linear-gradient(160deg,#1a0c04 0%,#261205 40%,#0e0602 100%)",
    card: "rgba(180,100,20,0.14)", accent: "#f59e0b", dim: "#7a3d05",
    tag: "#5a2e04", num: "04",
  },
  {
    bg: "linear-gradient(160deg,#120820 0%,#1a0c2e 40%,#080415 100%)",
    card: "rgba(150,60,220,0.12)", accent: "#c084fc", dim: "#5a1e90",
    tag: "#3a1060", num: "05",
  },
  {
    bg: "linear-gradient(160deg,#041220 0%,#061828 40%,#020810 100%)",
    card: "rgba(10,100,180,0.16)", accent: "#38bdf8", dim: "#064580",
    tag: "#073858", num: "06",
  },
  {
    bg: "linear-gradient(160deg,#141414 0%,#1c1c1c 40%,#0a0a0a 100%)",
    card: "rgba(200,200,200,0.08)", accent: "#e2e2e2", dim: "#3a3a3a",
    tag: "#2a2a2a", num: "07",
  },
  {
    bg: "linear-gradient(160deg,#160f02 0%,#1e1503 40%,#0c0901 100%)",
    card: "rgba(180,130,10,0.14)", accent: "#fbbf24", dim: "#7a5005",
    tag: "#503404", num: "08",
  },
];

export default function VideoCard({ post, isActive, cardIndex }) {
  const [subIdx, setSubIdx] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const { speaking, speak, stop } = useTTS();
  const theme = THEMES[cardIndex % THEMES.length];
  const { bg, card, accent, dim, tag, num } = theme;
  const sub = post.subtitles[subIdx];
  const total = post.subtitles.length;
  const hasVocab = post.vocabulary?.length > 0;

  useEffect(() => {
    if (!isActive) { stop(); setSubIdx(0); }
  }, [isActive, stop]);
  useEffect(() => { stop(); }, [subIdx, stop]);

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: bg, overflow: "hidden", userSelect: "none", position: "relative",
    }}>
      {/* ── Decorative large number watermark ── */}
      <div style={{
        position: "absolute", right: -10, top: "18%",
        fontSize: 200, fontWeight: 900, color: accent, opacity: 0.04,
        lineHeight: 1, pointerEvents: "none", userSelect: "none",
        fontFamily: '"SF Pro Display",-apple-system,sans-serif', letterSpacing: -10,
      }}>{num}</div>

      {/* ── Glow blobs ── */}
      <div style={{
        position: "absolute", top: "10%", left: "30%",
        width: "60vw", height: "60vw", borderRadius: "50%",
        background: accent, opacity: 0.1, filter: "blur(80px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "15%", right: "-5%",
        width: "40vw", height: "40vw", borderRadius: "50%",
        background: dim, opacity: 0.4, filter: "blur(50px)", pointerEvents: "none",
      }} />

      {/* ═══════════════════════════════════════ */}
      {/* UPPER ZONE — grows to fill space       */}
      {/* ═══════════════════════════════════════ */}
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0,
          paddingTop: "calc(env(safe-area-inset-top) + 58px)", zIndex: 10 }}
        onClick={() => setSubIdx(i => (i + 1) % total)}
      >
        {/* ── Header ── */}
        <div style={{ padding: "0 18px", marginBottom: 14 }}>
          {/* Progress segments */}
          <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
            {post.subtitles.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 3, overflow: "hidden",
                background: "rgba(255,255,255,0.1)",
              }}>
                <div style={{
                  height: "100%", borderRadius: 3,
                  background: accent,
                  width: i < subIdx ? "100%" : i === subIdx ? "100%" : "0%",
                  opacity: i < subIdx ? 0.4 : 1,
                  transition: "width 0.3s",
                }} />
              </div>
            ))}
          </div>

          {/* Show badge row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              background: tag, border: `1px solid ${accent}40`,
              borderRadius: 8, padding: "4px 10px",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: accent }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: 0.8 }}>
                {post.show}
              </span>
            </div>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 0.3 }}>
              {post.episode}
            </span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.18)" }}>·</span>
            <span style={{
              fontSize: 11, color: "rgba(255,255,255,0.25)",
              flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{post.scene}</span>
          </div>
        </div>

        {/* ── Dialogue card ── */}
        <div style={{ flex: 1, padding: "0 18px", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 0 }}>
          <div style={{
            background: card,
            border: `1px solid ${accent}18`,
            borderRadius: 24, padding: "24px 22px",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            position: "relative", overflow: "hidden",
          }}>
            {/* Top accent bar */}
            <div style={{
              position: "absolute", top: 0, left: 24, right: 24, height: 2,
              background: `linear-gradient(to right, ${accent}, ${accent}00)`,
              borderRadius: "0 0 2px 2px",
            }} />

            {/* Quote mark decoration */}
            <div style={{
              position: "absolute", top: 8, right: 16, fontSize: 80,
              color: accent, opacity: 0.08, fontFamily: "Georgia,serif",
              lineHeight: 1, pointerEvents: "none",
            }}>"</div>

            {/* English */}
            <div style={{
              fontSize: 22, fontWeight: 700, color: "#fff",
              lineHeight: 1.6, letterSpacing: -0.2,
              fontFamily: '"SF Pro Display",-apple-system,BlinkMacSystemFont,sans-serif',
              marginBottom: 14, position: "relative",
            }}>
              {sub.en}
            </div>

            {/* Chinese */}
            <div style={{
              fontSize: 13.5, color: "rgba(255,255,255,0.38)",
              lineHeight: 1.7, letterSpacing: 0.4,
              paddingTop: 12, borderTop: `1px solid ${accent}15`,
            }}>
              {sub.zh}
            </div>
          </div>

          {/* ── Controls row ── */}
          <div style={{
            display: "flex", alignItems: "center", marginTop: 16, gap: 0,
          }} onClick={e => e.stopPropagation()}>
            {/* TTS */}
            <button onClick={(e) => { e.stopPropagation(); speaking ? stop() : speak(sub.en); }}
              style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: speaking ? accent : "rgba(255,255,255,0.08)",
                border: `1.5px solid ${speaking ? accent : "rgba(255,255,255,0.1)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.2s",
                boxShadow: speaking ? `0 0 16px ${accent}60` : "none",
              }}
            >
              {speaking
                ? <Square size={12} color="#000" fill="#000" strokeWidth={0} />
                : <Volume2 size={15} color={accent} strokeWidth={2} />}
            </button>

            {speaking ? (
              <div style={{ display: "flex", alignItems: "center", gap: 3, marginLeft: 10 }}>
                {[8, 14, 10, 18, 12].map((h, i) => (
                  <div key={i} style={{
                    width: 3, height: h, borderRadius: 2, background: accent,
                    animation: `tts-wave 0.55s ease-in-out ${i * 0.09}s infinite alternate`,
                  }} />
                ))}
                <span style={{ fontSize: 11, color: accent, marginLeft: 6 }}>朗读中</span>
              </div>
            ) : (
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginLeft: 10 }}>
                朗读 · 点屏幕下一句
              </span>
            )}

            {/* Social buttons — right side */}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
              <SocialBtn
                icon={<Heart size={19} fill={liked ? "#ff3b5c" : "none"} color={liked ? "#ff3b5c" : "rgba(255,255,255,0.55)"} strokeWidth={1.5} />}
                label={fmt(likes)}
                onClick={(e) => { e.stopPropagation(); setLiked(l => !l); setLikes(n => liked ? n - 1 : n + 1); }}
              />
              <SocialBtn
                icon={<MessageCircle size={19} color="rgba(255,255,255,0.55)" strokeWidth={1.5} />}
                label={fmt(post.comments)}
                onClick={e => e.stopPropagation()}
              />
              <SocialBtn
                icon={<Bookmark size={19} fill={saved ? "rgba(255,255,255,0.9)" : "none"} color="rgba(255,255,255,0.55)" strokeWidth={1.5} />}
                label={saved ? "已存" : fmt(post.bookmarks)}
                onClick={(e) => { e.stopPropagation(); setSaved(s => !s); }}
              />
            </div>
          </div>

          {/* Next hint */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 4, marginTop: 10,
            color: "rgba(255,255,255,0.14)", fontSize: 11,
          }}>
            <ChevronRight size={11} strokeWidth={1.5} />
            <span>{subIdx + 1} / {total}</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* VOCAB ZONE — always visible, fixed     */}
      {/* ═══════════════════════════════════════ */}
      {hasVocab && (
        <div style={{
          flexShrink: 0, zIndex: 10,
          borderTop: `1px solid ${accent}18`,
          background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.45))`,
          backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          paddingBottom: "max(env(safe-area-inset-bottom), 14px)",
          padding: `12px 16px max(env(safe-area-inset-bottom), 14px)`,
        }} onClick={e => e.stopPropagation()}>
          {/* Section label */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
          }}>
            <div style={{ width: 3, height: 12, borderRadius: 2, background: accent }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: 1 }}>
              重点词汇
            </span>
          </div>

          {/* Vocab grid */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {post.vocabulary.map((v, i) => (
              <div key={i} style={{
                background: `${accent}12`,
                border: `1px solid ${accent}28`,
                borderRadius: 12, padding: "8px 14px",
                flex: "1 1 auto", minWidth: 120,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: accent, marginBottom: 3 }}>{v.word}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", lineHeight: 1.4 }}>{v.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SocialBtn({ icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
      background: "none", border: "none", cursor: "pointer", padding: 0,
    }}>
      {icon}
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 0.2 }}>{label}</span>
    </button>
  );
}
