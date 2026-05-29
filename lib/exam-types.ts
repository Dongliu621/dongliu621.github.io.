// ════════════════════════════════════
// 模考系統 — 類型定義
// ════════════════════════════════════

/** 出題模式 */
export type ExamMode = 'simulate' | 'custom'

/** 題型（簡化為兩種） */
export type QuestionTypeConfig = {
  choice: number    // 選擇題數量
  freeResponse: number  // 解答題數量
}

/** 試卷設置 */
export interface ExamSettings {
  mode: ExamMode
  questionTypes: QuestionTypeConfig
  /** 知識點選擇（僅 custom 模式可用）*/
  selectedTopics: string[]
  /** 時間限制（分鐘），0 = 不限 */
  timeLimit: number
}

/** 已保存的模版 */
export interface ExamTemplate {
  id: string
  name: string
  createdAt: number
  settings: ExamSettings
}

/** 用戶在答題頁的作答記錄 */
export type UserAnswer = {
  questionId: string
  selectedOption?: number | null   // 選擇題：選中的選項索引（null=未答）
  isBookmarked: boolean             // 是否收藏
}

/** 答題狀態 */
export interface ExamSession {
  id: string
  settings: ExamSettings
  questions: import('./questions-data').Question[]
  answers: Record<string, UserAnswer>
  startedAt: number
  submittedAt?: number
  isSubmitted: boolean
  timeLimit: number // 秒數
}

/** 四校模擬模式的固定配置（15道選擇 + 5道解答）*/
export const SIMULATE_DEFAULTS: ExamSettings = {
  mode: 'simulate',
  questionTypes: { choice: 15, freeResponse: 5 },
  selectedTopics: [],
  timeLimit: 120,
}

/** 測試模式默認配置 */
export const CUSTOM_DEFAULTS: ExamSettings = {
  mode: 'custom',
  questionTypes: { choice: 5, freeResponse: 2 },
  selectedTopics: [],
  timeLimit: 60,
}

/** localStorage 存儲鍵（與 use-exam.ts 統一）*/
export const TEMPLATES_STORAGE_KEY = 'threeLiu4_exam_templates'

/** 模版操作工具函數 */
export function loadTemplates(): ExamTemplate[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(TEMPLATES_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveTemplates(templates: ExamTemplate[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates))
}

export function addTemplate(name: string, settings: ExamSettings): ExamTemplate {
  const templates = loadTemplates()
  const newTemplate: ExamTemplate = {
    id: `tpl_${Date.now()}`,
    name,
    createdAt: Date.now(),
    settings,
  }
  templates.push(newTemplate)
  saveTemplates(templates)
  return newTemplate
}

export function deleteTemplate(id: string): void {
  const templates = loadTemplates().filter(t => t.id !== id)
  saveTemplates(templates)
}
