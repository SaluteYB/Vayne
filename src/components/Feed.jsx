import { useState, useRef } from "react";
import VideoCard from "./VideoCard";
import { posts } from "../data/content";

export default function Feed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const ticking = useRef(false);

  const handleScroll = () => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const el = containerRef.current;
      if (el) {
        const idx = Math.round(el.scrollTop / el.clientHeight);
        setActiveIndex(idx);
      }
      ticking.current = false;
    });
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        position: "fixed",
        inset: 0,
        overflowY: "scroll",
        overflowX: "hidden",
        scrollSnapType: "y mandatory",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {posts.map((post, i) => (
        <div
          key={post.id}
          style={{
            width: "100%",
            height: "100vh",
            flexShrink: 0,
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            overflow: "hidden",
          }}
        >
          <VideoCard post={post} isActive={i === activeIndex} cardIndex={i} />
        </div>
      ))}
    </div>
  );
}
