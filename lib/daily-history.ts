// ════════════════════════════════════
// 每日答題歷史 — 用於趨勢折線圖
// ════════════════════════════════════

const DAILY_KEY = 'threeLiu4_daily_history'

export interface DailyRecord {
  date: string       // "2026-05-05"
  correct: number
  total: number
  accuracy: number   // 百分比 0-100
}

/** 從 localStorage 讀取每日歷史 */
export function loadDailyHistory(): DailyRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(DAILY_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/** 保存每日歷史 */
export function saveDailyHistory(records: DailyRecord[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify(records))
  } catch { /* silent */ }
}

/** 記錄今天的答題數據（累加到同一天） */
export function recordDailyResult(correct: number, total: number): void {
  if (total <= 0) return
  const today = new Date().toISOString().slice(0, 10) // "2026-05-05"
  const history = loadDailyHistory()
  const existing = history.find(r => r.date === today)

  if (existing) {
    existing.correct += correct
    existing.total += total
    existing.accuracy = Math.round((existing.correct / existing.total) * 100)
  } else {
    history.push({
      date: today,
      correct,
      total,
      accuracy: Math.round((correct / total) * 100),
    })
  }

  // 保留最近 30 天
  const recent = history.slice(-30)
  saveDailyHistory(recent)
}
