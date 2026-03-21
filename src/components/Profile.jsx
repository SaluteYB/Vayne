import { Settings, Edit3, Bookmark, Heart, TrendingUp, BookOpen } from "lucide-react";

const stats = [
  { label: "打卡天数", value: "0", icon: "🔥" },
  { label: "学习词汇", value: "0", icon: "📚" },
  { label: "打字WPM", value: "0", icon: "⌨️" },
  { label: "获赞", value: "0", icon: "❤️" },
];

export default function Profile() {
  return (
    <div className="h-full overflow-y-auto pb-6">
      {/* Header */}
      <div className="relative px-5 pt-6 pb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">我的主页</h2>
        <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <Settings size={18} />
        </button>
      </div>

      {/* Avatar + info */}
      <div className="flex flex-col items-center px-5 pb-6">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-lg shadow-purple-500/30">
            🐟
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow">
            <Edit3 size={14} />
          </button>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold shadow">
            B2
          </div>
        </div>
        <div className="text-xl font-bold mb-1">小姐同学</div>
        <div className="text-gray-400 text-sm mb-4">每天进步一点点 ✨</div>
        <button className="px-8 py-2 rounded-full bg-blue-600 text-white text-sm font-medium">
          编辑资料
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 px-5 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white/5 rounded-2xl p-3 text-center">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-lg font-bold">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Learning progress */}
      <div className="px-5 mb-5">
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
          <TrendingUp size={16} className="text-green-400" /> 学习进度
        </h3>
        <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-4">
          {[
            { label: "词汇量", current: 0, max: 1000, color: "bg-blue-500" },
            { label: "听力理解", current: 0, max: 100, color: "bg-green-500" },
            { label: "阅读速度", current: 0, max: 100, color: "bg-purple-500" },
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-300">{item.label}</span>
                <span className="text-gray-500">{item.current}/{item.max}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className={`${item.color} h-2 rounded-full transition-all`}
                  style={{ width: `${(item.current / item.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="px-5 flex flex-col gap-2">
        <button className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
          <Bookmark size={18} className="text-blue-400" />
          <span className="text-sm font-medium">我的收藏</span>
          <span className="ml-auto text-gray-500 text-sm">0</span>
        </button>
        <button className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
          <Heart size={18} className="text-pink-400" />
          <span className="text-sm font-medium">我的喜欢</span>
          <span className="ml-auto text-gray-500 text-sm">0</span>
        </button>
        <button className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
          <BookOpen size={18} className="text-green-400" />
          <span className="text-sm font-medium">学习记录</span>
          <span className="ml-auto text-gray-500 text-sm">查看 →</span>
        </button>
      </div>
    </div>
  );
}
