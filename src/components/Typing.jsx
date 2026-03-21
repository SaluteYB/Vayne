import { useState, useEffect, useRef, useCallback } from "react";
import { RotateCcw, Trophy, Zap, Target, ChevronRight } from "lucide-react";
import { posts } from "../data/content";

// Extract all dialogue lines from posts as typing challenges
const challenges = posts.flatMap(post =>
  post.content.en.map((line, i) => ({
    id: `${post.id}-${i}`,
    text: line.text,
    zh: post.content.zh[i].text,
    scene: post.user.name,
    role: line.role,
    accent: post.accent,
    tags: post.tags,
  }))
);

function ResultCard({ wpm, accuracy, onNext, onRetry }) {
  const passed = wpm >= 25;
  return (
    <div className="slide-up flex flex-col items-center gap-6 p-6">
      <div className={`text-6xl bounce-in`}>{passed ? "🏆" : "💪"}</div>
      <div className="text-center">
        <div className={`text-2xl font-bold mb-1 ${passed ? "text-green-400" : "text-orange-400"}`}>
          {passed ? "太棒了！" : "继续加油！"}
        </div>
        <div className="text-gray-400 text-sm">{passed ? "流畅完成" : "多练几次会更好"}</div>
      </div>
      <div className="flex gap-6 w-full">
        <div className="flex-1 bg-white/10 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">{wpm}</div>
          <div className="text-xs text-gray-400 mt-1">WPM</div>
        </div>
        <div className="flex-1 bg-white/10 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{accuracy}%</div>
          <div className="text-xs text-gray-400 mt-1">准确率</div>
        </div>
      </div>
      <div className="flex gap-3 w-full">
        <button onClick={onRetry} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/10 text-white font-medium">
          <RotateCcw size={16} /> 再试一次
        </button>
        <button onClick={onNext} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 text-white font-medium">
          下一句 <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default function Typing() {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const challenge = challenges[idx % challenges.length];

  const reset = useCallback(() => {
    setInput("");
    setStarted(false);
    setFinished(false);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setElapsed(0);
    clearInterval(timerRef.current);
  }, []);

  useEffect(() => { reset(); }, [idx, reset]);

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, finished]);

  const handleInput = (e) => {
    const val = e.target.value;
    if (!started && val.length > 0) {
      setStarted(true);
      setStartTime(Date.now());
    }
    if (val.length > challenge.text.length) return;
    setInput(val);

    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === challenge.text[i]) correct++;
    }
    setAccuracy(val.length > 0 ? Math.round((correct / val.length) * 100) : 100);

    if (val === challenge.text) {
      clearInterval(timerRef.current);
      setFinished(true);
      const mins = (Date.now() - startTime) / 1000 / 60;
      setWpm(Math.round(challenge.text.split(" ").length / mins));
    } else if (started && startTime) {
      const mins = (Date.now() - startTime) / 1000 / 60;
      if (mins > 0) setWpm(Math.round(val.split(" ").length / mins));
    }
  };

  const renderText = () =>
    challenge.text.split("").map((char, i) => {
      let cls = "text-gray-500";
      if (i < input.length) cls = input[i] === char ? "text-white" : "text-red-400 bg-red-400/20 rounded";
      else if (i === input.length) cls = "text-white border-b-2 border-blue-400 typing-cursor";
      return <span key={i} className={cls}>{char}</span>;
    });

  return (
    <div className="py-4 flex flex-col gap-4">
      <div className="pt-2">
        <h2 className="text-xl font-bold">打字练习</h2>
        <p className="text-gray-500 text-sm mt-0.5">练习学过的对话句子，强化记忆</p>
      </div>

      {/* Scene context */}
      <div className="rounded-2xl border border-white/10 p-4" style={{ background: "#111" }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500">场景：</span>
          <span className="text-xs font-medium" style={{ color: challenge.accent }}>{challenge.scene}</span>
          <span className="text-xs px-1.5 py-0.5 rounded ml-auto" style={{ background: challenge.accent + "20", color: challenge.accent }}>
            角色 {challenge.role}
          </span>
        </div>
        <div className="text-gray-400 text-sm">{challenge.zh}</div>
      </div>

      {/* Stats */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-xl p-3 flex items-center gap-2" style={{ background: "#111" }}>
          <Zap size={15} className="text-yellow-400" />
          <div>
            <div className="text-base font-bold">{wpm}</div>
            <div className="text-xs text-gray-500">WPM</div>
          </div>
        </div>
        <div className="flex-1 rounded-xl p-3 flex items-center gap-2" style={{ background: "#111" }}>
          <Target size={15} className="text-green-400" />
          <div>
            <div className="text-base font-bold">{accuracy}%</div>
            <div className="text-xs text-gray-500">准确率</div>
          </div>
        </div>
        <div className="flex-1 rounded-xl p-3 flex items-center gap-2" style={{ background: "#111" }}>
          <Trophy size={15} className="text-blue-400" />
          <div>
            <div className="text-base font-bold">{elapsed}s</div>
            <div className="text-xs text-gray-500">用时</div>
          </div>
        </div>
      </div>

      {finished ? (
        <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: "#111" }}>
          <ResultCard wpm={wpm} accuracy={accuracy} onNext={() => setIdx(i => i + 1)} onRetry={reset} />
        </div>
      ) : (
        <>
          {/* Text to type */}
          <div
            className="rounded-2xl p-4 text-lg leading-relaxed font-mono cursor-text border border-white/10"
            style={{ background: "#111" }}
            onClick={() => inputRef.current?.focus()}
          >
            {renderText()}
          </div>

          {/* Progress */}
          <div className="w-full bg-white/10 rounded-full h-1">
            <div
              className="h-1 rounded-full transition-all"
              style={{ width: `${(input.length / challenge.text.length) * 100}%`, background: challenge.accent }}
            />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            value={input}
            onChange={handleInput}
            placeholder="点击此处开始打字..."
            className="w-full border border-white/15 rounded-2xl px-4 py-4 text-white placeholder-gray-600 outline-none focus:border-blue-500 transition-colors text-base"
            style={{ background: "#111" }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setIdx(i => i + 1)}
              className="text-xs text-gray-500 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              跳过这句 →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
