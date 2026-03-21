import { useState, useRef, useEffect } from "react";
import VideoCard from "./VideoCard";
import { posts } from "../data/content";

export default function Feed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const [vh, setVh] = useState(window.innerHeight);

  // Get real viewport height (handles iOS Safari browser chrome)
  useEffect(() => {
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / vh);
    if (idx !== activeIndex) setActiveIndex(idx);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        position: "absolute",
        inset: 0,
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        background: "#000",
      }}
    >
      {posts.map((post, i) => (
        <div
          key={post.id}
          style={{
            height: vh,           // exact pixel height — never fails
            minHeight: vh,
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            overflow: "hidden",
          }}
        >
          <VideoCard post={post} isActive={i === activeIndex} cardIndex={i} vh={vh} />
        </div>
      ))}
    </div>
  );
}
