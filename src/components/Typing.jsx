import { useState, useEffect, useRef, useCallback } from "react";
import { RotateCcw, Trophy, Zap, Target, ChevronRight } from "lucide-react";
import { typingChallenges } from "../data/content";

function ResultCard({ wpm, accuracy, target, onNext, onRetry }) {
  const passed = wpm >= target;
  return (
    <div className="slide-up flex flex-col items-center gap-6 p-6">
      <div className={`text-6xl bounce-in ${passed ? "" : ""}`}>
        {passed ? "🏆" : "💪"}
      </div>
      <div className="text-center">
        <div className={`text-2xl font-bold mb-1 ${passed ? "text-green-400" : "text-orange-400"}`}>
          {passed ? "太棒了！" : "继续加油！"}
        </div>
        <div className="text-gray-400 text-sm">
          {passed ? "已达到目标速度" : `目标：${target} WPM`}
        </div>
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
        <button
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/10 text-white font-medium"
        >
          <RotateCcw size={16} /> 再试一次
        </button>
        <button
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 text-white font-medium"
        >
          下一题 <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default function Typing() {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const challenge = typingChallenges[challengeIdx];

  const reset = useCallback(() => {
    setInput("");
    setStarted(false);
    setFinished(false);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => { reset(); }, [challengeIdx, reset]);

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setElapsed(e => e + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, finished]);

  const handleInput = (e) => {
    const val = e.target.value;
    if (!started && val.length > 0) {
      setStarted(true);
      setStartTime(Date.now());
    }

    if (val.length <= challenge.text.length) {
      setInput(val);
    }

    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === challenge.text[i]) correct++;
    }
    const acc = val.length > 0 ? Math.round((correct / val.length) * 100) : 100;
    setAccuracy(acc);

    // Check if finished
    if (val === challenge.text) {
      clearInterval(timerRef.current);
      setFinished(true);
      const duration = (Date.now() - startTime) / 1000 / 60;
      const words = challenge.text.split(" ").length;
      setWpm(Math.round(words / duration));
    }

    // Live WPM
    if (started && startTime) {
      const duration = (Date.now() - startTime) / 1000 / 60;
      if (duration > 0) {
        const words = val.split(" ").length;
        setWpm(Math.round(words / duration));
      }
    }
  };

  const levelColor = { "初级": "text-green-400 bg-green-400/20", "中级": "text-yellow-400 bg-yellow-400/20", "高级": "text-red-400 bg-red-400/20" };

  const renderText = () => {
    return challenge.text.split("").map((char, i) => {
      let cls = "text-gray-500";
      if (i < input.length) {
        cls = input[i] === char ? "text-white" : "text-red-400 bg-red-400/20";
      } else if (i === input.length) {
        cls = "text-white border-b-2 border-blue-400 typing-cursor";
      }
      return (
        <span key={i} className={cls}>
          {char}
        </span>
      );
    });
  };

  const nextChallenge = () => {
    setChallengeIdx(i => (i + 1) % typingChallenges.length);
  };

  return (
    <div className="h-full overflow-y-auto pb-6">
      <div className="px-5 pt-6 pb-4">
        <h2 className="text-2xl font-bold">打字练习</h2>
        <p className="text-gray-400 text-sm mt-1">提升打字速度，强化肌肉记忆</p>
      </div>

      {/* Challenge selector */}
      <div className="flex gap-3 px-5 pb-4 overflow-x-auto no-scrollbar">
        {typingChallenges.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setChallengeIdx(i)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              i === challengeIdx
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-gray-400"
            }`}
          >
            第 {i + 1} 题
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="flex gap-3 px-5 mb-5">
        <div className="flex-1 bg-white/5 rounded-xl p-3 flex items-center gap-2">
          <Zap size={16} className="text-yellow-400" />
          <div>
            <div className="text-lg font-bold">{wpm}</div>
            <div className="text-xs text-gray-500">WPM</div>
          </div>
        </div>
        <div className="flex-1 bg-white/5 rounded-xl p-3 flex items-center gap-2">
          <Target size={16} className="text-green-400" />
          <div>
            <div className="text-lg font-bold">{accuracy}%</div>
            <div className="text-xs text-gray-500">准确率</div>
          </div>
        </div>
        <div className="flex-1 bg-white/5 rounded-xl p-3 flex items-center gap-2">
          <Trophy size={16} className="text-blue-400" />
          <div>
            <div className="text-lg font-bold">{challenge.wpm_target}</div>
            <div className="text-xs text-gray-500">目标</div>
          </div>
        </div>
      </div>

      {finished ? (
        <div className="px-5">
          <ResultCard
            wpm={wpm}
            accuracy={accuracy}
            target={challenge.wpm_target}
            onNext={nextChallenge}
            onRetry={reset}
          />
        </div>
      ) : (
        <div className="px-5 flex flex-col gap-4">
          {/* Level + Translation */}
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${levelColor[challenge.level]}`}>
              {challenge.level}
            </span>
            <span className="text-xs text-gray-500">{challenge.zh}</span>
          </div>

          {/* Text display */}
          <div
            className="bg-white/5 rounded-2xl p-4 text-lg leading-relaxed font-mono cursor-text border border-white/10"
            onClick={() => inputRef.current?.focus()}
          >
            {renderText()}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all"
              style={{ width: `${(input.length / challenge.text.length) * 100}%` }}
            />
          </div>

          {/* Input area */}
          <div className="relative">
            <input
              ref={inputRef}
              value={input}
              onChange={handleInput}
              placeholder={started ? "" : "点击此处开始打字..."}
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors text-base"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            {input.length > 0 && (
              <button
                onClick={reset}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>

          {!started && (
            <div className="text-center text-sm text-gray-500 mt-2">
              双击屏幕或点击输入框开始 ⌨️
            </div>
          )}

          {started && (
            <div className="text-center text-sm text-gray-400">
              ⏱ 已用时 {elapsed}s · 已输入 {input.length}/{challenge.text.length} 字符
            </div>
          )}
        </div>
      )}
    </div>
  );
}
