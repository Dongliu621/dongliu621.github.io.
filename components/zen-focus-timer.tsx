"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion"
import { Play, Pause, RotateCcw, X, Flame, Coffee } from "lucide-react"

/* ── 配置 ── */
const MODES = [
  { key: "focus", label: "專注", minutes: 25, color: "#FF3B30", bg: "bg-red-500" },
  { key: "short", label: "短休", minutes: 5, color: "#34C759", bg: "bg-emerald-500" },
  { key: "long", label: "長休", minutes: 15, color: "#007AFF", bg: "bg-blue-500" },
] as const

type ModeKey = "focus" | "short" | "long"

const FAB_SIZE = 56
const EDGE_MARGIN = 24
const DRAG_THRESHOLD = 6 // 超过此距离才视为拖拽

/* ── SVG 圓環 ── */
function ActivityRing({ radius, progress, color, strokeWidth }: { radius: number; progress: number; color: string; strokeWidth: number }) {
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)
  return (
    <circle
      cx="0" cy="0" r={radius} fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      strokeDasharray={circumference} strokeDashoffset={offset}
      transform="rotate(-90)"
      style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
    />
  )
}

function TrackRing({ radius, strokeWidth, color }: { radius: number; strokeWidth: number; color: string }) {
  const circumference = 2 * Math.PI * radius
  return (
    <circle
      cx="0" cy="0" r={radius} fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      strokeDasharray={circumference} strokeDashoffset={0}
      transform="rotate(-90)"
    />
  )
}

/* ════════════════════════════════════
   番茄鐘主組件
   ════════════════════════════════════ */
