import { useState, useEffect, useRef, useCallback } from "react";
import { Heart, MessageCircle, Bookmark, Volume2, Square, ChevronDown } from "lucide-react";

// ── StreamElements TTS (Amazon Polly quality, free, no key) ──
const SE_BASE = "https://api.streamelements.com/kappa/v2/speech";
const VOICES = [
  { id: "Joanna", label: "Joanna", desc: "美式 ♀" },
  { id: "Matthew", label: "Matthew", desc: "美式 ♂" },
  { id: "Amy",    label: "Amy",    desc: "英式 ♀" },
  { id: "Brian",  label: "Brian",  desc: "英式 ♂" },
];
const VOICE_KEY = "tts_voice";
const audioCache = new Map(); // key: `${voice}:${text}`

function useTTS() {
  const [speaking, setSpeaking]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [voice, setVoiceState]    = useState(() => localStorage.getItem(VOICE_KEY) || "Joanna");
  const audioRef = useRef(null);

  const setVoice = useCallback((v) => {
    localStorage.setItem(VOICE_KEY, v);
    setVoiceState(v);
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    setSpeaking(false); setLoading(false);
  }, []);

  const speak = useCallback(async (text) => {
    stop();
    const cacheKey = `${voice}:${text}`;
    setLoading(true);
    try {
      let url;
      if (audioCache.has(cacheKey)) {
        url = audioCache.get(cacheKey);
      } else {
        const resp = await fetch(`${SE_BASE}?voice=${voice}&text=${encodeURIComponent(text)}`);
        if (!resp.ok) throw new Error("TTS fetch failed");
        const blob = await resp.blob();
        url = URL.createObjectURL(blob);
        audioCache.set(cacheKey, url);
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      setLoading(false); setSpeaking(true);
      audio.onended  = () => setSpeaking(false);
      audio.onerror  = () => setSpeaking(false);
      audio.play();
    } catch {
      setLoading(false);
      // Fallback to Web Speech API
      if (!window.speechSynthesis) return;
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = "en-US"; utt.rate = 0.85;
      utt.onstart = () => setSpeaking(true);
      utt.onend   = () => setSpeaking(false);
      utt.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utt);
    }
  }, [voice, stop]);

  return { speaking, loading, voice, setVoice, speak, stop };
}

const fmt = (n) =>
  n >= 10000 ? (n / 10000).toFixed(1) + "w" : n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);

const THEMES = [
  { bg: ["#08152e", "#0c1d3d", "#060e1f"], accent: "#4d8eff",  tag: "#0d2050" },
  { bg: ["#160825", "#1e0c35", "#0a0414"], accent: "#bf8aff",  tag: "#3d1280" },
  { bg: ["#051610", "#081f14", "#030a06"], accent: "#3ecf8e",  tag: "#0a5030" },
  { bg: ["#1a0c04", "#261205", "#0e0602"], accent: "#f59e0b",  tag: "#7a3d05" },
  { bg: ["#120820", "#1a0c2e", "#080415"], accent: "#c084fc",  tag: "#5a1e90" },
  { bg: ["#041220", "#061828", "#020810"], accent: "#38bdf8",  tag: "#064580" },
  { bg: ["#141414", "#1c1c1c", "#0a0a0a"], accent: "#e2e2e2",  tag: "#2a2a2a" },
  { bg: ["#160f02", "#1e1503", "#0c0901"], accent: "#fbbf24",  tag: "#7a5005" },
];

