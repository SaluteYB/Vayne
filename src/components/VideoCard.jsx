import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Volume2, VolumeX, Play, Pause } from "lucide-react";

const fmt = (n) => n >= 10000 ? (n / 10000).toFixed(1) + "w" : n >= 1000 ? (n / 1000).toFixed(1) + "k" : n;

export default function VideoCard({ post, isActive }) {
  const videoRef = useRef(null);
  const [currentSub, setCurrentSub] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [progress, setProgress] = useState(0);
  const [showVocab, setShowVocab] = useState(false);
  const lastTap = useRef(0);

  // Auto-play/pause based on active state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setPlaying(false);
      setCurrentSub(null);
      setProgress(0);
    }
  }, [isActive]);

  // Subtitle sync
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const t = video.currentTime;
    const dur = video.duration || 1;
    setProgress((t / dur) * 100);

    const sub = post.subtitles.find(s => t >= s.start && t < s.end);
    setCurrentSub(sub || null);
  };

  const handleVideoEnd = () => {
    const video = videoRef.current;
    if (video) { video.currentTime = 0; video.play(); }
  };

  // Tap to play/pause; double tap to like
  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      // Double tap — like
      if (!liked) { setLiked(true); setLikes(l => l + 1); }
    } else {
      // Single tap — toggle play
      const video = videoRef.current;
      if (!video) return;
      if (video.paused) { video.play(); setPlaying(true); }
      else { video.pause(); setPlaying(false); }
    }
    lastTap.current = now;
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) videoRef.current.muted = !muted;
    setMuted(m => !m);
  };

  return (
    <div
      style={{
        height: "100%",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        position: "relative",
        background: "#000",
        overflow: "hidden",
      }}
      onClick={handleTap}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={post.videoUrl}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        loop
        playsInline
        muted={muted}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        preload="metadata"
      />

      {/* Dark gradient — bottom */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Play/Pause icon flash */}
      {!playing && isActive && (
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          background: "rgba(0,0,0,0.5)",
          borderRadius: "50%",
          width: 64, height: 64,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          <Play size={28} color="white" fill="white" />
        </div>
      )}

      {/* Top — show info + mute */}
      <div style={{
        position: "absolute", top: 16, left: 16, right: 16,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        zIndex: 10,
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
            {post.show} · {post.episode}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
            {post.scene}
          </div>
        </div>
        <button
          onClick={toggleMute}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(0,0,0,0.4)",
            border: "none", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {muted ? <VolumeX size={16} color="white" /> : <Volume2 size={16} color="white" />}
        </button>
      </div>

      {/* Subtitles */}
      <div style={{
        position: "absolute",
        bottom: 120,
        left: 16, right: 72,
        zIndex: 10,
        minHeight: 60,
      }}>
        {currentSub ? (
          <div style={{
            background: "rgba(0,0,0,0.55)",
            borderRadius: 10,
            padding: "8px 12px",
            display: "inline-block",
          }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#fff", lineHeight: 1.4, marginBottom: 4 }}>
              {currentSub.en}
            </div>
            <div style={{ fontSize: 13, color: "#fde68a", lineHeight: 1.4 }}>
              {currentSub.zh}
            </div>
          </div>
        ) : null}
      </div>

      {/* Vocabulary pill */}
      {post.vocabulary?.length > 0 && (
        <div style={{ position: "absolute", bottom: 80, left: 16, right: 72, zIndex: 10 }}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowVocab(v => !v); }}
            style={{
              fontSize: 11, color: "#a5f3fc",
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(165,243,252,0.4)",
              borderRadius: 20, padding: "4px 10px",
              cursor: "pointer",
            }}
          >
            📖 {showVocab ? "收起单词" : `本集 ${post.vocabulary.length} 个词`}
          </button>
          {showVocab && (
            <div style={{
              marginTop: 6,
              background: "rgba(0,0,0,0.75)",
              borderRadius: 10, padding: "10px 12px",
              display: "flex", flexDirection: "column", gap: 6,
            }}
            onClick={e => e.stopPropagation()}
            >
              {post.vocabulary.map((v, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                  <span style={{ color: "#a5f3fc", fontWeight: 700, fontSize: 13 }}>{v.word}</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>{v.meaning}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
        background: "rgba(255,255,255,0.2)", zIndex: 10,
      }}>
        <div style={{
          height: "100%", background: "#fff",
          width: `${progress}%`, transition: "width 0.2s linear",
        }} />
      </div>

      {/* Right action buttons */}
      <div style={{
        position: "absolute", right: 12, bottom: 100,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
        zIndex: 10,
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
        width: 48, height: 48, borderRadius: "50%",
        background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 11, color: "white", fontWeight: 500 }}>{label}</span>
    </button>
  );
}
