import { useState, useRef } from "react";
import VideoCard from "./VideoCard";
import { posts } from "../data/content";

const H = () => window.innerHeight;

export default function Feed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / H());
    if (idx !== activeIndex) setActiveIndex(idx);
  };

  const h = H();

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        width: "100%",
        height: h,
        overflowY: "scroll",
        overflowX: "hidden",
        scrollSnapType: "y mandatory",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        flexShrink: 0,
      }}
    >
      {posts.map((post, i) => (
        <div
          key={post.id}
          style={{
            width: "100%",
            height: h,
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
