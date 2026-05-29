import { KnowledgeRadar } from "@/components/knowledge-radar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Play,
  BookOpen,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const navItems = [
  { name: "概覽", href: "/", active: true },
  { name: "題庫", href: "/questions" },
  { name: "錯題本", href: "/mistakes" },
  { name: "模考", href: "/exam" },
  { name: "統計", href: "/stats" },
]

/* 毛玻璃卡片 */
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white/60 dark:bg-[rgba(28,28,30,0.6)] backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 dark:border-white/[0.08] ${className}`}
    >
      {children}
    </div>
  )
}

export default function DashboardPage() {
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
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">澳門四校聯考</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1 text-sm">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
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

          <div className="flex items-center gap-2">
            <button
              aria-label="搜尋"
              className="size-9 rounded-full grid place-items-center text-neutral-500 hover:bg-black/[0.04] hover:text-neutral-900 transition-colors"
            >
              <Play className="size-[18px] rotate-[-90deg]" />
            </button>
            <div
              aria-label="用戶頭像"
              className="size-9 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-500 ring-2 ring-white shadow-sm"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-[1280px] px-8 py-12">

        {/* ════════════════════════════════════
            主組合區 — 全寬，突破容器限制
           ════════════════════════════════════ */}
      </div>

      <GlassCard className="mx-auto max-w-[100vw] overflow-hidden bg-gradient-to-br from-[#007AFF]/[0.07] via-[#5856D6]/[0.05] to-[#F5F5F7]/80 dark:to-[rgba(28,28,30,0.6)] border-[#007AFF]/[0.12] dark:border-white/[0.06] rounded-none lg:rounded-t-3xl relative">
        {/* 右側山姆大叔圖片 — 大尺寸視覺衝擊 */}
        <div className="absolute right-[-4%] top-[-4%] bottom-[-4%] w-[55%] md:w-[48%] lg:w-[42%] pointer-events-none overflow-hidden">
          <img
            src="/uncle-sam.png"
            alt=""
            className="w-full h-full object-scale-down object-[85%_auto] object-right-bottom animate-in fade-in slide-in-from-right duration-700"
            style={{
              filter: 'drop-shadow(0 8px 32px rgba(26,115,232,0.18)) drop-shadow(0 16px_48px rgba(88,86,214,0.12))',
              transform: 'scale(1.08)',
            }}
          />
        </div>

        {/* 左側內容區 — 帶右側留白避免被圖片覆蓋 */}
        <div className="relative z-10 mx-auto max-w-[900px] p-8 md:p-12 lg:p-16 pb-6 md:pb-8">
            {/* 主標題 — 超大 + 優化字體 */}
            <h1 className="text-6xl md:text-8xl lg:text-[5rem] xl:text-[5.5rem] font-extrabold tracking-tight leading-[1.05] mb-4">
              <span className="text-[#202124] dark:text-white">今天你準備</span><br />
              <span className="bg-gradient-to-r from-[#007AFF] via-[#5856D6] to-[#AF52DE] bg-clip-text text-transparent">
                學習了嗎？
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 dark:text-neutral-500 font-light max-w-xl">
              歡迎回來。這裡是你今天的數學備考之旅。
            </p>

            {/* 三個數據指標 — 緊湊排列在標題下方 */}
            <div className="mt-8 flex flex-wrap items-stretch gap-4 md:gap-6">
              {[
                {
                  icon: BookOpen,
                  iconBg: "bg-blue-100",
                  iconColor: "text-[#1A73E8]",
                  label: "試題總數",
                  value: "40",
                  unit: "道真題",
                  accent: "#1A73E8",
                },
                {
                  icon: Sparkles,
                  iconBg: "bg-emerald-100",
                  iconColor: "text-emerald-600",
                  label: "知識覆蓋",
                  value: "9",
                  unit: "大類別",
                  accent: "#059669",
                },
                {
                  icon: Clock,
                  iconBg: "bg-amber-100",
                  iconColor: "text-amber-600",
                  label: "更新時間",
                  value: "2025",
                  unit: "年試卷",
                  accent: "#D97706",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3.5 px-5 py-4 rounded-2xl bg-white/70 dark:bg-[rgba(28,28,30,0.5)] backdrop-blur-sm border border-white dark:border-white/[0.08] shadow-sm min-w-[160px]"
                >
                  <div className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center ${stat.iconColor} shrink-0`}>
                    <stat.icon className="w-5.5 h-5.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">{stat.label}</p>
                    <p className="text-xl md:text-2xl font-bold tabular-nums mt-0.5" style={{ color: stat.accent }}>
                      {stat.value}
                      <span className="text-sm font-normal text-neutral-400 dark:text-neutral-500 ml-1">{stat.unit}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 分隔線 + 每日一言 */}
          <div className="px-8 md:px-10 lg:px-12">
            <div className="border-t border-[#007AFF]/[0.12] pt-6 pb-8 md:pb-10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A73E8]/15 to-[#AF52DE]/15 border border-[#1A73E8]/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#1A73E8]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1A73E8] mb-1.5">每日一言</h3>
                <p className="text-base text-[#202124] dark:text-white italic leading-relaxed">
                  &ldquo;學習從來無捷徑，循序漸進登高峰。&rdquo;
                </p>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 not-italic mt-1 inline-block">— 不要停下探索的腳步。</span>
              </div>
            </div>
          </div>
        </GlassCard>

      {/* Content — 後續內容 */}
      <div className="mx-auto max-w-[1280px] px-8">
        {/* 開始學習入口卡片 — 全寬展示 */}
        <section className="mb-12">
          <Link href="/questions" className="block group">
            <GlassCard className="p-8 md:p-10 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)]">
              {/* 裝飾背景 */}
              <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 opacity-60 blur-2xl" />

              <div className="relative flex flex-col md:flex-row gap-8 items-center">
                {/* 左側：播放圖標 */}
                <div className="w-28 h-28 md:w-32 md:h-32 shrink-0 bg-gradient-to-br from-[#1A73E8] to-[#6FA8F5] rounded-2xl grid place-items-center text-white shadow-lg shadow-[#1A73E8]/25 group-hover:scale-105 transition-transform duration-300">
                  <Play className="w-14 h-14 fill-current" />
                </div>

                {/* 中間：內容 */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex px-3 py-1.5 rounded-lg bg-[#1A73E8]/10 text-[#1A73E8] text-sm font-bold">
                      歷屆真題
                    </span>
                    <span className="text-sm text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" /> 2024-2025
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#202124] dark:text-white mb-2">
                    澳門四校聯考數學正卷
                  </h2>
                  <p className="text-neutral-500 dark:text-neutral-400 text-base leading-relaxed max-w-2xl">
                    收錄 2024 年與 2025 年澳門四高校聯合入學考試數學正卷全部真題，
                    包含第一部選擇題與第二部解答題的完整解析與 AI 詳解。
                  </p>
                </div>

                {/* 右側：箭頭指示 */}
                <div className="hidden md:flex flex-col items-end gap-1 shrink-0 self-center">
                  <span className="text-sm font-semibold text-[#1A73E8] group-hover:gap-2 transition-all flex items-center">
                    進入題庫 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-xs text-neutral-400">點擊開始刷題</span>
                </div>
              </div>
            </GlassCard>
          </Link>
        </section>

        {/* 知識點掌握度雷達（全零初始狀態） */}
        <section id="radar" className="mt-8">
          <KnowledgeRadar />
        </section>

        {/* Footer */}
        <p className="mt-12 text-center text-xs text-neutral-400">
          數據來源：澳門四高校聯合入學考試官方試卷 · 共 40 道真題
        </p>
      </div>
    </main>
  )
}
