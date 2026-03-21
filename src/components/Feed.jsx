import { useState, useRef } from "react";
import VideoCard from "./VideoCard";
import { posts } from "../data/content";

export default function Feed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / el.clientHeight);
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
      }}
    >
      {posts.map((post, i) => (
        <div
          key={post.id}
          style={{
            /* Each card fills the viewport exactly */
            height: "100vh",
            height: "100svh",
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
