"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, AlertTriangle, X } from "lucide-react"
import { useExamIslandSafe } from "@/hooks/use-exam-island"

/* ════════════════════════════════════
   灵动岛 (Dynamic Island) 🏝️
   — Apple 风格的全局考试倒计时
   
   交互细节：
   1. 考试开始 → 黑色胶囊从顶部平滑展开
   2. 倒计时数字安静跳动
   3. 剩余 5 分钟 → 胶囊放大变红 → 再缩回去
   4. 跨页面保持悬浮（layoutId）
   ════════════════════════════════════ */

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, "0")}`
}

export function DynamicIsland() {
  const island = useExamIslandSafe()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isWarning, setIsWarning] = useState(false)
  const [showPulse, setShowPulse] = useState(false)
  const [hasWarnedOnce, setHasWarnedOnce] = useState(false)
  const [prevTimeLeft, setPrevTimeLeft] = useState<number | null>(null)

  const isActive = island?.isActive && !island?.isSubmitted
  const timeLeft = island?.timeLeft ?? 0
  const isUrgent = timeLeft <= 300 && timeLeft > 0 // 5 分钟内

  // 检测进入 5 分钟倒计时 — 触发警告动画
  useEffect(() => {
    if (!isActive) return
    if (isUrgent && !hasWarnedOnce) {
      setHasWarnedOnce(true)
      setIsWarning(true)
      setShowPulse(true)
      // 3 秒后缩回
      const timer = setTimeout(() => {
        setIsWarning(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isUrgent, isActive, hasWarnedOnce])

  // 考试结束或提交时重置
  useEffect(() => {
    if (!isActive) {
      setHasWarnedOnce(false)
      setIsWarning(false)
      setShowPulse(false)
    }
  }, [isActive])

  // 倒计时跳动效果 — 每秒触发
  useEffect(() => {
    if (!isActive) return
    if (prevTimeLeft !== null && timeLeft !== prevTimeLeft) {
      setShowPulse(true)
      const t = setTimeout(() => setShowPulse(false), 300)
      return () => clearTimeout(t)
    }
    setPrevTimeLeft(timeLeft)
  }, [timeLeft, isActive, prevTimeLeft])

  // 时间到自动消失
  useEffect(() => {
    if (island?.isActive && timeLeft <= 0 && !island?.isSubmitted) {
      // 触发提交由 exam/take 页面处理
    }
  }, [timeLeft, island])

  if (!isActive) return null

  const progress = island ? timeLeft / island.timeLimit : 0

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          layoutId="dynamic-island"
          className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999]"
          initial={{ y: -80, opacity: 0, scale: 0.8 }}
          animate={{
            y: 0,
            opacity: 1,
            scale: isWarning ? 1.12 : 1,
          }}
          exit={{ y: -80, opacity: 0, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 0.8,
          }}
        >
          <motion.div
            className={`
              relative flex items-center gap-2.5
              rounded-[24px] px-5 py-2.5
              cursor-pointer select-none
              overflow-hidden
              shadow-[0_4px_24px_rgba(0,0,0,0.25)]
              transition-colors duration-700
              ${isWarning
                ? "bg-[#FF3B30] shadow-[0_4px_32px_rgba(255,59,48,0.5)]"
                : "bg-[#1C1C1E] dark:bg-[#2C2C2E] shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
              }
            `}
            onClick={() => setIsExpanded(!isExpanded)}
            layout
          >
            {/* 进度条轨道 — 底部细线 */}
            <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  isUrgent ? "bg-[#FF6B6B]" : "bg-[#007AFF]"
                }`}
                initial={false}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.5, ease: "linear" }}
              />
            </div>

            {/* 图标 */}
            <motion.div
              animate={{
                scale: showPulse ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {isUrgent ? (
                <AlertTriangle className="size-4 text-[#FFD60A]" />
              ) : (
                <Clock className="size-3.5 text-white/70" />
              )}
            </motion.div>

            {/* 文字区域 */}
            <div className="flex items-center gap-2">
              <span className={`text-[13px] font-medium ${isWarning ? "text-white" : "text-white/80"}`}>
                模考中
              </span>

              {/* 分隔圆点 */}
              <span className={`size-1 rounded-full ${isWarning ? "bg-white/60" : "bg-white/20"}`} />

              {/* 倒计时数字 */}
              <motion.span
                key={timeLeft}
                className={`text-[13px] font-semibold tabular-nums tracking-wide ${
                  isWarning
                    ? "text-white"
                    : isUrgent
                      ? "text-[#FF6B6B]"
                      : "text-white"
                }`}
                initial={{ y: -2, opacity: 0.5 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                {formatTime(timeLeft)}
              </motion.span>
            </div>

            {/* 展开状态 — 进度信息 */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 overflow-hidden"
                >
                  <span className="size-1 rounded-full bg-white/20" />
                  <span className="text-[11px] text-white/50 whitespace-nowrap">
                    {Math.round(progress * 100)}% 剩余
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 警告脉冲光环 */}
            {isWarning && (
              <motion.div
                className="absolute inset-0 rounded-[24px] border-2 border-[#FF3B30]/60"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: [1, 1.05, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}

            {/* 关闭按钮（非考试进行中才显示） */}
            {isExpanded && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="ml-1 size-5 rounded-full grid place-items-center bg-white/10 hover:bg-white/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  island?.stopExam()
                }}
              >
                <X className="size-3 text-white/60" />
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
