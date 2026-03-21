import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Volume2, VolumeX, Play } from "lucide-react";

const fmt = (n) => n >= 10000 ? (n / 10000).toFixed(1) + "w" : n >= 1000 ? (n / 1000).toFixed(1) + "k" : n;

// Gradient backgrounds as visual fallback (shows while video loads or on error)
const GRADIENTS = [
  "linear-gradient(160deg, #0f2027, #203a43, #2c5364)",
  "linear-gradient(160deg, #1a0533, #2d1b69, #11998e)",
  "linear-gradient(160deg, #0d0d0d, #1a1a2e, #16213e)",
  "linear-gradient(160deg, #200122, #6f0000, #200122)",
  "linear-gradient(160deg, #0f0c29, #302b63, #24243e)",
  "linear-gradient(160deg, #000428, #004e92)",
  "linear-gradient(160deg, #1f1c2c, #928dab)",
  "linear-gradient(160deg, #0a0a0a, #1a1a1a, #2d1b69)",
];

export default function VideoCard({ post, isActive, cardIndex, vh }) {
  const videoRef = useRef(null);
  const [currentSub, setCurrentSub] = useState(null);
  const [videoState, setVideoState] = useState("loading"); // loading | playing | paused | error
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [progress, setProgress] = useState(0);
  const [showVocab, setShowVocab] = useState(false);
  const lastTap = useRef(0);

  const gradient = GRADIENTS[cardIndex % GRADIENTS.length];

  // Auto play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.currentTime = 0;
      const p = video.play();
      if (p !== undefined) {
        p.then(() => setVideoState("playing")).catch(() => setVideoState("error"));
      }
    } else {
      video.pause();
      video.currentTime = 0;
      setVideoState("loading");
      setCurrentSub(null);
      setProgress(0);
    }
  }, [isActive]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const t = video.currentTime;
    const dur = video.duration || 1;
    setProgress((t / dur) * 100);
    const sub = post.subtitles.find(s => t >= s.start && t < s.end);
    setCurrentSub(sub || null);
  };

  const handleCanPlay = () => {
    if (isActive && videoRef.current) {
      videoRef.current.play()
        .then(() => setVideoState("playing"))
        .catch(() => setVideoState("error"));
    }
  };

  const handleError = () => setVideoState("error");

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      if (!liked) { setLiked(true); setLikes(l => l + 1); }
    } else {
      const video = videoRef.current;
      if (!video || videoState === "error") return;
      if (video.paused) { video.play(); setVideoState("playing"); }
      else { video.pause(); setVideoState("paused"); }
    }
    lastTap.current = now;
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video) video.muted = !muted;
    setMuted(m => !m);
  };

  return (
    <div
      style={{
        height: "100%",
        position: "relative",
        background: gradient,
        overflow: "hidden",
        userSelect: "none",
      }}
      onClick={handleTap}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={post.videoUrl}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          opacity: videoState === "playing" || videoState === "paused" ? 1 : 0,
          transition: "opacity 0.4s",
        }}
        loop
        playsInline
        muted
        preload="auto"
        onCanPlay={handleCanPlay}
        onTimeUpdate={handleTimeUpdate}
        onError={handleError}
        onPlay={() => setVideoState("playing")}
        onPause={() => { if (videoState === "playing") setVideoState("paused"); }}
      />

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.5) 100%)",
      }} />

      {/* Loading spinner */}
      {videoState === "loading" && (
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.2)",
            borderTopColor: "rgba(255,255,255,0.8)",
            animation: "spin 0.8s linear infinite",
          }} />
        </div>
      )}

      {/* Pause icon */}
      {videoState === "paused" && (
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          background: "rgba(0,0,0,0.45)", borderRadius: "50%",
          width: 64, height: 64,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          <Play size={28} color="white" fill="white" />
        </div>
      )}

      {/* Error state — show all subtitles as static text */}
      {videoState === "error" && (
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -55%)",
          width: "80%", textAlign: "center",
          pointerEvents: "none",
        }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
            视频加载中...
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {post.subtitles.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 16, color: "#fff", fontWeight: 600, lineHeight: 1.4 }}>{s.en}</div>
                <div style={{ fontSize: 13, color: "#fde68a", marginTop: 3 }}>{s.zh}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top — show info + mute */}
      <div style={{
        position: "absolute", top: 16, left: 16, right: 16,
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        zIndex: 10,
      }}>
        <div>
          <div style={{
            fontSize: 13, fontWeight: 700, color: "#fff",
            textShadow: "0 1px 6px rgba(0,0,0,0.9)",
            background: "rgba(0,0,0,0.35)",
            display: "inline-block", padding: "3px 10px", borderRadius: 20,
            marginBottom: 4,
          }}>
            {post.show}
            <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400, marginLeft: 6 }}>
              {post.episode}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", paddingLeft: 4 }}>
            {post.scene}
          </div>
        </div>
        <button
          onClick={toggleMute}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(0,0,0,0.4)", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0, marginLeft: 8,
          }}
        >
          {muted ? <VolumeX size={16} color="white" /> : <Volume2 size={16} color="white" />}
        </button>
      </div>

      {/* Subtitles (only when video is playing) */}
      {videoState === "playing" && (
        <div style={{
          position: "absolute", bottom: 130, left: 16, right: 72, zIndex: 10,
          minHeight: 56,
        }}>
          {currentSub && (
            <div style={{
              background: "rgba(0,0,0,0.6)",
              borderRadius: 10, padding: "8px 14px",
              display: "inline-block",
            }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#fff", lineHeight: 1.4, marginBottom: 4 }}>
                {currentSub.en}
              </div>
              <div style={{ fontSize: 13, color: "#fde68a", lineHeight: 1.4 }}>
                {currentSub.zh}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vocabulary */}
      {post.vocabulary?.length > 0 && (
        <div style={{ position: "absolute", bottom: 80, left: 16, right: 72, zIndex: 10 }}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowVocab(v => !v); }}
            style={{
              fontSize: 11, color: "#a5f3fc",
              background: "rgba(0,0,0,0.45)",
              border: "1px solid rgba(165,243,252,0.35)",
              borderRadius: 20, padding: "5px 12px",
              cursor: "pointer",
            }}
          >
            📖 {showVocab ? "收起" : `${post.vocabulary.length} 个重点词`}
          </button>
          {showVocab && (
            <div
              style={{
                marginTop: 8, background: "rgba(0,0,0,0.75)",
                borderRadius: 12, padding: "10px 14px",
                display: "flex", flexDirection: "column", gap: 8,
              }}
              onClick={e => e.stopPropagation()}
            >
              {post.vocabulary.map((v, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                  <span style={{ color: "#a5f3fc", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{v.word}</span>
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>{v.meaning}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
        background: "rgba(255,255,255,0.15)", zIndex: 10,
      }}>
        <div style={{
          height: "100%", background: "rgba(255,255,255,0.8)",
          width: `${progress}%`, transition: "width 0.15s linear",
        }} />
      </div>

      {/* Right action buttons */}
      <div style={{
        position: "absolute", right: 12, bottom: 100, zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 18,
      }}>
        <ActionBtn
          icon={<Heart size={26} fill={liked ? "#f43f5e" : "none"} color={liked ? "#f43f5e" : "white"} />}
          label={fmt(likes)}
          onClick={(e) => { e.stopPropagation(); setLiked(l => !l); setLikes(n => liked ? n - 1 : n + 1); }}
        />
        <ActionBtn
          icon={<MessageCircle size={26} color="white" />}
          label={fmt(post.comments)}
          onClick={e => e.stopPropagation()}
        />
        <ActionBtn
          icon={<Share2 size={26} color="white" />}
          label="分享"
          onClick={e => e.stopPropagation()}
        />
        <ActionBtn
          icon={<Bookmark size={26} fill={bookmarked ? "white" : "none"} color="white" />}
          label={bookmarked ? "已存" : "存"}
          onClick={(e) => { e.stopPropagation(); setBookmarked(b => !b); }}
        />
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function ActionBtn({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        background: "none", border: "none", cursor: "pointer", padding: 0,
      }}
    >
      <div style={{
        width: 46, height: 46, borderRadius: "50%",
        background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 11, color: "white", fontWeight: 500 }}>{label}</span>
    </button>
  );
}
