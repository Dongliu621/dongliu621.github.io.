"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Save,
  Play,
  FileText,
  Trash2,
} from "lucide-react"
import { useExamSession, useExamTemplates } from "@/hooks/use-exam"
import { useExamIsland } from "@/hooks/use-exam-island"
import { ThemeToggle } from "@/components/theme-toggle"
import { topics } from "@/lib/questions-data"
import type { ExamMode, ExamSettings } from "@/lib/exam-types"

/* ── 毛玻璃卡片 ── */
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/60 dark:bg-[rgba(28,28,30,0.6)] backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 dark:border-white/[0.08] ${className}`}>
      {children}
    </div>
  )
}

/* ── 數字輸入組件 ── */
function NumberInput({ label, value, onChange, min = 0, max = 99, disabled = false }: {
  label: string
  value: number
  onChange: (val: number) => void
  min?: number
  max?: number
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium whitespace-nowrap w-[100px] text-right">{label}</span>
      <div className={`flex items-center border rounded-lg overflow-hidden h-10 w-[120px] bg-white dark:bg-[rgba(28,28,30,0.6)] ${disabled ? "border-black/[0.04] dark:border-white/[0.06] opacity-50" : "border-black/[0.06] dark:border-white/[0.1]"}`}>
        <input
          type="text" value={value} readOnly
          className="w-full text-center outline-none text-sm text-neutral-800 dark:text-white bg-transparent tabular-nums cursor-default"
        />
        <div className="flex flex-col border-l border-black/[0.06] dark:border-white/[0.1] h-full w-7 bg-white dark:bg-[rgba(28,28,30,0.6)] shrink-0">
          <button
            onClick={() => !disabled && onChange(Math.min(max, value + 1))}
            className={`flex-1 border-b border-black/[0.06] flex items-center justify-center transition-colors p-0 ${disabled ? "cursor-not-allowed" : "hover:bg-black/[0.03] text-neutral-400"}`}
          >
            <ChevronUp size={10} className={disabled ? "text-neutral-300" : "text-neutral-400"} />
          </button>
          <button
            onClick={() => !disabled && onChange(Math.max(min, value - 1))}
            className={`flex-1 flex items-center justify-center cursor-pointer transition-colors p-0 ${disabled ? "cursor-not-allowed" : "hover:bg-black/[0.03] text-neutral-400"}`}
          >
            <ChevronDown size={10} className={disabled ? "text-neutral-300" : "text-neutral-400"} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════
   模考設置頁面
   ════════════════════════════════ */
export default function ExamSetupPage() {
  const router = useRouter()
  const [mode, setMode] = useState<ExamMode>("simulate")
  const [choiceCount, setChoiceCount] = useState(15)
  const [frCount, setFrCount] = useState(5)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [timeLimit, setTimeLimit] = useState(120)
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState("")

  const { createSession } = useExamSession()
  const { templates, saveTemplate, deleteTemplate } = useExamTemplates()
  const { startExam } = useExamIsland()

  // 切換出題模式時重置為對應默認值
  const handleModeChange = (newMode: ExamMode) => {
    setMode(newMode)
    if (newMode === "simulate") {
      setChoiceCount(15)
      setFrCount(5)
      setSelectedTopics([])
      setTimeLimit(120)
    } else {
      setChoiceCount(5)
      setFrCount(2)
      setSelectedTopics([])
      setTimeLimit(60)
    }
  }

  // 知識點切換
  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    )
  }

  // 存為模版
  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) return
    saveTemplate(newTemplateName.trim(), {
      mode,
      questionTypes: { choice: choiceCount, freeResponse: frCount },
      selectedTopics,
      timeLimit,
    })
    setNewTemplateName("")
    setShowTemplatePicker(false)
  }

  // 套用模版
  const loadTemplate = (settings: ExamSettings) => {
    setMode(settings.mode)
    setChoiceCount(settings.questionTypes.choice)
    setFrCount(settings.questionTypes.freeResponse)
    setSelectedTopics(settings.selectedTopics)
    setTimeLimit(settings.timeLimit)
  }

  // 生成試卷
  const handleGenerate = () => {
    const session = createSession({
      mode,
      questionTypes: { choice: choiceCount, freeResponse: frCount },
      selectedTopics,
      timeLimit,
    })
    if (session) {
      // 启动灵动岛倒计时
      if (timeLimit > 0) {
        startExam(session.startedAt, timeLimit * 60)
      }
      router.push(`/exam/take?session=${session.id}`)
    }
  }

  /* 是否可以選擇知識點（僅 custom 模式）*/
  const canSelectTopics = mode === "custom"

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
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">模考系統</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1 text-sm">
            <nav className="flex items-center gap-1">
              {[
                { name: "概覽", href: "/" },
                { name: "題庫", href: "/questions" },
                { name: "錯題本", href: "/mistakes" },
                { name: "模考", href: "/exam", active: true },
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

      <div className="mx-auto max-w-[1200px] px-10 py-16">
        {/* 頁面標題 */}
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight dark:text-white">組卷中心</h1>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">設定出題參數，生成你的專屬試卷。</p>
        </section>

        <GlassCard className="overflow-hidden">
          <div className="p-12 space-y-16 pb-20 relative">
            {/* ═══ Section 01：出題場景 ═══ */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#007AFF]/[0.08] text-[#007AFF] text-xs font-bold">01</span>
                <h2 className="font-bold text-[18px] text-neutral-800 dark:text-white">出題場景</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { value: "simulate" as const, label: "四校模擬", desc: "固定按四校聯考模式隨機出題 (15選+5答)" },
                  { value: "custom" as const, label: "自由測試", desc: "自定題型、知識點與數量" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleModeChange(opt.value)}
                    className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                      mode === opt.value
                        ? "border-[#007AFF] bg-[#007AFF]/[0.05] dark:bg-[#007AFF]/[0.1]"
                        : "border-black/[0.06] dark:border-white/[0.08] hover:border-[#007AFF]/30 hover:bg-[#F8F9FA] dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    <div
                      className={`size-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        mode === opt.value ? "bg-[#007AFF] border-[#007AFF]" : "border-neutral-300 dark:border-neutral-600"
                      }`}
                    >
                      {mode === opt.value && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <circle cx="6" cy="6" r="4" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-left dark:text-white">{opt.label}</p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 text-left mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ═══ Section 02：試題設置 ═══ */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#007AFF]/[0.08] text-[#007AFF] text-xs font-bold">02</span>
                <h2 className="font-bold text-[18px] text-neutral-800 dark:text-white">試題設置</h2>
                <span className="ml-auto text-xs text-neutral-400 dark:text-neutral-500">
                  （{mode === "simulate" ? "四校模擬為固定配置，以下僅供參考" : "自由測試可自由調整"}）
                </span>
              </div>

              <div className="space-y-8 pl-1">
                <NumberInput
                  label="選擇題"
                  value={choiceCount}
                  onChange={setChoiceCount}
                  max={mode === "simulate" ? 15 : 40}
                  disabled={mode === "simulate"}
                />
                <NumberInput
                  label="解答題"
                  value={frCount}
                  onChange={setFrCount}
                  max={mode === "simulate" ? 5 : 20}
                  disabled={mode === "simulate"}
                />

                {/* 知識點 — 僅在 custom 模式可用 */}
                {canSelectTopics && (
                  <div className="flex items-start gap-3">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium w-[84px] text-right pt-1.5">知識點：</span>
                    <div className="flex flex-wrap gap-2">
                      {topics.map((t) => (
                        <button
                          key={t}
                          onClick={() => toggleTopic(t)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            selectedTopics.includes(t)
                              ? "bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/25"
                              : "bg-white/70 dark:bg-[rgba(28,28,30,0.5)] text-neutral-600 dark:text-neutral-300 border border-black/[0.04] dark:border-white/[0.06] hover:border-[#007AFF]/30 hover:text-[#007AFF]"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!canSelectTopics && (
                  <div className="flex items-start gap-3 opacity-50">
                    <span className="text-sm text-neutral-400 font-medium w-[84px] text-right pt-1.5">知識點：</span>
                    <p className="text-sm text-neutral-400 pt-1.5">四校模擬模式下包含全部 9 大類別知識點</p>
                  </div>
                )}
              </div>
            </div>

            {/* ═══ Section 03：時間限制 ═══ */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#007AFF]/[0.08] text-[#007AFF] text-xs font-bold">03</span>
                <h2 className="font-bold text-[18px] text-neutral-800 dark:text-white">時間限制</h2>
              </div>

              <div className="pl-1">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium w-[84px] text-right">時長：</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="range"
                      min={0}
                      max={120}
                      step={5}
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(Number(e.target.value))}
                      className="w-56 h-2.5 accent-[#007AFF]"
                    />
                    <span className="text-sm font-semibold text-[#007AFF] tabular-nums min-w-[3ch]">
                      {timeLimit === 0 ? "不限" : `${timeLimit} 分鐘`}
                    </span>
                  </div>
                </div>

                {/* 快捷時間按鈕 */}
                <div className="flex gap-3 ml-[96px] mt-4">
                  {[0, 30, 60, 90, 120].map((m) => (
                    <button
                      key={m}
                      onClick={() => setTimeLimit(m)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                        timeLimit === m
                          ? "bg-[#007AFF] text-white"
                          : "bg-white/60 dark:bg-[rgba(28,28,30,0.5)] text-neutral-600 dark:text-neutral-300 hover:text-[#007AFF] hover:bg-[#007AFF]/10 border border-black/[0.04] dark:border-white/[0.06]"
                      }`}
                    >
                      {m === 0 ? "不限" : `${m}分`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══ 操作按鈕區域 ═══ */}
            <div className="flex flex-wrap items-center justify-end gap-4 pt-8 mt-4 border-t border-black/[0.06] dark:border-white/[0.08] pb-4">
              {/* 存為模版 + 已保存模板列表 */}
              <div className="relative flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowTemplatePicker(!showTemplatePicker)}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer border shrink-0 ${
                    showTemplatePicker
                      ? "border-[#007AFF] bg-[#007AFF]/[0.07] text-[#007AFF]"
                      : "border-black/[0.08] dark:border-white/[0.1] text-neutral-600 dark:text-neutral-300 hover:text-[#007AFF] hover:bg-[#007AFF]/[0.04]"
                  }`}
                >
                  <Save className="size-4" />
                  {showTemplatePicker ? "關閉" : "存為模版"}
                  <ChevronDown className={`size-3.5 transition-transform ${showTemplatePicker ? "rotate-180" : ""}`} />
                </button>

                {/* 已保存的模板 pills — 始終顯示在按鈕旁邊 */}
                {Object.entries(templates).map(([id, tpl]) => (
                  <button
                    key={id}
                    onClick={() => loadTemplate(tpl.settings)}
                    className="group inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1.5 rounded-lg bg-[#007AFF]/[0.08] hover:bg-[#007AFF]/[0.15] transition-colors cursor-pointer"
                  >
                    <FileText className="size-3.5 text-[#007AFF] shrink-0" />
                    <span className="text-xs font-medium text-[#007AFF] max-w-[80px] truncate">{tpl.name}</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteTemplate(id)
                      }}
                      className="ml-0.5 p-0.5 rounded hover:bg-red-100 text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="size-3" />
                    </span>
                  </button>
                ))}

                {/* 模板下拉面板 — 僅用於輸入名稱保存 */}
                {showTemplatePicker && (
                  <div className="absolute left-0 top-full mt-2 z-50 bg-white dark:bg-[rgba(28,28,30,0.95)] rounded-2xl shadow-2xl border border-black/[0.06] dark:border-white/[0.08] overflow-hidden w-[260px]">
                    <div className="p-4 bg-[#F8F9FA] dark:bg-[rgba(255,255,255,0.04)]">
                      <input
                        value={newTemplateName}
                        onChange={(e) => setNewTemplateName(e.target.value)}
                        placeholder="輸入模版名稱..."
                        className="w-full bg-white dark:bg-[rgba(28,28,30,0.6)] border border-black/[0.06] dark:border-white/[0.1] rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#007AFF]/30 dark:text-white"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={handleSaveTemplate}
                          className="flex-1 py-2 rounded-xl bg-[#007AFF] text-white text-sm font-medium hover:bg-[#006F0D] transition-colors cursor-pointer"
                        >
                          儲存模版
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 生成試卷 */}
                <button
                  onClick={handleGenerate}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#007AFF] text-white font-semibold text-[15px] hover:bg-[#006F0D] active:scale-[0.97] shadow-lg shadow-[#007AFF]/25 transition-all cursor-pointer"
              >
                <Play className="size-4 fill-current" />
                生成試卷
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-neutral-400 dark:text-neutral-500">
          四校模擬模式將按照真實考試規則隨機抽取 15 道選擇題和 5 道解答題
        </p>
      </div>
    </main>
  )
}
