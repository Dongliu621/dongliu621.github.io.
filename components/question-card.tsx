"use client"

import { useState, useRef } from "react"
import {
  ChevronDown,
  ChevronUp,
  Star,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Image,
  Bookmark,
  BookmarkCheck,
} from "lucide-react"
import type { Question } from "@/lib/questions-data"

interface QuestionCardProps {
  question: Question
  onToggleMistake?: (question: Question) => void
  isMistake?: boolean
}

export function QuestionCard({ question, onToggleMistake, isMistake = false }: QuestionCardProps) {
  const [showSolution, setShowSolution] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0 })
  const [glowOpacity, setGlowOpacity] = useState(0)

  // 聚光燈效果 — 追蹤滑鼠位置
  const handleBtnMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div className="group relative rounded-2xl bg-white/60 dark:bg-[rgba(28,28,30,0.6)] backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/[0.08] shadow-lg shadow-black/[0.03] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/[0.06]">
      {/* 題目資訊列 */}
      <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#007AFF]/8 to-transparent border-b border-black/4 dark:border-white/[0.06]">
        {/* 年份標籤 */}
        <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#007AFF]/10 text-[#007AFF]">
          {question.year}年
        </span>

        {/* 題型 */}
        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
          question.type === 'choice'
            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-600/10'
            : 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 ring-1 ring-violet-600/10'
        }`}>
          {question.type === 'choice' ? '選擇題' : '解答題'}
        </span>

        {/* 題號 */}
        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
          第{question.part === 1 ? '一部' : '二部'} · 第{question.questionNumber}題
        </span>

        {/* 分值（解答題） */}
        {question.score && (
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            {question.score}分
          </span>
        )}

        {/* 錯題庫切換按鈕 — Neon + Pulse 效果 */}
        <div className="flex items-center gap-2 ml-auto">
          {onToggleMistake && (
            isMistake ? (
              /* ── 已收藏：實心填滿 + 霓虹脈動發光（點擊可取消）─ */
              <button
                ref={btnRef}
                onClick={() => onToggleMistake(question)}
                className="neon-active relative flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 border-2 border-rose-400/80 px-3 py-1.5 text-xs font-bold text-white transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer"
              >
                <BookmarkCheck className="size-3.5 fill-white" />
                已收藏
              </button>
            ) : (
              /* ── 未加入：Neon 霓虹發光（NeonButton 風格 + 聚光燈）─ */
              <button
                ref={btnRef}
                onClick={() => onToggleMistake(question)}
                onMouseMove={handleBtnMove}
                onMouseEnter={() => setGlowOpacity(1)}
                onMouseLeave={() => setGlowOpacity(0)}
                className="group relative overflow-hidden rounded-xl bg-orange-50/90 border border-orange-200/50 px-3 py-1.5 text-xs font-medium text-orange-600 transition-all duration-200 hover:border-orange-400/70 hover:bg-orange-100/80 hover:shadow-[0_0_16px_-3px_rgba(251,146,60,0.6)] active:scale-95"
              >
                {/* 聚光燈追蹤層 */}
                <div
                  className="pointer-events-none absolute -inset-px transition-opacity duration-300"
                  style={{
                    opacity: glowOpacity,
                    background: `radial-gradient(120px circle at ${spotlight.x}px ${spotlight.y}px, rgba(251,146,60,0.25), transparent 55%)`,
                  }}
                />
                {/* 掃光層 */}
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-700 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                  <div className="relative h-full w-6 bg-white/30" />
                </div>
                <span className="relative z-10 flex items-center gap-1.5">
                  <Bookmark className="size-3.5 group-hover:animate-pulse" />
                  加入錯題本
                </span>
              </button>
            )
          )}

          {/* 難度星級 */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`size-3 ${
                  star <= question.difficulty
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-neutral-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 題目內容 */}
      <div className="px-6 py-5">
        {/* 知識點標籤 */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {question.topic.map((t) => (
            <span
              key={t}
              className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-neutral-100/80 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 transition-colors hover:bg-neutral-200/80 dark:hover:bg-white/[0.1]"
            >
              {t}
            </span>
          ))}
        </div>

        {/* 題目文字 */}
        <p className="text-[15px] leading-relaxed text-neutral-800 dark:text-white whitespace-pre-line font-normal">
          {question.questionText}
        </p>

        {/* 選擇題選項 — 不預亮答案，統一樣式 */}
        {question.type === 'choice' && question.options && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
            {question.options.map((opt, idx) => {
              const label = String.fromCharCode(65 + idx)
              return (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50/60 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100/70 dark:hover:bg-white/[0.08] transition-colors cursor-default"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full grid place-items-center text-[11px] font-bold mt-0.5 bg-neutral-200 dark:bg-white/[0.1] text-neutral-500 dark:text-neutral-400">
                    {label}
                  </span>
                  <span className="pt-0.5">{opt}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 解答區域（可展開） */}
      <div className="border-t border-black/4 dark:border-white/[0.06]">
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="w-full flex items-center justify-between px-6 py-3 text-sm font-medium text-[#007AFF] hover:bg-[#007AFF]/[0.04] transition-colors group/btn"
        >
          <span className="flex items-center gap-1.5">
            <BookOpen className="size-4" />
            {showSolution ? '收起解析' : '查看解析'}
          </span>
          {showSolution ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4 group-hover/btn:translate-y-0.5 transition-transform" />
          )}
        </button>

        {showSolution && (
          <div className="px-6 pb-5 space-y-4">
            {/* 第一層：參考答案 + 基礎解析 */}
            <div className="rounded-xl bg-[#007AFF]/[0.04] p-4 ring-1 ring-[#007AFF]/12">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="size-4 text-[#007AFF]" />
                <p className="text-xs font-semibold uppercase tracking-wider text-[#007AFF]">參考答案</p>
              </div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                {question.answer}
              </p>
              <div className="mt-3 pt-3 border-t border-[#007AFF]/12">
                <p className="text-xs font-medium text-[#007AFF] mb-1.5">基礎解法</p>
                <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-line">
                  {question.solution}
                </p>
              </div>
            </div>

            {/* 第二層：AI 詳細解法（如果有的話） */}
            {question.aiAnalysis && (
              <>
                <div className="rounded-xl bg-gradient-to-br from-violet-50/[0.5] dark:from-violet-900/20 to-indigo-50/[0.5] dark:to-indigo-900/20 p-4 ring-1 ring-violet-200/60 dark:ring-violet-500/20">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lightbulb className="size-4 text-violet-600 dark:text-violet-400" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">AI 詳細分步解法</p>
                  </div>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-line">
                    {question.aiAnalysis.detailedSolution || '暫無 AI 解析'}
                  </p>

                  {/* 圖像輔助 */}
                  {question.aiAnalysis.visualAid && (
                    <div className="mt-3 pt-3 border-t border-violet-200/40 dark:border-violet-500/20">
                      <p className="text-xs font-medium text-violet-500 mb-1.5 flex items-center gap-1">
                        <Image className="size-3.5" /> 圖像輔助理解
                      </p>
                      <pre className="text-xs text-neutral-700 dark:text-neutral-300 bg-white/60 dark:bg-black/30 rounded-lg p-3 overflow-x-auto leading-normal font-mono whitespace-pre-wrap">
                        {question.aiAnalysis.visualAid}
                      </pre>
                    </div>
                  )}
                </div>

                {/* 第三層：考點提取 */}
                <div className="rounded-xl bg-amber-50/[0.4] dark:bg-amber-900/20 p-4 ring-1 ring-amber-200/50 dark:ring-amber-500/20">
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="size-4 text-amber-600 dark:text-amber-400" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">考點提取</p>
                  </div>
                  <ul className="space-y-1.5">
                    {question.aiAnalysis.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-200">
                        <span className="size-1.5 mt-1.5 shrink-0 rounded-full bg-amber-400" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 第四層：難度分析與易錯點 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-xl bg-rose-50/[0.35] dark:bg-rose-900/20 p-4 ring-1 ring-rose-200/50 dark:ring-rose-500/20">
                    <div className="flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="size-4 text-rose-600 dark:text-rose-400" />
                      <p className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">難點分析</p>
                    </div>
                    <p className="text-sm text-rose-800 dark:text-rose-200 leading-relaxed">
                      {question.aiAnalysis.difficultyAnalysis}
                    </p>
                  </div>
                  <div className="rounded-xl bg-orange-50/[0.35] dark:bg-orange-900/20 p-4 ring-1 ring-orange-200/50 dark:ring-orange-500/20">
                    <div className="flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="size-4 text-orange-600 dark:text-orange-400" />
                      <p className="text-xs font-semibold uppercase tracking-wider text-orange-700 dark:text-orange-400">注意事項</p>
                    </div>
                    <p className="text-sm text-orange-800 dark:text-orange-200 leading-relaxed">
                      {question.aiAnalysis.commonMistakes}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* 如果沒有 AI 解析的提示 */}
            {!question.aiAnalysis && (
              <div className="text-center py-3 text-xs text-neutral-400 dark:text-neutral-500 italic">
                本題尚未生成 AI 增強解析
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