export default function VideoCard({ post, isActive, cardIndex }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const { speaking, loading, voice, setVoice, speak, stop } = useTTS();
  const { bg, accent, tag } = THEMES[cardIndex % THEMES.length];
  const bgStyle = `linear-gradient(165deg, ${bg[0]} 0%, ${bg[1]} 45%, ${bg[2]} 100%)`;

  useEffect(() => {
    if (!isActive) { stop(); setActiveIdx(null); }
  }, [isActive, stop]);

  const handleLine = (e, i) => {
    e.stopPropagation();
    if (activeIdx === i && speaking) { stop(); setActiveIdx(null); }
    else { setActiveIdx(i); speak(post.subtitles[i].en); }
  };

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: bgStyle, overflow: "hidden", userSelect: "none", position: "relative",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "8%", left: "20%",
        width: "65vw", height: "65vw", borderRadius: "50%",
        background: accent, opacity: 0.09, filter: "blur(80px)", pointerEvents: "none",
      }} />

      {/* ── HEADER (fixed at top, below nav) ── */}
      <div style={{
        flexShrink: 0,
        paddingTop: "calc(env(safe-area-inset-top) + 60px)",
        padding: "calc(env(safe-area-inset-top) + 62px) 18px 14px",
        zIndex: 10,
      }}>
        {/* Show badge + meta */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: tag, border: `1px solid ${accent}45`,
            borderRadius: 8, padding: "4px 10px",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: accent, letterSpacing: 0.6 }}>
              {post.show}
            </span>
          </span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.32)" }}>{post.episode}</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.15)" }}>·</span>
          <span style={{
            fontSize: 11, color: "rgba(255,255,255,0.22)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
          }}>{post.scene}</span>
        </div>

        {/* Divider */}
        <div style={{ height: "0.5px", background: `linear-gradient(to right, ${accent}40, transparent)` }} />
      </div>

      {/* ── DIALOGUE LIST (scrollable, takes remaining space) ── */}
      <div style={{
        flex: 1, overflowY: "auto", minHeight: 0,
        padding: "8px 18px 12px",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
      }}>
        {post.subtitles.map((sub, i) => {
          const isActive = activeIdx === i;
          return (
            <div
              key={i}
              onClick={(e) => handleLine(e, i)}
              style={{
                marginBottom: 10, borderRadius: 18,
                background: isActive ? `${accent}16` : "rgba(255,255,255,0.04)",
                border: `1px solid ${isActive ? accent + "50" : "rgba(255,255,255,0.07)"}`,
                padding: "14px 16px",
                transition: "all 0.2s",
                cursor: "pointer",
                boxShadow: isActive ? `0 0 0 1px ${accent}20, 0 4px 20px ${accent}15` : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                {/* Line number */}
                <span style={{
                  fontSize: 10, fontWeight: 700, color: isActive ? accent : "rgba(255,255,255,0.15)",
                  letterSpacing: 0.5, marginTop: 3, flexShrink: 0, minWidth: 16,
                  transition: "color 0.2s",
                }}>{String(i + 1).padStart(2, "0")}</span>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 17, fontWeight: 600, color: isActive ? "#fff" : "rgba(255,255,255,0.88)",
                    lineHeight: 1.55, letterSpacing: -0.1,
                    fontFamily: '"SF Pro Display",-apple-system,BlinkMacSystemFont,sans-serif',
                    marginBottom: 6,
                  }}>
                    {sub.en}
                  </div>
                  <div style={{
                    fontSize: 13, color: isActive ? `${accent}cc` : "rgba(255,255,255,0.35)",
                    lineHeight: 1.6, transition: "color 0.2s",
                  }}>
                    {sub.zh}
                  </div>
                </div>

                {/* Speaker button */}
                <div style={{
                  flexShrink: 0, width: 32, height: 32, borderRadius: "50%",
                  background: isActive ? accent : "rgba(255,255,255,0.07)",
                  border: `1px solid ${isActive ? accent : "rgba(255,255,255,0.1)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                  boxShadow: isActive && speaking ? `0 0 12px ${accent}60` : "none",
                }}>
                  {isActive && speaking
                    ? <Square size={10} color="#000" fill="#000" strokeWidth={0} />
                    : <Volume2 size={13} color={isActive ? "#000" : accent} strokeWidth={2} />}
                </div>
              </div>

              {/* Loading / waveform indicator */}
              {isActive && (loading || speaking) && (
                <div style={{ display: "flex", gap: 3, alignItems: "center", marginTop: 10, paddingLeft: 28 }}>
                  {loading ? (
                    <span style={{ fontSize: 10, color: accent, letterSpacing: 0.4, opacity: 0.7 }}>加载中…</span>
                  ) : (
                    <>
                      {[8, 14, 10, 18, 12, 8].map((h, j) => (
                        <div key={j} style={{
                          width: 3, height: h, borderRadius: 2, background: accent,
                          animation: `tts-wave 0.55s ease-in-out ${j * 0.08}s infinite alternate`,
                        }} />
                      ))}
                      <span style={{ fontSize: 10, color: accent, marginLeft: 6 }}>朗读中</span>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── SOCIAL ROW ── */}
      <div style={{
        flexShrink: 0, display: "flex", alignItems: "center",
        padding: "8px 16px", gap: 12,
        borderTop: "0.5px solid rgba(255,255,255,0.06)",
      }} onClick={e => e.stopPropagation()}>
        {/* Voice picker */}
        <div style={{ position: "relative", flex: 1 }}>
          <select
            value={voice}
            onChange={e => setVoice(e.target.value)}
            style={{
              appearance: "none", WebkitAppearance: "none",
              background: `${accent}14`, border: `1px solid ${accent}30`,
              borderRadius: 8, padding: "4px 24px 4px 9px",
              color: accent, fontSize: 11, fontWeight: 600, cursor: "pointer",
              outline: "none", width: "100%",
            }}
          >
            {VOICES.map(v => (
              <option key={v.id} value={v.id} style={{ background: "#111", color: "#fff" }}>
                {v.label} · {v.desc}
              </option>
            ))}
          </select>
          <ChevronDown size={11} color={accent} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        </div>
        <SocialBtn
          icon={<Heart size={18} fill={liked ? "#ff3b5c" : "none"} color={liked ? "#ff3b5c" : "rgba(255,255,255,0.5)"} strokeWidth={1.5} />}
          label={fmt(likes)}
          onClick={() => { setLiked(l => !l); setLikes(n => liked ? n - 1 : n + 1); }}
        />
        <SocialBtn
          icon={<MessageCircle size={18} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />}
          label={fmt(post.comments)}
          onClick={() => {}}
        />
        <SocialBtn
          icon={<Bookmark size={18} fill={saved ? "rgba(255,255,255,0.9)" : "none"} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />}
          label={fmt(post.bookmarks)}
          onClick={() => setSaved(s => !s)}
        />
      </div>

      {/* ── VOCAB ZONE (always fully visible) ── */}
      {post.vocabulary?.length > 0 && (
        <div style={{
          flexShrink: 0,
          borderTop: `1px solid ${accent}20`,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          padding: `12px 16px`,
          paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
        }} onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <div style={{ width: 3, height: 13, borderRadius: 2, background: accent }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: 1.2, textTransform: "uppercase" }}>
              重点词汇
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {post.vocabulary.map((v, i) => (
              <div key={i} style={{
                flex: "1 1 140px", minWidth: 0,
                background: `${accent}10`,
                border: `1px solid ${accent}25`,
                borderRadius: 12, padding: "9px 13px",
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
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{label}</span>
    </button>
  );
}
