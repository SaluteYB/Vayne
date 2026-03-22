import { useState, useEffect, useRef, useCallback } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Volume2, Square } from "lucide-react";

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
  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);
  return { speaking, speak, stop };
}

const fmt = (n) =>
  n >= 10000 ? (n / 10000).toFixed(1) + "w" : n >= 1000 ? (n / 1000).toFixed(1) + "k" : n;

const THEMES = [
  { bg: "linear-gradient(155deg,#0d1f42 0%,#060e22 55%,#020510 100%)", glow:"#1a4fd6", accent:"#4d8eff" },
  { bg: "linear-gradient(155deg,#1c0b30 0%,#0c0418 55%,#040108 100%)", glow:"#7c3aed", accent:"#bf8aff" },
  { bg: "linear-gradient(155deg,#091a0e 0%,#040c06 55%,#020402 100%)", glow:"#059669", accent:"#3ecf8e" },
  { bg: "linear-gradient(155deg,#1e0f06 0%,#0d0703 55%,#050300 100%)", glow:"#b45309", accent:"#f59e0b" },
  { bg: "linear-gradient(155deg,#160a26 0%,#0b0514 55%,#040208 100%)", glow:"#7e22ce", accent:"#c084fc" },
  { bg: "linear-gradient(155deg,#091320 0%,#050c17 55%,#020509 100%)", glow:"#0369a1", accent:"#38bdf8" },
  { bg: "linear-gradient(155deg,#191919 0%,#0d0d0d 55%,#050505 100%)", glow:"#525252", accent:"#d4d4d4" },
  { bg: "linear-gradient(155deg,#1a1305 0%,#0d0a02 55%,#060401 100%)", glow:"#92400e", accent:"#fbbf24" },
];

