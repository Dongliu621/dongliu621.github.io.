// ════════════════════════════════════
// 知識點掌握度 — 存儲與計算
// ════════════════════════════════════

import type { Topic } from './questions-data'
import { recordDailyResult } from './daily-history'

const MASTERY_KEY = 'threeLiu4_topic_mastery'

export interface TopicRecord {
  correct: number
  total: number
}

export type MasteryData = Record<string, TopicRecord>

/** 從 localStorage 讀取掌握度數據 */
export function loadMastery(): MasteryData {
  if (typeof window === 'undefined') return {}
  try {
    const data = localStorage.getItem(MASTERY_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

/** 保存掌握度數據到 localStorage */
export function saveMastery(data: MasteryData): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(MASTERY_KEY, JSON.stringify(data))
  } catch { /* silent */ }
}

/** 更新單個知識點的記錄（累加） */
export function updateTopicMastery(topic: string, correct: number, total: number): void {
  const data = loadMastery()
  const existing = data[topic] || { correct: 0, total: 0 }
  data[topic] = {
    correct: existing.correct + correct,
    total: existing.total + total,
  }
  saveMastery(data)
}

/** 計算某知識點的正確率 */
export function getTopicAccuracy(topic: string): number {
  const data = loadMastery()
  const record = data[topic]
  if (!record || record.total === 0) return 0
  return Math.round((record.correct / record.total) * 100)
}

/** 獲取所有知識點的正確率 */
export function getAllTopicAccuracy(): Record<string, number> {
  const data = loadMastery()
  const result: Record<string, number> = {}
  for (const [topic, record] of Object.entries(data)) {
    result[topic] = record.total > 0 ? Math.round((record.correct / record.total) * 100) : 0
  }
  return result
}

/** 保存一次考試的答題結果到各知識點 */
export function saveExamResults(
  questions: { id: string; type: string; topic: Topic[]; answer: string }[],
  answers: Record<string, { selectedOption?: number | null }>,
): void {
  const topicStats: Record<string, { correct: number; total: number }> = {}

  for (const q of questions) {
    if (q.type !== 'choice') continue // 只統計選擇題
    const ans = answers[q.id]
    const isSelected = ans?.selectedOption !== null && ans?.selectedOption !== undefined && ans.selectedOption >= 0
    const isCorrect = isSelected && (() => {
      const correctLetter = q.answer.trim()[0].toUpperCase()
      const selectedLetter = String.fromCharCode(65 + ans.selectedOption!)
      return selectedLetter === correctLetter
    })()

    for (const t of q.topic) {
      if (!topicStats[t]) topicStats[t] = { correct: 0, total: 0 }
      topicStats[t].total++
      if (isCorrect) topicStats[t].correct++
    }
  }

  // 累加到 localStorage
  for (const [topic, stats] of Object.entries(topicStats)) {
    updateTopicMastery(topic, stats.correct, stats.total)
  }

  // 記錄每日歷史（用於趨勢折線圖）
  const totalCorrect = Object.values(topicStats).reduce((s, v) => s + v.correct, 0)
  const totalQuestions = Object.values(topicStats).reduce((s, v) => s + v.total, 0)
  recordDailyResult(totalCorrect, totalQuestions)
}
