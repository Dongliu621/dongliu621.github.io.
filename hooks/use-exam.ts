"use client"

import { useState, useCallback } from "react"
import type { ExamSettings, ExamSession, UserAnswer } from "@/lib/exam-types"
import { filterQuestions } from "@/lib/questions-data"
import type { Question } from "@/lib/questions-data"

const SESSION_KEY = "threeLiu4_exam_session"
const TEMPLATE_KEY = "threeLiu4_exam_templates"

/* ── localStorage 读写工具 ── */
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key: string, value: unknown) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* silent */ }
}

/* ── 模板管理 ── */
function loadTemplates(): Record<string, import("./exam-types").ExamTemplate> {
  return loadFromStorage<Record<string, import("./exam-types").ExamTemplate>>(TEMPLATE_KEY, {})
}

function saveTemplates(templates: Record<string, import("./exam-types").ExamTemplate>) {
  saveToStorage(TEMPLATE_KEY, templates)
}

/** 從題庫中按設置隨機抽取試題 */
function generateQuestions(settings: ExamSettings): Question[] {
  let pool: Question[]

  if (settings.mode === 'simulate') {
    const choices = filterQuestions({ type: 'choice' })
    const freeResponses = filterQuestions({ type: 'free-response' })

    const shuffledChoices = [...choices].sort(() => Math.random() - 0.5)
    const shuffledFR = [...freeResponses].sort(() => Math.random() - 0.5)

    pool = [
      ...shuffledChoices.slice(0, settings.questionTypes.choice),
      ...shuffledFR.slice(0, settings.questionTypes.freeResponse),
    ]
  } else {
    pool = filterQuestions({
      topic: settings.selectedTopics.length > 0 ? (settings.selectedTopics[0] as any) : 'all',
      type: undefined,
    })

    if (settings.selectedTopics.length > 1) {
      const seen = new Set<string>()
      pool = pool.filter(q => {
        if (seen.has(q.id)) return false
        seen.add(q.id)
        return true
      })
    }

    pool.sort(() => Math.random() - 0.5)
    const choicePool = pool.filter(q => q.type === 'choice')
    const frPool = pool.filter(q => q.type === 'free-response')

    pool = [
      ...choicePool.slice(0, settings.questionTypes.choice),
      ...frPool.slice(0, settings.questionTypes.freeResponse),
    ]
  }

  return pool
}

/* ════════════════════════════════════
   useExamSession — 管理答题会话
   ════════════════════════════════════ */
export function useExamSession() {
  const [session, setSession] = useState<ExamSession | null>(null)

  /** 從 localStorage 恢復會話 */
  const restoreSession = useCallback((sessionId: string): ExamSession | null => {
    const saved = loadFromStorage<ExamSession | null>(SESSION_KEY, null)
    if (saved && saved.id === sessionId) {
      setSession(saved)
      return saved
    }
    return null
  }, [])

  /** 建立新的答題會話 */
  const createSession = useCallback((settings: ExamSettings) => {
    const questions = generateQuestions(settings)
    const answers: Record<string, UserAnswer> = {}
    questions.forEach(q => {
      answers[q.id] = { questionId: q.id, isBookmarked: false, selectedOption: null }
    })

    const newSession: ExamSession = {
      id: `exam_${Date.now()}`,
      settings,
      questions,
      answers,
      startedAt: Date.now(),
      timeLimit: settings.timeLimit * 60,
      isSubmitted: false,
    }
    setSession(newSession)
    saveToStorage(SESSION_KEY, newSession)
    return newSession
  }, [])

  /** 更新作答（選擇題選項） */
  const selectOption = useCallback((questionId: string, optionIndex: number | null) => {
    if (!session || session.isSubmitted) return
    setSession(prev => {
      if (!prev) return prev
      const updated = {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: { ...(prev.answers[questionId]), selectedOption: optionIndex },
        },
      }
      saveToStorage(SESSION_KEY, updated)
      return updated
    })
  }, [session])

  /** 切換收藏 */
  const toggleBookmark = useCallback((questionId: string) => {
    if (!session) return
    setSession(prev => {
      if (!prev) return prev
      const current = prev.answers[questionId]
      if (!current) return prev
      const updated = {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: { ...current, isBookmarked: !current.isBookmarked },
        },
      }
      saveToStorage(SESSION_KEY, updated)
      return updated
    })
  }, [session])

  /** 提交答卷並計分（僅計算選擇題）*/
  const submitExam = useCallback(() => {
    if (!session || session.isSubmitted) return null

    let correct = 0
    let totalChoice = 0

    session.questions.forEach(q => {
      if (q.type !== 'choice') return
      totalChoice++
      const answer = session.answers[q.id]
      if (answer?.selectedOption !== null && answer.selectedOption !== undefined && answer.selectedOption >= 0) {
        const correctLetter = q.answer.trim()[0].toUpperCase()
        const selectedLetter = String.fromCharCode(65 + answer.selectedOption)
        if (selectedLetter === correctLetter) correct++
      }
    })

    const score = totalChoice > 0 ? Math.round((correct / totalChoice) * 100) : 0

    const updated = { ...session, isSubmitted: true, submittedAt: Date.now() }
    setSession(updated)
    saveToStorage(SESSION_KEY, updated)

    return { score, correct, total: totalChoice }
  }, [session])

  /** 清除會話 */
  const clearSession = useCallback(() => {
    setSession(null)
    if (typeof window !== "undefined") {
      try { localStorage.removeItem(SESSION_KEY) } catch { /* silent */ }
    }
  }, [])

  return {
    session,
    restoreSession,
    createSession,
    selectOption,
    toggleBookmark,
    submitExam,
    clearSession,
  }
}

/* ════════════════════════════════════
   useExamTemplates — 管理模板
   ════════════════════════════════════ */
export function useExamTemplates() {
  const [templates, setTemplates] = useState<Record<string, import("./exam-types").ExamTemplate>>(() => loadTemplates())

  const saveTemplate = useCallback((name: string, settings: ExamSettings) => {
    const template: import("./exam-types").ExamTemplate = {
      id: `tpl_${Date.now()}`,
      name,
      createdAt: Date.now(),
      settings,
    }
    setTemplates(prev => {
      const next = { ...prev, [template.id]: template }
      saveTemplates(next)
      return next
    })
  }, [])

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => {
      const next = { ...prev }
      delete next[id]
      saveTemplates(next)
      return next
    })
  }, [])

  return { templates, saveTemplate, deleteTemplate }
}
