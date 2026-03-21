import { useState, useEffect, useRef, useCallback } from "react";
import FeedCard from "./FeedCard";
import { posts } from "../data/content";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateMore(existingCount) {
  const batch = shuffle(posts).map((p, i) => ({
    ...p,
    _key: `${existingCount + i}-${p.id}-${Math.random()}`,
  }));
  return batch;
}

export default function Feed() {
  const [items, setItems] = useState(() => generateMore(0));
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  const loadMore = useCallback(() => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setItems(prev => [...prev, ...generateMore(prev.length)]);
      setLoading(false);
    }, 600);
  }, [loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: "200px" }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="flex flex-col gap-4 py-4">
      {items.map(post => (
        <FeedCard key={post._key} post={post} />
      ))}
      <div ref={sentinelRef} className="flex justify-center py-4">
        {loading && (
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}
      </div>
    </div>
  );
}
