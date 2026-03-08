"use client";

import { useState, useEffect, useCallback } from "react";

type TimerProps = {
  durationMinutes: number;
  onTimeUp: () => void;
};

export function Timer({ durationMinutes, onTimeUp }: TimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(durationMinutes * 60);

  const handleTimeUp = useCallback(onTimeUp, [onTimeUp]);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      handleTimeUp();
      return;
    }
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingSeconds <= 0, handleTimeUp]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isWarning = remainingSeconds <= 600; // 10分以下
  const isCritical = remainingSeconds <= 60; // 1分以下

  const colorClass = isCritical
    ? "text-red-600 dark:text-red-400 animate-pulse"
    : isWarning
    ? "text-red-600 dark:text-red-400"
    : "text-gray-700 dark:text-gray-300";

  const bgClass = isCritical
    ? "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800"
    : isWarning
    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700";

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-mono font-medium min-h-[44px] ${bgClass} ${colorClass}`}
      role="timer"
      aria-label={`残り時間 ${minutes}分${seconds}秒`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
}
