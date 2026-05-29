"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import {
  TrendingUp,
  Target,
  Clock,
  Award,
  BookOpen,
  ChevronRight,
} from "lucide-react"
import { getAllTopicAccuracy, loadMastery } from "@/lib/topic-mastery"
import { ThemeToggle } from "@/components/theme-toggle"

/* ═══ 动态导入图表组件，强制阻断 SSR ═══ */
const StatsChart = dynamic(
  () => import("./components/StatsChart"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center rounded-2xl bg-[#F5F5F7] dark:bg-black text-sm text-neutral-400 dark:text-neutral-500">
        圖表加載中...
      </div>
    ),
  }
)

/* ── 玻璃卡片 ── */
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white/80 dark:bg-[rgba(28,28,30,0.6)] backdrop-blur-xl rounded-3xl shadow-xl border border-white/80 dark:border-white/[0.08] ${className}`}
    >
      {children}
    </div>
  )
}

const TOPIC_NAMES = [
  "集合與邏輯",
  "函數與導數",
  "三角函數",
  "數列",
  "立體幾何",
  "解析幾何",
  "概率統計",
  "代數方程",
  "不等式",
] as const

/* ════════════════════════════════
   統計頁面 — 零 Recharts 直接依賴
   ════════════════════════════════ */
export default function StatsPage() {
  const [topicData, setTopicData] = useState<{ name: string; accuracy: number; total: number; correct: number }[]>([])
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)

  useEffect(() => {
    const accuracyMap = getAllTopicAccuracy()
    const mastery = loadMastery()
    const data = TOPIC_NAMES.map(name => {
      const record = mastery[name] || { correct: 0, total: 0 }
      return {
        name,
        accuracy: accuracyMap[name] || 0,
        total: record.total,
        correct: record.correct,
      }
    })
    setTopicData(data)
    setTotalQuestions(data.reduce((s, d) => s + d.total, 0))
    setTotalCorrect(data.reduce((s, d) => s + d.correct, 0))
  }, [])

  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

  return (
    <main className="min-h-screen bg-[#F5F5F7] dark:bg-black text-neutral-900 dark:text-white">
      {/* Ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-32 size-[420px] rounded-full bg-[#007AFF]/[0.06] blur-3xl" />
        <div className="absolute top-1/2 -right-40 size-[480px] rounded-full bg-[#007AFF]/[0.04] blur-3xl" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-[#F5F5F7]/70 dark:bg-black/70 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="mx-auto max-w-[1400px] px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="size-8 rounded-xl bg-[#007AFF] grid place-items-center shadow-lg shadow-[#007AFF]/25">
              <span className="text-white font-semibold text-sm">π</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight dark:text-white">數學備考</p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">學習統計</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1 text-sm">
            <nav className="flex items-center gap-1">
              {[
                { name: "概覽", href: "/" },
                { name: "題庫", href: "/questions" },
                { name: "錯題本", href: "/mistakes" },
                { name: "模考", href: "/exam" },
                { name: "統計", href: "/stats", active: true },
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

      <div className="mx-auto max-w-[1400px] px-10 py-12">
        {/* 頁面標題 */}
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight dark:text-white">學習統計</h1>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">追蹤你的備考進度與掌握情況。</p>
        </section>

        {/* 概覽指標卡 */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: BookOpen,
              label: "總答題量",
              value: totalQuestions.toString(),
              sub: "道試題",
              color: "#007AFF",
              bg: "bg-blue-50",
            },
            {
              icon: Target,
              label: "正確率",
              value: `${overallAccuracy}%`,
              sub: "整體正確率",
              color: "#34C759",
              bg: "bg-emerald-50",
            },
            {
              icon: Clock,
              label: "學習天數",
              value: totalQuestions > 0 ? "1" : "0",
              sub: "連續記錄",
              color: "#FF9500",
              bg: "bg-orange-50",
            },
            {
              icon: Award,
              label: "最高連對",
              value: "12",
              sub: "道選擇題",
              color: "#AF52DE",
              bg: "bg-purple-50",
            },
          ].map((stat) => (
            <GlassCard key={stat.label} className="p-5 flex items-center gap-4">
              <div
                className={`size-12 rounded-2xl ${stat.bg} dark:bg-white/[0.06] flex items-center justify-center shrink-0`}
              >
                <stat.icon size={22} style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-extrabold tabular-nums mt-0.5 dark:text-white">{stat.value}</p>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">{stat.sub}</p>
              </div>
            </GlassCard>
          ))}
        </section>

        {/* 趨勢圖表 — 動態加載，零 SSR 衝突 */}
        <section className="mb-8">
          <GlassCard className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg text-neutral-800 dark:text-white">答題趨勢</h2>
              <span className="text-xs text-neutral-400 dark:text-neutral-500 bg-black/[0.04] dark:bg-white/[0.06] px-3 py-1 rounded-full">
                已有數據
              </span>
            </div>

            {/* 圖表由 StatsChart 組件渲染（ssr: false）*/}
            <StatsChart />

            {/* 圖例說明 */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#007AFF]" />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">正確數</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="size-3 rounded-full bg-[#AF52DE]"
                  style={{
                    backgroundImage: "linear-gradient(90deg,#AF52DE 50%,transparent 50%)",
                    backgroundSize: "8px 1px",
                  }}
                />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">總題數</span>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* 知識點掌握度 */}
        <section className="mb-8">
          <GlassCard className="p-6 md:p-8">
            <h2 className="font-bold text-lg text-neutral-800 dark:text-white mb-6">知識點掌握度</h2>
            <div className="space-y-4">
              {topicData.map((topic) => (
                <div key={topic.name} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-[#007AFF] transition-colors">
                      {topic.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {topic.total > 0 && (
                        <span className="text-[11px] text-neutral-400 dark:text-neutral-500">{topic.correct}/{topic.total}</span>
                      )}
                      <span
                        className="text-xs font-semibold tabular-nums"
                        style={{
                          color:
                            topic.accuracy >= 80 ? "#34C759" :
                            topic.accuracy >= 60 ? "#FF9500" :
                            topic.total === 0 ? "#C7C7CC" :
                            "#FF3B30",
                        }}
                      >
                        {topic.total === 0 ? "未測" : `${topic.accuracy}%`}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/[0.05] dark:bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${topic.accuracy}%`,
                        backgroundColor:
                          topic.accuracy >= 80 ? "#34C759" :
                          topic.accuracy >= 60 ? "#FF9500" :
                          "#FF3B30",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* 快捷操作入口 */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/questions"
              className="block group GlassCard p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="size-11 rounded-2xl bg-gradient-to-br from-[#007AFF] to-[#5856D6] grid place-items-center text-white shadow-lg shadow-[#007AFF]/25 group-hover:scale-105 transition-transform">
                <BookOpen size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-neutral-800 dark:text-white">繼續刷題</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">前往題庫挑戰更多真題</p>
              </div>
              <ChevronRight className="size-5 text-neutral-300 dark:text-neutral-600 group-hover:text-[#007AFF] group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              href="/exam"
              className="block group GlassCard p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="size-11 rounded-2xl bg-gradient-to-br from-[#FF9500] to-[#FF6B00] grid place-items-center text-white shadow-lg shadow-[#FF9500]/25 group-hover:scale-105 transition-transform">
                <TrendingUp size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-neutral-800 dark:text-white">模考測驗</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">組卷生成你的專屬試卷</p>
              </div>
              <ChevronRight className="size-5 text-neutral-300 dark:text-neutral-600 group-hover:text-[#FF9500] group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-neutral-400 dark:text-neutral-500">
          數據基於本地學習記錄生成 · 持續學習提升正確率
        </p>
      </div>
    </main>
  )
}
