"use client"

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"

/* ════════════════════════════════════
   灵动岛全局状态 — 跨页面倒计时
   ════════════════════════════════════ */

interface ExamIslandState {
  /** 是否有正在进行的考试 */
  isActive: boolean
  /** 考试开始时间戳 */
  startedAt: number
  /** 时间限制（秒） */
  timeLimit: number
  /** 剩余秒数 */
  timeLeft: number
  /** 是否已提交 */
  isSubmitted: boolean
}

interface ExamIslandContextValue extends ExamIslandState {
  /** 启动灵动岛倒计时 */
  startExam: (startedAt: number, timeLimit: number) => void
  /** 停止灵动岛（交卷/退出） */
  stopExam: () => void
  /** 标记已提交 */
  markSubmitted: () => void
}

const STORAGE_KEY = "threeLiu4_island_state"

const ExamIslandContext = createContext<ExamIslandContextValue | null>(null)

export function useExamIsland() {
  const ctx = useContext(ExamIslandContext)
  if (!ctx) throw new Error("useExamIsland must be used within ExamIslandProvider")
  return ctx
}

export function useExamIslandSafe() {
  return useContext(ExamIslandContext)
}

function loadSavedState(): ExamIslandState | null {
  if (typeof window === "undefined") return null
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return null
    const parsed = JSON.parse(data) as ExamIslandState
    // 如果考试已过期或已提交，不恢复
    if (parsed.isSubmitted) return null
    const elapsed = Math.floor((Date.now() - parsed.startedAt) / 1000)
    if (elapsed >= parsed.timeLimit) return null
    return { ...parsed, timeLeft: Math.max(0, parsed.timeLimit - elapsed) }
  } catch {
    return null
  }
}

function saveState(state: ExamIslandState | null) {
  if (typeof window === "undefined") return
  try {
    if (state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch { /* silent */ }
}

export function ExamIslandProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ExamIslandState>(() => ({
    isActive: false,
    startedAt: 0,
    timeLimit: 0,
    timeLeft: 0,
    isSubmitted: false,
  }))

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const initialized = useRef(false)

  // 恢复上次未完成的考试
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const saved = loadSavedState()
    if (saved) {
      setState(saved)
    }
  }, [])

  // 倒计时逻辑
  useEffect(() => {
    if (!state.isActive || state.isSubmitted || state.timeLeft <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setState(prev => {
        const elapsed = Math.floor((Date.now() - prev.startedAt) / 1000)
        const remaining = Math.max(0, prev.timeLimit - elapsed)
        const next = { ...prev, timeLeft: remaining }
        saveState(next)
        if (remaining <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
        return next
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state.isActive, state.isSubmitted, state.timeLeft <= 0])

  const startExam = useCallback((startedAt: number, timeLimit: number) => {
    const newState: ExamIslandState = {
      isActive: true,
      startedAt,
      timeLimit,
      timeLeft: timeLimit,
      isSubmitted: false,
    }
    setState(newState)
    saveState(newState)
  }, [])

  const stopExam = useCallback(() => {
    setState({
      isActive: false,
      startedAt: 0,
      timeLimit: 0,
      timeLeft: 0,
      isSubmitted: false,
    })
    saveState(null)
  }, [])

  const markSubmitted = useCallback(() => {
    setState(prev => {
      const next = { ...prev, isSubmitted: true }
      saveState(null) // 提交后清除存储
      return next
    })
  }, [])

  return (
    <ExamIslandContext.Provider
      value={{
        ...state,
        startExam,
        stopExam,
        markSubmitted,
      }}
    >
      {children}
    </ExamIslandContext.Provider>
  )
}
