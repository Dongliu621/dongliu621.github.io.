"use client"

import { useState, useEffect } from "react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp } from "lucide-react"
import { useTheme } from "next-themes"
import { getAllTopicAccuracy, loadMastery } from "@/lib/topic-mastery"

const ALL_TOPICS = [
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

export function KnowledgeRadar() {
  const [chartData, setChartData] = useState<
    { subject: string; score: number; full: number }[]
  >([])
  const [topicList, setTopicList] = useState<
    { name: string; score: number; total: number; correct: number; trend: string }[]
  >([])

  useEffect(() => {
    const accuracy = getAllTopicAccuracy()
    const mastery = loadMastery()

    const newData = ALL_TOPICS.map((t) => ({
      subject: t,
      score: accuracy[t] ?? 0,
      full: 100,
    }))

    const newTopics = ALL_TOPICS.map((t) => {
      const rec = mastery[t]
      return {
        name: t,
        score: accuracy[t] ?? 0,
        total: rec?.total ?? 0,
        correct: rec?.correct ?? 0,
        trend: rec && rec.total > 0
          ? (accuracy[t] ?? 0) >= 60 ? "+穩" : "↓弱"
          : "--",
      }
    })

    setChartData(newData)
    setTopicList(newTopics)
  }, [])

  const avg = topicList.length > 0
    ? Math.round(topicList.reduce((s, t) => s + t.score, 0) / topicList.length)
    : 0
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <section
      className="
        relative overflow-hidden
        rounded-3xl
        bg-white/60 dark:bg-[rgba(28,28,30,0.6)] backdrop-blur-xl
        ring-1 ring-black/5 dark:ring-white/[0.08]
        shadow-xl shadow-black/[0.04]
        p-8
        flex flex-col
      "
      aria-labelledby="radar-title"
    >
      {/* Header */}
      <header className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
            Knowledge Radar
          </p>
          <h2
            id="radar-title"
            className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-white tracking-tight text-balance"
          >
            知識點掌握度雷達
          </h2>
          <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400 text-pretty">
            基於最近 30 天練習數據生成
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-[#007AFF]/10 px-3 py-1.5">
          <TrendingUp className="size-3.5 text-[#007AFF]" aria-hidden="true" />
          <span className="text-xs font-medium text-[#007AFF] tabular-nums">
            综合 {avg}%
          </span>
        </div>
      </header>

      {/* Chart */}
      <div className="relative h-[340px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} outerRadius="78%">
            <defs>
              <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#007AFF" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#007AFF" stopOpacity={0.05} />
              </radialGradient>
            </defs>
            <PolarGrid
              stroke={isDark ? "#444" : "#D2D2D7"}
              strokeDasharray="2 4"
              radialLines={true}
            />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: isDark ? "#e0e0e0" : "#1D1D1F",
                fontSize: 12,
                fontWeight: 500,
              }}
              tickLine={false}
            />
            <Radar
              name="当前"
              dataKey="score"
              stroke="#007AFF"
              strokeWidth={2}
              fill="url(#radarFill)"
              dot={{ r: 3, fill: "#007AFF", stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive={true}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Topic list */}
      <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
        {topicList.map((t) => {
          const up = t.trend.startsWith("+")
          return (
            <li
              key={t.name}
              className="flex items-center justify-between py-1.5 border-b border-black/5 dark:border-white/[0.06] last:border-0"
            >
              <span className="text-sm text-neutral-700 dark:text-neutral-300">{t.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-neutral-900 dark:text-white tabular-nums">
                  {t.score}%
                </span>
                <span
                  className={`text-xs tabular-nums ${
                    up ? "text-[#007AFF]" : "text-neutral-400 dark:text-neutral-500"
                  }`}
                >
                  {t.trend}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
