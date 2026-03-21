import { useState, useRef } from "react";
import FeedCard from "./FeedCard";
import { posts } from "../data/content";

export default function Feed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const cardHeight = el.clientHeight;
    const idx = Math.round(el.scrollTop / cardHeight);
    setActiveIndex(idx);
  };

  return (
    <div
      ref={containerRef}
      className="scroll-snap-y"
      onScroll={handleScroll}
      style={{ height: "calc(100vh - 60px)" }}
    >
      {posts.map((post, i) => (
        <FeedCard key={post.id} post={post} isActive={i === activeIndex} />
      ))}
    </div>
  );
}
