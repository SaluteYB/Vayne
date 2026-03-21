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
    setActiveIndex(idx);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: "100%",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        scrollbarWidth: "none",
      }}
    >
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
      {posts.map((post, i) => (
        <div key={post.id} style={{ height: "100%", scrollSnapAlign: "start", scrollSnapStop: "always" }}>
          <VideoCard post={post} isActive={i === activeIndex} />
        </div>
      ))}
    </div>
  );
}
