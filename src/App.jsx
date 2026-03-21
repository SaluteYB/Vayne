import { useState } from "react";
import { Home, Keyboard, Flame, User, Search } from "lucide-react";
import Feed from "./components/Feed";
import Typing from "./components/Typing";
import CheckIn from "./components/CheckIn";
import Profile from "./components/Profile";
import "./index.css";

const tabs = [
  { id: "feed", label: "首页", Icon: Home },
  { id: "search", label: "发现", Icon: Search },
  { id: "typing", label: "打字", Icon: Keyboard },
  { id: "checkin", label: "打卡", Icon: Flame },
  { id: "profile", label: "我的", Icon: User },
];

function DiscoverPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-gray-500 pb-16">
      <div className="text-6xl">🔍</div>
      <div className="text-lg font-semibold text-gray-300">发现更多内容</div>
      <div className="text-sm">搜索单词、句子、话题...</div>
      <div className="mt-4 w-4/5">
        <input
          className="w-full rounded-full px-5 py-3 text-white text-sm outline-none transition-colors"
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
          placeholder="搜索英语内容..."
        />
      </div>
      <div className="flex flex-wrap gap-2 justify-center mt-2 w-4/5">
        {["谚语", "高频词汇", "口语对话", "IELTS", "职场英语", "日常表达"].map(tag => (
          <span
            key={tag}
            className="text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer"
            style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)" }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Main content */}
      <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
        {activeTab === "feed" && <Feed />}
        {activeTab === "search" && <DiscoverPage />}
        {activeTab === "typing" && <Typing />}
        {activeTab === "checkin" && <CheckIn />}
        {activeTab === "profile" && <Profile />}
      </div>

      {/* Bottom nav */}
      <nav style={{
        flexShrink: 0,
        height: 60,
        background: "rgba(0,0,0,0.9)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{ display: "flex", height: "100%" }}>
          {tabs.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            const color = isActive ? (id === "checkin" ? "#fb923c" : "#3b82f6") : "#6b7280";
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  color,
                }}
              >
                <div style={{ transform: isActive ? "scale(1.1)" : "scale(1)", transition: "transform 0.15s" }}>
                  <Icon size={20} color={color} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 500 }}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