export default function VideoCard({ post, isActive, cardIndex }) {
  const [subIdx, setSubIdx] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [vocabOpen, setVocabOpen] = useState(false);
  const { speaking, speak, stop } = useTTS();
  const { bg, glow, accent } = THEMES[cardIndex % THEMES.length];
  const sub = post.subtitles[subIdx];
  const total = post.subtitles.length;

  useEffect(() => {
    if (!isActive) { stop(); setSubIdx(0); setVocabOpen(false); }
  }, [isActive, stop]);
  useEffect(() => { stop(); }, [subIdx, stop]);

  const handleTap = () => setSubIdx(i => (i + 1) % total);
  const handleSpeak = (e) => { e.stopPropagation(); speaking ? stop() : speak(sub.en); };

  return (
    <div
      onClick={handleTap}
      style={{ height: "100%", position: "relative", background: bg, overflow: "hidden", userSelect: "none" }}
    >
      {/* Background glow blob */}
      <div style={{
        position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
        width: "75vw", height: "75vw", borderRadius: "50%",
        background: glow, opacity: 0.14, filter: "blur(90px)", pointerEvents: "none",
      }} />
      {/* Bottom glow */}
      <div style={{
        position: "absolute", bottom: "-10%", right: "-10%",
        width: "50vw", height: "50vw", borderRadius: "50%",
        background: glow, opacity: 0.07, filter: "blur(60px)", pointerEvents: "none",
      }} />

      {/* Giant decorative quote */}
      <div style={{
        position: "absolute", top: "22%", left: 14, fontSize: 260,
        lineHeight: 0.8, color: accent, opacity: 0.035,
        fontFamily: "Georgia,serif", fontWeight: 900,
        pointerEvents: "none", userSelect: "none",
      }}>"</div>

      {/* ── TOP HEADER ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
        paddingTop: "calc(env(safe-area-inset-top) + 56px)",
        padding: "calc(env(safe-area-inset-top) + 58px) 18px 0",
      }}>
        {/* Segmented progress bar */}
        <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
          {post.subtitles.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 2.5, borderRadius: 2,
              background: i <= subIdx ? accent : "rgba(255,255,255,0.12)",
              opacity: i < subIdx ? 0.45 : 1,
              transition: "background 0.25s, opacity 0.25s",
            }} />
          ))}
        </div>

        {/* Show label + scene */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            background: accent, borderRadius: 5, padding: "2px 9px",
            fontSize: 10, fontWeight: 800, color: "#000", letterSpacing: 1.2,
            textTransform: "uppercase",
          }}>{post.show}</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.38)" }}>{post.episode}</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>·</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", flex: 1, minWidth: 0,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{post.scene}</span>
        </div>
      </div>

      {/* ── CENTER: Dialogue card ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 18px 130px",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 22,
          padding: "26px 22px 22px",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          position: "relative",
          boxShadow: `0 0 0 1px ${accent}10, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}>
          {/* Accent left stripe */}
          <div style={{
            position: "absolute", left: 0, top: 18, bottom: 18,
            width: 3, borderRadius: "0 3px 3px 0",
            background: `linear-gradient(to bottom, ${accent}, ${accent}30)`,
          }} />

          {/* English */}
          <div style={{
            fontSize: 23, fontWeight: 700, color: "#fff",
            lineHeight: 1.55, letterSpacing: -0.3,
            fontFamily: '"SF Pro Display",-apple-system,BlinkMacSystemFont,sans-serif',
            marginBottom: 16,
          }}>
            {sub.en}
          </div>

          {/* Divider */}
          <div style={{ height: "0.5px", background: "rgba(255,255,255,0.07)", marginBottom: 14 }} />

          {/* Chinese */}
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, letterSpacing: 0.4 }}>
            {sub.zh}
          </div>
        </div>

        {/* TTS row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18, paddingLeft: 2 }}
          onClick={e => e.stopPropagation()}>
          <button
            onClick={handleSpeak}
            style={{
              width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
              background: speaking ? accent : "rgba(255,255,255,0.07)",
              border: `1.5px solid ${speaking ? accent : "rgba(255,255,255,0.1)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: speaking ? `0 0 18px ${accent}55` : "none",
            }}
          >
            {speaking
              ? <Square size={13} color="#000" strokeWidth={0} fill="#000" />
              : <Volume2 size={16} color={accent} strokeWidth={2} />}
          </button>

          {speaking ? (
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              {[10, 16, 12, 18, 10].map((h, i) => (
                <div key={i} style={{
                  width: 3, height: h, borderRadius: 2, background: accent,
                  animation: `tts-wave 0.55s ease-in-out ${i * 0.08}s infinite alternate`,
                }} />
              ))}
              <span style={{ fontSize: 11, color: accent, marginLeft: 6, letterSpacing: 0.4 }}>朗读中…</span>
            </div>
          ) : (
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.22)", letterSpacing: 0.3 }}>
              点击朗读当前句 · 点屏幕换句
            </span>
          )}
        </div>
      </div>

      {/* ── RIGHT: Action bar ── */}
      <div style={{
        position: "absolute", right: 14, bottom: 110, zIndex: 30,
        display: "flex", flexDirection: "column", gap: 18,
      }}>
        <RoundBtn
          icon={<Heart size={24} fill={liked ? "#ff3b5c" : "none"} color={liked ? "#ff3b5c" : "rgba(255,255,255,0.8)"} strokeWidth={1.5} />}
          label={fmt(likes)}
          onClick={(e) => { e.stopPropagation(); setLiked(l => !l); setLikes(n => liked ? n - 1 : n + 1); }}
        />
        <RoundBtn
          icon={<MessageCircle size={24} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />}
          label={fmt(post.comments)}
          onClick={e => e.stopPropagation()}
        />
        <RoundBtn
          icon={<Share2 size={24} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />}
          label="分享"
          onClick={e => e.stopPropagation()}
        />
        <RoundBtn
          icon={<Bookmark size={24} fill={saved ? "rgba(255,255,255,0.9)" : "none"} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />}
          label={saved ? "已存" : "存"}
          onClick={(e) => { e.stopPropagation(); setSaved(s => !s); }}
        />
      </div>

      {/* ── BOTTOM: Vocab chips ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20,
        paddingBottom: "max(env(safe-area-inset-bottom), 12px)",
      }}>
        <div style={{
          height: 72, pointerEvents: "none",
          background: `linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)`,
        }} />

        {post.vocabulary?.length > 0 && (
          <div style={{ padding: "0 16px 10px" }} onClick={e => e.stopPropagation()}>
            <button
              onClick={(e) => { e.stopPropagation(); setVocabOpen(v => !v); }}
              style={{
                display: "flex", alignItems: "center", gap: 7, marginBottom: vocabOpen ? 10 : 0,
                background: "none", border: "none", cursor: "pointer", padding: "4px 0",
              }}
            >
              <span style={{
                background: accent + "20", color: accent, borderRadius: 6, padding: "3px 10px",
                fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
              }}>
                {vocabOpen ? "▾ 收起" : "▸ 词汇"} {post.vocabulary.length}
              </span>
            </button>
            {vocabOpen && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {post.vocabulary.map((v, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${accent}25`,
                    borderRadius: 12, padding: "8px 14px",
                    backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: accent, marginBottom: 2 }}>{v.word}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)" }}>{v.meaning}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RoundBtn({ icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
      background: "none", border: "none", cursor: "pointer", padding: 0,
    }}>
      <div style={{
        width: 50, height: 50, borderRadius: "50%",
        background: "rgba(0,0,0,0.38)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        border: "0.5px solid rgba(255,255,255,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 0.2 }}>{label}</span>
    </button>
  );
}
