"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Search,
  SlidersHorizontal,
  BookOpen,
  Grid3X3,
  List,
} from "lucide-react"
import { QuestionCard } from "@/components/question-card"
import {
  allQuestions,
  topics,
  years,
  filterQuestions,
  type Year,
  type Topic,
} from "@/lib/questions-data"
import { useMistakes } from "@/hooks/use-mistakes"

export default function QuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState<Year | "all">("all")
  const [selectedTopic, setSelectedTopic] = useState<Topic | "all">("all")
  const [selectedPart, setSelectedPart] = useState<number | "all">("all")
  const [showFilters, setShowFilters] = useState(true)
  const { toggleMistake, isMistake } = useMistakes()

  const filtered = useMemo(() => {
    return filterQuestions({
      year: selectedYear,
      part: selectedPart,
      topic: selectedTopic,
      search: searchQuery,
    })
  }, [searchQuery, selectedYear, selectedTopic, selectedPart])

  const choiceCount = useMemo(
    () => filterQuestions({ type: "choice", year: selectedYear, topic: selectedTopic }).length,
    [selectedYear, selectedTopic]
  )
  const freeResponseCount = useMemo(
    () => filterQuestions({ type: "free-response", year: selectedYear, topic: selectedTopic }).length,
    [selectedYear, selectedTopic]
  )

  // 統計資訊
  const stats = [
    { label: "全部試題", value: allQuestions.length },
    { label: "選擇題", value: allQuestions.filter(q => q.type === "choice").length },
    { label: "解答題", value: allQuestions.filter(q => q.type === "free-response").length },
    { label: "2024年", value: allQuestions.filter(q => q.year === 2024).length },
    { label: "2025年", value: allQuestions.filter(q => q.year === 2025).length },
  ]

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
          <Link href="/" className="flex items-center gap-3 group">
            <div className="size-8 rounded-xl bg-[#007AFF] grid place-items-center shadow-lg shadow-[#007AFF]/25">
              <span className="text-white font-semibold text-sm">π</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight dark:text-white">數學備考</p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">題庫</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1 text-sm">
            <nav className="flex items-center gap-1">
              {[
                { name: "概覽", href: "/" },
                { name: "題庫", href: "/questions", active: true },
                { name: "錯題本", href: "/mistakes" },
                { name: "模考", href: "/exam" },
                { name: "統計", href: "/stats" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-full transition-colors ${
                    item.active
                      ? "bg-black/[0.06] dark:bg-white/[0.08] text-neutral-900 dark:text-white font-medium"
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
            澳門四校聯考
            <span className="text-[#007AFF]"> 歷屆真題題庫</span>
          </h1>
          <p className="mt-2 text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
            收錄 <strong>2024</strong>、<strong>2025</strong> 年澳門四高校聯合入學考試數學正卷全部真題
            ，包含選擇題與解答題的完整解析。
          </p>
        </section>

        {/* Stats strip */}
        <section className="mb-8 grid grid-cols-3 md:grid-cols-5 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl bg-white/60 dark:bg-[rgba(28,28,30,0.6)] backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/[0.08] shadow-lg shadow-black/[0.03] px-4 py-3 text-center"
            >
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{s.label}</p>
              <p className="mt-0.5 text-xl font-bold tabular-nums text-neutral-900 dark:text-white">
                {s.value}
              </p>
            </div>
          ))}
        </section>

        {/* 搜索栏 */}
        <section className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-neutral-400" />
            <input
              type="text"
              placeholder="搜尋題目內容或知識點..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/60 dark:bg-[rgba(28,28,30,0.6)] backdrop-blur-xl ring-1 ring-black/6 dark:ring-white/[0.08] outline-none placeholder:text-neutral-400 text-neutral-800 dark:text-white transition-all focus:ring-[#007AFF]/40 focus:bg-white/80 dark:focus:bg-[rgba(28,28,30,0.8)] shadow-sm"
            />
          </div>
        </section>

        {/* Filter bar */}
        <section className="mb-8 space-y-4">
          {/* Filter toggle (mobile) */}
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
                      ? "bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/25"
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
              {(["all", 1, 2] as const).map((p) => (
                <button
                  key={String(p)}
                  onClick={() => setSelectedPart(p)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedPart === p
                      ? "bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/25"
                      : "bg-white/60 dark:bg-[rgba(28,28,30,0.5)] text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-[rgba(28,28,30,0.7)] ring-1 ring-black/5 dark:ring-white/[0.06]"
                  }`}
                >
                  {p === "all" ? "全部" : p === 1 ? "第一部 選擇題" : "第二部 解答題"}
                </button>
              ))}
            </div>

            {/* 知识点筛选 */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mr-1">知識點：</span>
              {(["all", ...topics] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTopic(t)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedTopic === t
                      ? "bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/25"
                      : "bg-white/60 dark:bg-[rgba(28,28,30,0.5)] text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-[rgba(28,28,30,0.7)] ring-1 ring-black/5 dark:ring-white/[0.06]"
                  }`}
                >
                  {t === "all" ? "全部" : t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Results header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            找到{" "}
            <span className="font-semibold tabular-nums text-neutral-900 dark:text-white">{filtered.length}</span>{" "}
            道試題
            {selectedYear !== "all" && (
              <>
                {" "}·{" "}
                <span className="font-medium text-[#007AFF]">
                  {selectedYear}年
                </span>
              </>
            )}
          </p>
          <div className="flex items-center gap-3 text-xs text-neutral-400 dark:text-neutral-500">
            <span className="flex items-center gap-1">
              <Grid3X3 className="size-3.5" />
              選擇题 {filtered.filter((q) => q.type === "choice").length}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="size-3.5" />
              解答題 {filtered.filter((q) => q.type === "free-response").length}
            </span>
          </div>
        </div>

        {/* Question list */}
        <div className="space-y-5">
          {filtered.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onToggleMistake={() => toggleMistake(question)}
              isMistake={isMistake(question.id)}
            />
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="size-14 mx-auto text-neutral-200 dark:text-neutral-600 mb-4" />
              <p className="text-lg font-medium text-neutral-500 dark:text-neutral-400">未找到匹配的試題</p>
              <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">請嘗試調整篩選條件或搜尋關鍵詞</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-12 text-center text-xs text-neutral-400 dark:text-neutral-500">
          數據來源：澳門四高校聯合入學考試官方試卷 · 共 {allQuestions.length} 道真題
        </p>
      </div>
    </main>
  )
}
