"use client"

import { useState, useEffect, useCallback } from "react"
import type { Question } from "@/lib/questions-data"

export interface MistakeEntry {
  question: Question
  addedAt: number // timestamp
}

const STORAGE_KEY = "threeLiu4_mistakes"

function loadMistakes(): MistakeEntry[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveMistakes(mistakes: MistakeEntry[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mistakes))
  } catch {
    // silently fail
  }
}

export function useMistakes() {
  const [mistakes, setMistakes] = useState<MistakeEntry[]>(() => loadMistakes())

  useEffect(() => {
    saveMistakes(mistakes)
  }, [mistakes])

  const toggleMistake = useCallback(
    (question: Question) => {
      setMistakes((prev) => {
        const exists = prev.some((m) => m.question.id === question.id)
        if (exists) {
          // 已存在 → 移除（取消錯題）
          return prev.filter((m) => m.question.id !== question.id)
        } else {
          // 不存在 → 添加
          const entry: MistakeEntry = { question, addedAt: Date.now() }
          return [entry, ...prev]
        }
      })
    },
    []
  )

  const addMistake = useCallback(
    (question: Question) => {
      setMistakes((prev) => {
        // 避免重複添加同一道題
        const exists = prev.some((m) => m.question.id === question.id)
        if (exists) return prev
        const entry: MistakeEntry = { question, addedAt: Date.now() }
        return [entry, ...prev] // 最新的排在前面
      })
    },
    []
  )

  const removeMistake = useCallback((questionId: string) => {
    setMistakes((prev) => prev.filter((m) => m.question.id !== questionId))
  }, [])

  const clearAll = useCallback(() => {
    setMistakes([])
  }, [])

  const isMistake = useCallback(
    (questionId: string) => mistakes.some((m) => m.question.id === questionId),
    [mistakes]
  )

  return {
    mistakes,
    toggleMistake,
    addMistake,
    removeMistake,
    clearAll,
    isMistake,
    totalCount: mistakes.length,
  }
}
