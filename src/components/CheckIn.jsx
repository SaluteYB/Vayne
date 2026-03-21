import { useState, useEffect } from "react";
import { Flame, Calendar, Award, Star, Lock, CheckCircle2, Zap } from "lucide-react";

const STREAK_KEY = "eng_streak";
const CHECKIN_KEY = "eng_checkin_days";
const LAST_DATE_KEY = "eng_last_date";

const today = () => new Date().toDateString();

const badges = [
  { day: 3, icon: "🌱", name: "初学者", desc: "连续打卡 3 天" },
  { day: 7, icon: "🔥", name: "一周战士", desc: "连续打卡 7 天" },
  { day: 14, icon: "⚡", name: "两周勇士", desc: "连续打卡 14 天" },
  { day: 30, icon: "💎", name: "月度精英", desc: "连续打卡 30 天" },
  { day: 100, icon: "👑", name: "百日之王", desc: "连续打卡 100 天" },
];

const dailyTasks = [
  { id: 1, icon: "📖", name: "学习一个单词", xp: 10 },
  { id: 2, icon: "⌨️", name: "打字练习 1 分钟", xp: 20 },
  { id: 3, icon: "👀", name: "刷 3 条内容", xp: 15 },
  { id: 4, icon: "🗣️", name: "跟读一个句子", xp: 25 },
];

