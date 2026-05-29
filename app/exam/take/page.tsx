"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ChevronLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  ArrowLeft,
  Trophy,
  FileText,
  Send,
} from "lucide-react"
import { useExamSession } from "@/hooks/use-exam"
import { useExamIslandSafe } from "@/hooks/use-exam-island"
import { useMistakes } from "@/hooks/use-mistakes"
import { saveExamResults, getAllTopicAccuracy } from "@/lib/topic-mastery"
import type { Question } from "@/lib/questions-data"
import type { Topic } from "@/lib/questions-data"

/* ── 毛玻璃卡片 ── */
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 ${className}`}>
      {children}
    </div>
  )
}

/* ── 格式化时间 ── */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, "0")}`
}

/* ════════════════════════════════════
   选择题卡片 — 可选择答案，不可查看答案
   ════════════════════════════════════ */
function ChoiceQuestionCard({
  question,
  questionIndex,
  selectedOption,
  isBookmarked,
  isSubmitted,
  onSelect,
  onBookmark,
}: {
  question: Question
  questionIndex: number
  selectedOption: number | null | undefined
  isBookmarked: boolean
  isSubmitted: boolean
  onSelect: (optionIndex: number) => void
  onBookmark: () => void
}) {
  return (
    <div className="relative rounded-2xl bg-white/70 backdrop-blur-xl ring-1 ring-black/5 shadow-lg shadow-black/[0.02] overflow-hidden transition-all duration-300">
      {/* 题目信息列 */}
      <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#007AFF]/[0.06] to-transparent border-b border-black/[0.04]">
        <span className="text-xs font-bold tabular-nums text-[#007AFF] bg-[#007AFF]/[0.08] px-2.5 py-1 rounded-md">
          第 {questionIndex + 1} 题
        </span>
        <span className="text-xs text-neutral-400">{question.year}年 · 选择题</span>
        <div className="ml-auto flex items-center gap-2">
          {question.topic.map((t) => (
            <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100/80 text-neutral-500">{t}</span>
          ))}
        </div>
      </div>

      {/* 题目正文 */}
      <div className="px-6 py-5">
        <p className="text-[15px] leading-relaxed text-neutral-800 whitespace-pre-wrap">{question.questionText}</p>

        {/* 选项 */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {question.options!.map((opt, optIdx) => {
            const isSelected = selectedOption === optIdx
            const isCorrect = question.answer.trim()[0].toUpperCase() === String.fromCharCode(65 + optIdx)

            let optionStyle = "bg-white/60 text-neutral-700 border border-black/[0.06] hover:border-[#007AFF]/30 hover:text-[#007AFF] hover:bg-[#007AFF]/[0.04] active:scale-[0.98]"

            if (isSubmitted) {
              if (isCorrect) {
                optionStyle = "bg-emerald-50 border border-emerald-300 text-emerald-800"
              } else if (isSelected && !isCorrect) {
                optionStyle = "bg-red-50 border border-red-300 text-red-700"
              } else {
                optionStyle = "bg-white/40 text-neutral-400 border border-black/[0.04]"
              }
            } else if (isSelected) {
              optionStyle = "ring-2 ring-[#007AFF]/40 bg-[#007AFF]/[0.08] border border-[#007AFF]/30 text-[#007AFF]"
            }

            return (
              <button
                key={optIdx}
                onClick={() => !isSubmitted && onSelect(optIdx)}
                disabled={isSubmitted}
                className={`flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm transition-all cursor-pointer ${optionStyle}`}
              >
                <span
                  className={`shrink-0 w-6 h-6 rounded-full grid place-items-center text-xs font-bold mt-0.5 ${
                    isSubmitted && isCorrect
                      ? "bg-emerald-500 text-white"
                      : isSubmitted && isSelected && !isCorrect
                        ? "bg-red-500 text-white"
                        : isSelected
                          ? "bg-[#007AFF] text-white"
                          : "bg-neutral-200 text-neutral-500"
                  }`}
                >
                  {isSubmitted && isCorrect ? "✓" : isSubmitted && isSelected && !isCorrect ? "✕" : String.fromCharCode(65 + optIdx)}
                </span>
                <span className="pt-0.5 text-left">{opt}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="flex items-center justify-between px-6 py-2.5 border-t border-black/[0.04]">
        {isSubmitted && (
          <span className="text-xs text-neutral-400">
            正确答案：{question.answer.trim()[0]}
          </span>
        )}
        {!isSubmitted && <span />}
        <button
          onClick={onBookmark}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            isBookmarked
              ? "bg-red-50 text-red-500"
              : "text-neutral-400 hover:text-[#007AFF] hover:bg-[#007AFF]/[0.05]"
          }`}
        >
          {isBookmarked ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}
          {isBookmarked ? "已收藏" : "收藏"}
        </button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════
   解答题卡片 — 只显示题目
   ════════════════════════════════════ */
function FreeResponseCard({
  question,
  questionIndex,
  isBookmarked,
  onBookmark,
}: {
  question: Question
  questionIndex: number
  isBookmarked: boolean
  onBookmark: () => void
}) {
  return (
    <div className="relative rounded-2xl bg-white/70 backdrop-blur-xl ring-1 ring-black/5 shadow-lg shadow-black/[0.02] overflow-hidden transition-all duration-300">
      {/* 题目信息列 */}
      <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-500/[0.06] to-transparent border-b border-black/[0.04]">
        <span className="text-xs font-bold tabular-nums text-violet-600 bg-violet-500/[0.08] px-2.5 py-1 rounded-md">
          第 {questionIndex + 1} 题
        </span>
        <span className="text-xs text-neutral-400">{question.year}年 · 解答题</span>
        {question.score && (
          <span className="text-xs text-neutral-400">({question.score}分)</span>
        )}
        <div className="ml-auto flex items-center gap-2">
          {question.topic.map((t) => (
            <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100/80 text-neutral-500">{t}</span>
          ))}
        </div>
      </div>

      {/* 题目正文 */}
      <div className="px-6 py-5">
        <p className="text-[15px] leading-relaxed text-neutral-800 whitespace-pre-wrap">{question.questionText}</p>
      </div>

      {/* 底部操作栏 */}
      <div className="flex items-center justify-end px-6 py-2.5 border-t border-black/[0.04]">
        <button
          onClick={onBookmark}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            isBookmarked
              ? "bg-red-50 text-red-500"
              : "text-neutral-400 hover:text-[#007AFF] hover:bg-[#007AFF]/[0.05]"
          }`}
        >
          {isBookmarked ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}
          {isBookmarked ? "已收藏" : "收藏"}
        </button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════
   答题页面主组件
   ════════════════════════════════════ */
export default function ExamTakePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#F5F5F7] text-neutral-900 flex items-center justify-center">
        <div className="text-sm text-neutral-400">加載中...</div>
      </main>
    }>
      <ExamTakeContent />
    </Suspense>
  )
}

function ExamTakeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session")

  const {
    session,
    restoreSession,
    selectOption,
    toggleBookmark,
    submitExam,
    clearSession,
  } = useExamSession()

  const { addMistake, removeMistake } = useMistakes()
  const island = useExamIslandSafe()

  const [result, setResult] = useState<{ score: number; correct: number; total: number } | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [restored, setRestored] = useState(false)

  /* 从 localStorage 恢复 session */
  useEffect(() => {
    if (sessionId && !session && !restored) {
      const s = restoreSession(sessionId)
      if (s) {
        if (s.isSubmitted) {
          // 已交卷则直接计算分数
          let correct = 0
          let totalChoice = 0
          s.questions.forEach(q => {
            if (q.type !== "choice") return
            totalChoice++
            const ans = s.answers[q.id]
            if (ans?.selectedOption !== null && ans?.selectedOption !== undefined && ans.selectedOption >= 0) {
              const correctLetter = q.answer.trim()[0].toUpperCase()
              const selectedLetter = String.fromCharCode(65 + ans.selectedOption!)
              if (selectedLetter === correctLetter) correct++
            }
          })
          setResult({
            score: totalChoice > 0 ? Math.round((correct / totalChoice) * 100) : 0,
            correct,
            total: totalChoice,
          })
        }
      }
      setRestored(true)
    }
  }, [sessionId, session, restored, restoreSession])

  /* 初始化计时 */
  useEffect(() => {
    if (session && !session.isSubmitted && session.timeLimit > 0 && timeLeft === 0) {
      const elapsed = Math.floor((Date.now() - session.startedAt) / 1000)
      const remaining = Math.max(0, session.timeLimit - elapsed)
      setTimeLeft(remaining)
      if (remaining > 0) setIsTimerRunning(true)
    }
  }, [session, timeLeft])

  /* 计时器 */
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsTimerRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isTimerRunning, timeLeft])

  /* 时间到自动交卷 */
  useEffect(() => {
    if (timeLeft === 0 && isTimerRunning && session && !session.isSubmitted) {
      // 自动交卷不需要确认
      const r = submitExam()
      if (r) {
        setResult(r)
        setIsTimerRunning(false)
        island?.markSubmitted()
        saveExamResults(
          session.questions.map(q => ({
            id: q.id,
            type: q.type,
            topic: q.topic,
            answer: q.answer,
          })),
          session.answers,
        )
      }
    }
  }, [timeLeft, isTimerRunning])

  /* 收藏 — 同步到错题本 */
  const handleBookmark = (questionId: string) => {
    if (!session) return
    const current = session.answers[questionId]
    const wasBookmarked = current?.isBookmarked ?? false
    toggleBookmark(questionId)
    const question = session.questions.find(q => q.id === questionId)
    if (question) {
      if (wasBookmarked) {
        removeMistake(questionId)
      } else {
        addMistake(question)
      }
    }
  }

  const handleSubmit = () => {
    if (!session || session.isSubmitted) return
    if (!confirm("確定要交卷嗎？交卷後將無法修改答案。")) return
    const r = submitExam()
    if (r) {
      setResult(r)
      setIsTimerRunning(false)
      island?.markSubmitted()
      // 保存答题结果到知识点掌握度
      saveExamResults(
        session.questions.map(q => ({
          id: q.id,
          type: q.type,
          topic: q.topic,
          answer: q.answer,
        })),
        session.answers,
      )
    }
  }

  const handleReturn = () => {
    if (session && !session.isSubmitted && !confirm("尚未交卷，確定返回設置頁面嗎？")) return
    clearSession()
    island?.stopExam()
    router.push("/exam")
  }

  /* ── 尚未开始状态 ── */
  if (!session) {
    return (
      <main className="min-h-screen bg-[#F5F5F7] text-neutral-900 flex items-center justify-center">
        <GlassCard className="p-12 text-center max-w-md">
          <AlertTriangle className="size-12 text-[#FF9500] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-neutral-800 mb-2">未找到答題會話</h2>
          <p className="text-sm text-neutral-500">請先在組卷頁面生成試卷，再進入答題。</p>
          <Link
            href="/exam"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-[#007AFF] text-white font-semibold hover:bg-[#0066E0] transition-colors cursor-pointer"
          >
            <RotateCcw className="size-4" />
            返回組卷
          </Link>
        </GlassCard>
      </main>
    )
  }

  const choiceQuestions = session.questions.filter((q) => q.type === "choice")
  const frQuestions = session.questions.filter((q) => q.type === "free-response")
  const totalQuestions = session.questions.length
  const answeredCount = choiceQuestions.filter((q) => {
    const a = session.answers[q.id]
    return a?.selectedOption !== null && a?.selectedOption !== undefined && a.selectedOption >= 0
  }).length

  /* ── 已交卷：成绩展示 ── */
  if (session.isSubmitted && result) {
    const percentage = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0

    return (
      <main className="min-h-screen bg-[#F5F5F7] text-neutral-900 py-10 px-4">
        <div className="mx-auto max-w-[900px]">
          {/* 成绩卡片 */}
          <GlassCard className="p-10 text-center mb-8">
            {/* 成绩图标 */}
            <div className="mb-6">
              {percentage >= 80 ? (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 grid place-items-center mx-auto mb-3 shadow-lg shadow-emerald-500/25">
                  <Trophy className="size-12 text-white" />
                </div>
              ) : percentage >= 60 ? (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 grid place-items-center mx-auto mb-3 shadow-lg shadow-blue-500/25">
                  <CheckCircle2 className="size-10 text-white" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 grid place-items-center mx-auto mb-3 shadow-lg shadow-orange-500/25">
                  <AlertTriangle className="size-10 text-white" />
                </div>
              )}
              <h2 className={`text-2xl font-bold ${
                percentage >= 80 ? "text-emerald-600" : percentage >= 60 ? "text-blue-600" : "text-orange-600"
              }`}>
                {percentage >= 80 ? "表現優秀！" : percentage >= 60 ? "做得不錯！" : "繼續努力！"}
              </h2>
            </div>

            {/* 分数明细 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl bg-black/[0.03] p-4 text-center">
                <p className="text-xs text-neutral-400 mb-1">你的分數</p>
                <p className="text-3xl font-extrabold tabular-nums">{result.score}<span className="text-base font-normal text-neutral-400 ml-1">分</span></p>
              </div>
              <div className="rounded-xl bg-black/[0.03] p-4 text-center">
                <p className="text-xs text-neutral-400 mb-1">答對題數</p>
                <p className="text-3xl font-extrabold tabular-nums">{result.correct}<span className="text-base font-normal text-neutral-400 ml-1">/{result.total}</span></p>
              </div>
              <div className="rounded-xl bg-black/[0.03] p-4 text-center">
                <p className="text-xs text-neutral-400 mb-1">正確率</p>
                <p className="text-3xl font-extrabold tabular-nums">{percentage}<span className="text-base font-normal text-neutral-400 ml-1">%</span></p>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 justify-center">
              <Link
                href="/exam"
                onClick={() => { clearSession(); island?.stopExam() }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF]/[0.04] font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-4" /> 返回組卷
              </Link>
              <button
                onClick={() => { clearSession(); island?.stopExam(); router.push("/exam") }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#007AFF] text-white font-semibold hover:bg-[#0066E0] transition-colors cursor-pointer"
              >
                <RotateCcw className="size-4" /> 再來一次
              </button>
            </div>
          </GlassCard>

          {/* 题目回顾 */}
          <GlassCard className="p-6">
            <h3 className="font-bold text-lg text-neutral-800 mb-4">答題回顧</h3>
            <div className="space-y-4">
              {choiceQuestions.map((q, i) => {
                const ans = session.answers[q.id]
                const isCorrect = (() => {
                  const correctLetter = q.answer.trim()[0].toUpperCase()
                  const selectedLetter = ans?.selectedOption !== undefined && ans?.selectedOption !== null ? String.fromCharCode(65 + ans.selectedOption!) : ""
                  return selectedLetter === correctLetter
                })()

                return (
                  <div
                    key={q.id}
                    className={`rounded-xl p-4 transition-colors ${
                      isCorrect
                        ? "bg-emerald-50/50 border border-emerald-200/50"
                        : "bg-red-50/50 border border-red-200/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isCorrect ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                      }`}>
                        {isCorrect ? "✓" : "✕"}
                      </span>
                      <span className="text-sm font-semibold text-neutral-700">第 {i + 1} 题</span>
                      <span className="text-xs text-neutral-400 ml-auto">
                        {isCorrect ? "正確" : `你的答案：${ans?.selectedOption !== null && ans?.selectedOption !== undefined ? String.fromCharCode(65 + ans.selectedOption!) : "未答"} · 正確答案：${q.answer.trim()[0]}`}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 line-clamp-2 pl-9">{q.questionText}</p>
                  </div>
                )
              })}
            </div>

            {frQuestions.length > 0 && (
              <>
                <h3 className="font-bold text-lg text-neutral-800 mt-8 mb-4">解答題</h3>
                <div className="space-y-3">
                  {frQuestions.map((q, i) => (
                    <div key={q.id} className="rounded-xl p-4 bg-violet-50/30 border border-violet-200/30">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="size-4 text-violet-500" />
                        <span className="text-sm font-semibold text-neutral-700">第 {i + 1} 题 ({q.score}分)</span>
                      </div>
                      <p className="text-sm text-neutral-600 line-clamp-2 pl-7">{q.questionText}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </GlassCard>
        </div>
      </main>
    )
  }

  /* ── 答题中状态 ── */
  return (
    <main className="min-h-screen bg-[#F5F5F7] text-neutral-900">
      {/* 顶部栏 */}
      <header className="sticky top-0 z-20 bg-[#F5F5F7]/70 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="mx-auto max-w-[1280px] px-8 h-14 flex items-center justify-between">
          <button
            onClick={handleReturn}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-[#007AFF] transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4" /> 返回設置
          </button>

          <div className="flex items-center gap-2">
            <Clock className="size-4 text-neutral-400" />
            {session.timeLimit > 0 ? (
              <span className={`text-sm font-semibold tabular-nums ${timeLeft < 300 ? "text-red-500" : ""}`}>
                {formatTime(timeLeft)}
              </span>
            ) : (
              <span className="text-sm font-medium text-neutral-400">不限時</span>
            )}
          </div>

          <div className="text-sm text-neutral-400">
            已答 {answeredCount}/{choiceQuestions.length} 選擇題
          </div>
        </div>
      </header>

      {/* 进度条 */}
      <div className="h-1 bg-black/[0.04]">
        <div
          className="h-full bg-[#007AFF] transition-all duration-500"
          style={{ width: `${choiceQuestions.length > 0 ? (answeredCount / choiceQuestions.length) * 100 : 0}%` }}
        />
      </div>

      {/* 题目列表 */}
      <div className="mx-auto max-w-[1280px] px-8 py-6 space-y-5 pb-28">
        {/* 选择题区 */}
        {choiceQuestions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#007AFF]/[0.08] text-[#007AFF]">
                選擇題
              </span>
              <span className="text-xs text-neutral-400">共 {choiceQuestions.length} 題</span>
            </div>
            <div className="space-y-4">
              {choiceQuestions.map((question, i) => (
                <ChoiceQuestionCard
                  key={question.id}
                  question={question}
                  questionIndex={i}
                  selectedOption={session.answers[question.id]?.selectedOption}
                  isBookmarked={session.answers[question.id]?.isBookmarked ?? false}
                  isSubmitted={session.isSubmitted}
                  onSelect={(optIdx) => selectOption(question.id, optIdx)}
                  onBookmark={() => handleBookmark(question.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 解答题区 */}
        {frQuestions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4 mt-8">
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-violet-500/[0.08] text-violet-600">
                解答題
              </span>
              <span className="text-xs text-neutral-400">共 {frQuestions.length} 題</span>
            </div>
            <div className="space-y-4">
              {frQuestions.map((question, i) => (
                <FreeResponseCard
                  key={question.id}
                  question={question}
                  questionIndex={i}
                  isBookmarked={session.answers[question.id]?.isBookmarked ?? false}
                  onBookmark={() => handleBookmark(question.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 底部固定操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-black/[0.06] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-30 py-4">
        <div className="mx-auto max-w-[1280px] px-8 flex items-center justify-end gap-4">
          <span className="text-sm text-neutral-400 mr-2">
            {answeredCount}/{choiceQuestions.length} 題已完成
          </span>
          <button
            onClick={handleSubmit}
            disabled={session.isSubmitted}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#007AFF] text-white font-semibold hover:bg-[#0066E0] active:scale-[0.97] shadow-lg shadow-[#007AFF]/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <Send className="size-4" />
            交卷
          </button>
        </div>
      </div>
    </main>
  )
}