export function ZenFocusTimer() {
  const [expanded, setExpanded] = useState(false)
  const [modeKey, setModeKey] = useState<ModeKey>("focus")
  const [totalSeconds, setTotalSeconds] = useState(MODES[0].minutes * 60)
  const [secondsLeft, setSecondsLeft] = useState(MODES[0].minutes * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)

  /* ── 自定义拖拽（不用 framer-motion drag，解决点击冲突） ── */
  const fabX = useMotionValue(0)
  const fabY = useMotionValue(0)
  const isDragging = useRef(false)
  const isPointerDown = useRef(false) // 是否处于按下状态
  const pointerStart = useRef({ x: 0, y: 0 })
  const fabStartOffset = useRef({ x: 0, y: 0 })

  /** pointer down → 记录起始位置 */
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    isPointerDown.current = true
    isDragging.current = false
    pointerStart.current = { x: e.clientX, y: e.clientY }
    fabStartOffset.current = { x: fabX.get(), y: fabY.get() }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [fabX, fabY])

  /** pointer move → 仅在按下后才处理，超过阈值才开始拖拽 */
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPointerDown.current) return // 没按下 → 忽略悬停移动

    const dx = e.clientX - pointerStart.current.x
    const dy = e.clientY - pointerStart.current.y

    if (!isDragging.current) {
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < DRAG_THRESHOLD) return
      isDragging.current = true
    }

    fabX.set(fabStartOffset.current.x + dx)
    fabY.set(fabStartOffset.current.y + dy)
  }, [fabX, fabY])

  /** pointer up → 点击 or 吸附 */
  const handlePointerUp = useCallback(() => {
    isPointerDown.current = false
    if (!isDragging.current) {
      // 没有拖拽 → 点击展开
      setExpanded(true)
      return
    }

    // 拖拽结束 → 吸附到最近的边
    const vw = window.innerWidth
    const vh = window.innerHeight

    const initialLeft = vw - FAB_SIZE - EDGE_MARGIN
    const initialTop = vh - FAB_SIZE - EDGE_MARGIN
    const currentLeft = initialLeft + fabX.get()
    const currentTop = initialTop + fabY.get()
    const centerX = currentLeft + FAB_SIZE / 2
    const centerY = currentTop + FAB_SIZE / 2

    const distLeft = centerX
    const distRight = vw - centerX
    const distTop = centerY
    const distBottom = vh - centerY
    const minDist = Math.min(distLeft, distRight, distTop, distBottom)

    let targetLeft: number
    let targetTop: number

    if (minDist === distLeft) {
      targetLeft = EDGE_MARGIN
      targetTop = currentTop
    } else if (minDist === distRight) {
      targetLeft = vw - FAB_SIZE - EDGE_MARGIN
      targetTop = currentTop
    } else if (minDist === distTop) {
      targetLeft = currentLeft
      targetTop = EDGE_MARGIN
    } else {
      targetLeft = currentLeft
      targetTop = vh - FAB_SIZE - EDGE_MARGIN
    }

    targetLeft = Math.max(EDGE_MARGIN, Math.min(vw - FAB_SIZE - EDGE_MARGIN, targetLeft))
    targetTop = Math.max(EDGE_MARGIN, Math.min(vh - FAB_SIZE - EDGE_MARGIN, targetTop))

    animate(fabX, targetLeft - initialLeft, { type: "spring", stiffness: 340, damping: 28 })
    animate(fabY, targetTop - initialTop, { type: "spring", stiffness: 340, damping: 28 })

    isDragging.current = false
  }, [fabX, fabY])

  const mode = MODES.find((m) => m.key === modeKey)!
  const progress = totalSeconds > 0 ? 1 - secondsLeft / totalSeconds : 0
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  /* 倒计时 */
  useEffect(() => {
    if (!running || secondsLeft <= 0) return
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false)
          if (modeKey === "focus") setSessions((n) => n + 1)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running, secondsLeft, modeKey])

  /* 切换模式 */
  const switchMode = useCallback(
    (key: ModeKey) => {
      const m = MODES.find((m) => m.key === key)!
      setModeKey(key)
      setTotalSeconds(m.minutes * 60)
      setSecondsLeft(m.minutes * 60)
      setRunning(false)
    },
    []
  )

  /* 重置 */
  const reset = useCallback(() => {
    setSecondsLeft(totalSeconds)
    setRunning(false)
  }, [totalSeconds])

  /* 切换运行 */
  const toggleRun = useCallback(() => {
    if (secondsLeft <= 0) {
      setSecondsLeft(totalSeconds)
    }
    setRunning((r) => !r)
  }, [secondsLeft, totalSeconds])

  return (
    <>
      {/* ── 悬浮小球 ── */}
      <AnimatePresence>
        {!expanded && (
          <motion.div
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{ x: fabX, y: fabY }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 cursor-pointer touch-none select-none"
          >
            <div className="relative size-14 rounded-full bg-white/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/60 flex items-center justify-center overflow-hidden">
              {/* 迷你进度环 */}
              <svg
                viewBox="-30 -30 60 60"
                className="absolute inset-0 size-full -rotate-90"
              >
                <circle cx="0" cy="0" r="24" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="3" />
                <circle
                  cx="0"
                  cy="0"
                  r="24"
                  fill="none"
                  stroke={mode.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 24}
                  strokeDashoffset={2 * Math.PI * 24 * (1 - progress)}
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              {/* 中心图标 */}
              <div className="relative z-10">
                {running ? (
                  <Flame className="size-5" style={{ color: mode.color }} />
                ) : (
                  <Coffee className="size-5 text-neutral-400" />
                )}
              </div>
              {/* 运行时呼吸光晕 */}
              {running && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: `${mode.color}15` }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </div>
            {/* 小球下方提示 */}
            {secondsLeft > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-black/80 text-white text-[10px] font-bold flex items-center justify-center px-1 tabular-nums pointer-events-none">
                {minutes}:{String(seconds).padStart(2, "0")}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 展开面板 ── */}
      <AnimatePresence>
        {expanded && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setExpanded(false)}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            />

            {/* 面板主体 */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.5, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 40 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="fixed bottom-6 right-6 z-50 w-[320px] rounded-[28px] bg-white/60 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] border border-white/70 overflow-hidden"
            >
              {/* 顶部拖拽条 */}
              <div className="flex items-center justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-black/10" />
              </div>

              {/* 标题栏 */}
              <div className="flex items-center justify-between px-6 pb-2">
                <div className="flex items-center gap-2">
                  <Flame className="size-4" style={{ color: mode.color }} />
                  <span className="text-sm font-semibold text-neutral-700">Zen Focus</span>
                </div>
                <button
                  onClick={() => setExpanded(false)}
                  className="p-1 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
                >
                  <X className="size-4 text-neutral-400" />
                </button>
              </div>

              {/* ═══ Apple Watch 圆环区域 ═══ */}
              <div className="flex items-center justify-center py-6">
                <div className="relative">
                  {/* 三环 SVG */}
                  <svg viewBox="-60 -60 120 120" className="w-48 h-48">
                    {/* 底色环 */}
                    <TrackRing radius={50} strokeWidth={7} color="rgba(255,59,48,0.12)" />
                    <TrackRing radius={39} strokeWidth={7} color="rgba(52,199,89,0.12)" />
                    <TrackRing radius={28} strokeWidth={7} color="rgba(0,122,255,0.12)" />
                    {/* 进度环 */}
                    <ActivityRing radius={50} progress={modeKey === "focus" ? progress : 0} color="#FF3B30" strokeWidth={7} />
                    <ActivityRing radius={39} progress={modeKey === "short" ? progress : 0} color="#34C759" strokeWidth={7} />
                    <ActivityRing radius={28} progress={modeKey === "long" ? progress : 0} color="#007AFF" strokeWidth={7} />
                  </svg>

                  {/* 中心时间 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="text-3xl font-extrabold tabular-nums tracking-tight"
                      style={{ color: mode.color }}
                    >
                      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-medium mt-0.5">{mode.label}</span>
                  </div>
                </div>
              </div>

              {/* 模式切换 */}
              <div className="flex items-center gap-2 px-6 pb-4">
                {MODES.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => switchMode(m.key)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      modeKey === m.key
                        ? `${m.bg} text-white shadow-md`
                        : "bg-black/[0.04] text-neutral-500 hover:bg-black/[0.06]"
                    }`}
                  >
                    {m.label}
                    <span className="ml-1 opacity-70">{m.minutes}′</span>
                  </button>
                ))}
              </div>

              {/* 控制按钮 */}
              <div className="flex items-center justify-center gap-4 px-6 pb-3">
                <button
                  onClick={reset}
                  className="size-10 rounded-full bg-black/[0.04] flex items-center justify-center hover:bg-black/[0.08] transition-colors cursor-pointer"
                >
                  <RotateCcw className="size-4 text-neutral-500" />
                </button>

                <button
                  onClick={toggleRun}
                  className="size-14 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer active:scale-95"
                  style={{
                    background: mode.color,
                    boxShadow: `0 4px 20px ${mode.color}40`,
                  }}
                >
                  {running ? (
                    <Pause className="size-5 text-white fill-white" />
                  ) : (
                    <Play className="size-5 text-white fill-white ml-0.5" />
                  )}
                </button>

                <div className="size-10 rounded-full bg-black/[0.04] flex items-center justify-center">
                  <span className="text-xs font-bold text-neutral-500 tabular-nums">{sessions}</span>
                </div>
              </div>

              {/* 底部提示 */}
              <div className="flex items-center justify-center gap-1 px-6 pb-4">
                <Flame className="size-3 text-red-400" />
                <span className="text-[11px] text-neutral-400">已完成 {sessions} 個番茄</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
