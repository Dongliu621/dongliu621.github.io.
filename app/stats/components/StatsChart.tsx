"use client"

import { useState, useEffect } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { useTheme } from "next-themes"
import { loadDailyHistory, type DailyRecord } from "@/lib/daily-history"
import { loadMastery } from "@/lib/topic-mastery"
import { TrendingUp } from "lucide-react"

/* ── 空狀態佔位 ── */
function EmptyChart() {
  return (
    <div className="w-full h-[400px] flex flex-col items-center justify-center gap-3">
      <div className="size-14 rounded-2xl bg-[#007AFF]/[0.06] grid place-items-center">
        <TrendingUp className="size-6 text-[#007AFF]/40" />
      </div>
      <p className="text-sm text-neutral-400 dark:text-neutral-500">尚無答題記錄</p>
      <p className="text-xs text-neutral-300 dark:text-neutral-600">完成一次模考後，這裡將顯示你的學習趨勢</p>
    </div>
  )
}

/* ═══ 答題趨勢圖表 — 從 localStorage 讀取每日數據 ═══ */
export default function StatsChart() {
  const [data, setData] = useState<DailyRecord[]>([])
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    let daily = loadDailyHistory()

    // 如果沒有每日歷史但有知識點數據（舊數據兼容），生成一個基於今天的虛擬記錄
    if (daily.length === 0) {
      const mastery = loadMastery()
      let totalCorrect = 0
      let totalQuestions = 0
      for (const record of Object.values(mastery)) {
        totalCorrect += record.correct
        totalQuestions += record.total
      }
      if (totalQuestions > 0) {
        daily = [{
          date: new Date().toISOString().slice(0, 10),
          correct: totalCorrect,
          total: totalQuestions,
          accuracy: Math.round((totalCorrect / totalQuestions) * 100),
        }]
      }
    }

    setData(daily)
  }, [])

  if (data.length === 0) return <EmptyChart />

  const chartData = data.map(r => ({
    ...r,
    shortDate: r.date.slice(5).replace("-", "/"),
  }))

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 6"
            stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}
            vertical={false}
          />
          <XAxis
            dataKey="shortDate"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: isDark ? "#888" : "#999" }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: isDark ? "#888" : "#999" }}
            width={36}
          />
          <Tooltip
            contentStyle={{
              background: isDark ? "rgba(28,28,30,0.9)" : "rgba(255,255,255,0.95)",
              border: "none",
              borderRadius: 12,
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              fontSize: 13,
              color: isDark ? "#f0f0f0" : "#1D1D1F",
              padding: "10px 14px",
            }}
            formatter={(value: number, name: string) => {
              if (name === "accuracy") return [`${value}%`, "正確率"]
              if (name === "correct") return [`${value} 題`, "正確數"]
              if (name === "total") return [`${value} 題`, "總題數"]
              return [value, name]
            }}
            labelFormatter={(label: string) => `${label}`}
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#007AFF"
            strokeWidth={3}
            dot={{ r: 4, fill: "#007AFF", strokeWidth: 2, stroke: isDark ? "#1c1c1e" : "#fff" }}
            activeDot={{ r: 6, fill: "#007AFF", stroke: isDark ? "#1c1c1e" : "#fff", strokeWidth: 2 }}
            name="accuracy"
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#AF52DE"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={{ r: 3, fill: "#AF52DE", strokeWidth: 1.5, stroke: isDark ? "#1c1c1e" : "#fff" }}
            activeDot={{ r: 5, fill: "#AF52DE", stroke: isDark ? "#1c1c1e" : "#fff", strokeWidth: 2 }}
            name="total"
          />
          <Line
            type="monotone"
            dataKey="correct"
            stroke="#34C759"
            strokeWidth={2}
            dot={{ r: 3, fill: "#34C759", strokeWidth: 1.5, stroke: isDark ? "#1c1c1e" : "#fff" }}
            activeDot={{ r: 5, fill: "#34C759", stroke: isDark ? "#1c1c1e" : "#fff", strokeWidth: 2 }}
            name="correct"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