function ConfettiEffect() {
  const emojis = ["🎉", "⭐", "🌟", "✨", "🎊"];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-3xl confetti"
          style={{
            left: `${10 + (i % 6) * 16}%`,
            top: `${20 + Math.floor(i / 6) * 30}%`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${0.8 + Math.random() * 0.5}s`,
          }}
        >
          {emojis[i % emojis.length]}
        </div>
      ))}
    </div>
  );
}

export default function CheckIn() {
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem(STREAK_KEY) || "0"));
  const [checkedInToday, setCheckedInToday] = useState(() => localStorage.getItem(LAST_DATE_KEY) === today());
  const [totalDays, setTotalDays] = useState(() => parseInt(localStorage.getItem(CHECKIN_KEY) || "0"));
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [xp, setXp] = useState(0);

  const handleCheckIn = () => {
    if (checkedInToday) return;
    const newStreak = streak + 1;
    const newTotal = totalDays + 1;
    setStreak(newStreak);
    setTotalDays(newTotal);
    setCheckedInToday(true);
    localStorage.setItem(STREAK_KEY, newStreak);
    localStorage.setItem(CHECKIN_KEY, newTotal);
    localStorage.setItem(LAST_DATE_KEY, today());
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const toggleTask = (task) => {
    const next = new Set(completedTasks);
    if (next.has(task.id)) {
      next.delete(task.id);
      setXp(x => x - task.xp);
    } else {
      next.add(task.id);
      setXp(x => x + task.xp);
    }
    setCompletedTasks(next);
  };

  const earnedBadges = badges.filter(b => streak >= b.day);
  const nextBadge = badges.find(b => streak < b.day);

  // Build 4-week calendar
  const calendarDays = Array.from({ length: 28 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (27 - i));
    const isToday = date.toDateString() === today();
    const isChecked = checkedInToday
      ? date <= new Date()
      : date < new Date() && i >= 28 - streak - 1 && !isToday;
    return { date, isToday, isChecked };
  });

  return (
    <div className="h-full overflow-y-auto pb-6">
      {showConfetti && <ConfettiEffect />}

      <div className="px-5 pt-6 pb-4">
        <h2 className="text-2xl font-bold">每日打卡</h2>
        <p className="text-gray-400 text-sm mt-1">坚持学习，养成好习惯</p>
      </div>

      {/* Streak hero */}
      <div className="mx-5 mb-5 rounded-3xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/80 via-red-600/80 to-pink-600/80" />
        <div className="relative p-6 flex flex-col items-center gap-3">
          <div className="text-7xl font-black drop-shadow">{streak}</div>
          <div className="flex items-center gap-2 text-white/90">
            <Flame size={20} className="text-orange-300" />
            <span className="text-lg font-semibold">天连续打卡</span>
          </div>
          {nextBadge && (
            <div className="text-sm text-white/70 text-center">
              还差 {nextBadge.day - streak} 天解锁 {nextBadge.icon} {nextBadge.name}
            </div>
          )}
          <button
            onClick={handleCheckIn}
            disabled={checkedInToday}
            className={`mt-2 w-full py-3.5 rounded-2xl font-bold text-lg transition-all ${
              checkedInToday
                ? "bg-white/20 text-white/50 cursor-default"
                : "bg-white text-orange-600 active:scale-95 shadow-lg"
            }`}
          >
            {checkedInToday ? "✅ 今日已打卡" : "🎯 立即打卡"}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 px-5 mb-5">
        <div className="flex-1 bg-white/5 rounded-2xl p-4 text-center">
          <Calendar size={20} className="text-blue-400 mx-auto mb-1" />
          <div className="text-2xl font-bold">{totalDays}</div>
          <div className="text-xs text-gray-500">累计天数</div>
        </div>
        <div className="flex-1 bg-white/5 rounded-2xl p-4 text-center">
          <Zap size={20} className="text-yellow-400 mx-auto mb-1" />
          <div className="text-2xl font-bold">{xp}</div>
          <div className="text-xs text-gray-500">今日经验</div>
        </div>
        <div className="flex-1 bg-white/5 rounded-2xl p-4 text-center">
          <Award size={20} className="text-purple-400 mx-auto mb-1" />
          <div className="text-2xl font-bold">{earnedBadges.length}</div>
          <div className="text-xs text-gray-500">徽章数量</div>
        </div>
      </div>

      {/* Daily tasks */}
      <div className="px-5 mb-5">
        <h3 className="text-base font-semibold mb-3">今日任务</h3>
        <div className="flex flex-col gap-2">
          {dailyTasks.map(task => {
            const done = completedTasks.has(task.id);
            return (
              <button
                key={task.id}
                onClick={() => toggleTask(task)}
                className={`flex items-center gap-3 p-4 rounded-2xl text-left transition-all active:scale-98 ${
                  done ? "bg-green-500/20 border border-green-500/30" : "bg-white/5 border border-white/5"
                }`}
              >
                <span className="text-2xl">{task.icon}</span>
                <div className="flex-1">
                  <div className={`font-medium text-sm ${done ? "line-through text-gray-400" : "text-white"}`}>
                    {task.name}
                  </div>
                  <div className="text-xs text-yellow-400 mt-0.5">+{task.xp} XP</div>
                </div>
                {done
                  ? <CheckCircle2 size={20} className="text-green-400 shrink-0" />
                  : <div className="w-5 h-5 rounded-full border-2 border-gray-500 shrink-0" />
                }
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar */}
      <div className="px-5 mb-5">
        <h3 className="text-base font-semibold mb-3">打卡记录</h3>
        <div className="bg-white/5 rounded-2xl p-4">
          <div className="grid grid-cols-7 gap-1.5">
            {["日", "一", "二", "三", "四", "五", "六"].map(d => (
              <div key={d} className="text-center text-xs text-gray-500 pb-1">{d}</div>
            ))}
            {calendarDays.map((day, i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                  day.isToday
                    ? checkedInToday
                      ? "bg-orange-500 text-white"
                      : "bg-white/20 text-white ring-2 ring-orange-500"
                    : day.isChecked
                    ? "bg-orange-500/60 text-white"
                    : "bg-white/5 text-gray-600"
                }`}
              >
                {day.isToday && checkedInToday ? "🔥" : day.date.getDate()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="px-5">
        <h3 className="text-base font-semibold mb-3">成就徽章</h3>
        <div className="grid grid-cols-3 gap-3">
          {badges.map(badge => {
            const earned = streak >= badge.day;
            return (
              <div
                key={badge.day}
                className={`rounded-2xl p-3 text-center border ${
                  earned
                    ? "bg-yellow-500/10 border-yellow-500/30"
                    : "bg-white/5 border-white/5 opacity-50"
                }`}
              >
                <div className={`text-3xl mb-1 ${!earned ? "grayscale" : ""}`}>
                  {earned ? badge.icon : <Lock size={24} className="mx-auto text-gray-600" />}
                </div>
                <div className="text-xs font-semibold">{badge.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{badge.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
