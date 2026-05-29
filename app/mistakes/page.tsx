"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search,
  SlidersHorizontal,
  BookOpen,
  Grid3X3,
  Trash2,
  AlertCircle,
  Bookmark,
  ArrowRight,
} from "lucide-react"
import { QuestionCard } from "@/components/question-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { allQuestions, topics, years, filterQuestions, type Year, type Topic } from "@/lib/questions-data"
import { useMistakes, type MistakeEntry } from "@/hooks/use-mistakes"

export default function MistakesPage() {
  const { mistakes, removeMistake, clearAll, totalCount } = useMistakes()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState<Year | "all">("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(true)

  // 從錯題中提取唯一試題
  const uniqueMistakeQuestions = useMemo(() => {
    const seen = new Set<string>()
    return mistakes.filter((m) => {
      if (seen.has(m.question.id)) return false
      seen.add(m.question.id)
      return true
    }).map((m) => m.question)
  }, [mistakes])

  // 篩選
  const filtered = useMemo(() => {
    let result = uniqueMistakeQuestions

    if (selectedYear !== "all") {
      result = result.filter((q) => q.year === selectedYear)
    }
    if (selectedType !== "all") {
      result = result.filter((q) => q.type === selectedType)
    }
    if (searchQuery.trim()) {
      const s = searchQuery.toLowerCase()
      result = result.filter(
        (q) =>
          q.questionText.toLowerCase().includes(s) ||
          q.topic.some((t) => t.includes(s))
      )
    }

    return result
  }, [uniqueMistakeQuestions, selectedYear, selectedType, searchQuery])

  // 統計
  const choiceCount = uniqueMistakeQuestions.filter((q) => q.type === "choice").length
  const freeResponseCount = uniqueMistakeQuestions.filter((q) => q.type === "free-response").length

  // 按類型統計（來自原始錯題列表）
  const stats = [
    { label: "全部錯題", value: totalCount },
    { label: "選擇題", value: choiceCount },
    { label: "解答題", value: freeResponseCount },
  ]

  // 檢查某題是否在錯題庫中
  const isInMistakes = (questionId: string) =>
    mistakes.some((m) => m.question.id === questionId)

  // 處擬按鈕：如果沒選题型，按添加時間排序（最新的在前）
  const displayOrder = [...filtered]

  return (
    <main className="min-h-screen bg-[#F5F5F7] dark:bg-black text-neutral-900 dark:text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-32 size-[420px] rounded-full bg-[#007AFF]/[0.06] blur-3xl" />
        <div className="absolute top-1/2 -right-40 size-[480px] rounded-full bg-[#007AFF]/[0.04] blur-3xl" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-[#F5F5F7]/70 dark:bg-black/70 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="mx-auto max-w-[1280px] px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-[#007AFF] grid place-items-center shadow-lg shadow-[#007AFF]/25">
              <span className="text-white font-semibold text-sm">π</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight dark:text-white">數學備考</p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">錯題本</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1 text-sm">
            <nav className="flex items-center gap-1">
              {[
                { name: "概覽", href: "/" },
                { name: "題庫", href: "/questions" },
                { name: "錯題本", href: "/mistakes", active: true },
                { name: "模考", href: "/exam" },
                { name: "統計", href: "/stats" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-full transition-colors ${
                    item.active
                      ? "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-medium ring-1 ring-orange-200/60 dark:ring-orange-700/30"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-8 py-8">
        {/* Page header */}
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            我的{" "}
            <span className="text-orange-500">錯題本</span>
          </h1>
          <p className="mt-2 text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
            收集的錯誤試題將在此處顯示，方便隨時回顧複習。
          </p>
        </section>

        {/* 空狀態提示 */}
        {totalCount === 0 && (
          <section className="text-center py-24">
            <Bookmark className="size-16 mx-auto text-neutral-200 dark:text-neutral-600 mb-4" />
            <h2 className="text-xl font-medium text-neutral-600 dark:text-neutral-300 mb-2">尚未收藏任何錯題</h2>
            <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
              在題庫頁面點擊「加入錯題本」按鈕即可開始收藏
            </p>
            <Link
              href="/questions"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-2xl bg-[#007AFF] text-white font-medium text-sm hover:bg-[#0051D5] transition-colors"
            >
              前往題庫挑選試題
              <ArrowRight className="size-4" />
            </Link>
          </section>
        )}

        {/* Stats strip + 操作 */}
        {totalCount > 0 && (
          <section className="mb-8 flex items-center justify-between gap-4">
            <div className="grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl bg-white/60 dark:bg-[rgba(28,28,30,0.6)] backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/[0.08] shadow-lg shadow-black/[0.03] px-5 py-3 text-center"
                >
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{s.label}</p>
                  <p className="mt-0.5 text-xl font-bold tabular-nums text-neutral-900 dark:text-white">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => clearAll()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="size-4" />
              清空全部
            </button>
          </section>
        )}

        {/* 搜索栏 */}
        <section className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-neutral-400" />
            <input
              type="text"
              placeholder="搜尋錯題內容或知識點..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/60 dark:bg-[rgba(28,28,30,0.6)] backdrop-blur-xl ring-1 ring-black/6 dark:ring-white/[0.08] outline-none placeholder:text-neutral-400 text-neutral-800 dark:text-white transition-all focus:ring-[#007AFF]/40 focus:bg-white/80 dark:focus:bg-[rgba(28,28,30,0.8)] shadow-sm"
            />
          </div>
        </section>

        {/* Filter bar */}
        <section className="mb-8 space-y-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
          >
            <SlidersHorizontal className="size-4" />
            {showFilters ? '收起篩選' : '展開篩選'}
          </button>

          <div className={`space-y-4 ${showFilters ? '' : 'hidden md:block'}`}>
            {/* 年份筛选 */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mr-1">年份：</span>
              {(["all", ...years] as const).map((y) => (
                <button
                  key={String(y)}
                  onClick={() => setSelectedYear(y)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedYear === y
                      ? "bg-orange-500 text-white shadow-md shadow-orange/25"
                      : "bg-white/60 dark:bg-[rgba(28,28,30,0.5)] text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-[rgba(28,28,30,0.7)] ring-1 ring-black/5 dark:ring-white/[0.06]"
                  }`}
                >
                  {y === "all" ? "全部" : `${y} 年`}
                </button>
              ))}
            </div>

            {/* 题型筛选 */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mr-1">題型：</span>
              {([
                { key: "all", label: "全部" },
                { key: "choice", label: "選擇題" },
                { key: "free-response", label: "解答題" },
              ]).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setSelectedType(t.key)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedType === t.key
                      ? "bg-orange-500 text-white shadow-md shadow-orange/25"
                      : "bg-white/60 dark:bg-[rgba(28,28,30,0.5)] text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-[rgba(28,28,30,0.7)] ring-1 ring-black/5 dark:ring-white/[0.06]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Results header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            共{" "}
            <span className="font-semibold tabular-nums text-neutral-900 dark:text-white">{filtered.length}</span>{" "}道錯題
          </p>
          {selectedType !== "all" && (
            <button
              onClick={() => setSelectedType("all")}
              className="text-xs text-[#007AFF] hover:underline"
            >
              顯示全部
            </button>
          )}
        </div>

        {/* Mistake list */}
        <div className="space-y-5">
          {filtered.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onToggleMistake={() => { /* 已在錯題庫中，無操作 */ }}
              isMistake={true}
            />
          ))}

          {filtered.length === 0 && totalCount > 0 && (
            <div className="text-center py-16">
              <AlertCircle className="size-14 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
              <p className="text-lg font-medium text-neutral-400 dark:text-neutral-500">沒有匹配的錯題</p>
              <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">請嘗試調整篩選條件</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-12 text-center text-xs text-neutral-400 dark:text-neutral-500">
          錯題數據存儲於瀏覽器本地 · 共 {totalCount} 道已收藏
        </p>
      </div>
    </main>
  )
}
