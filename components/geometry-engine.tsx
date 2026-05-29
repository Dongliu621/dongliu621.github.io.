"use client"

import { useMemo, useState } from "react"
import { Play, RotateCcw, Sparkles } from "lucide-react"

type CurveType = "ellipse" | "parabola" | "hyperbola"

const CURVES: { id: CurveType; label: string; formula: string }[] = [
  { id: "ellipse", label: "橢圓", formula: "x²/a² + y²/b² = 1" },
  { id: "parabola", label: "拋物線", formula: "y² = 4px" },
  { id: "hyperbola", label: "雙曲線", formula: "x²/a² − y²/b² = 1" },
]

export function GeometryEngine() {
  const [curve, setCurve] = useState<CurveType>("ellipse")
  const [a, setA] = useState(3)
  const [b, setB] = useState(2)
  const [showFoci, setShowFoci] = useState(true)

  // Build SVG path for current curve in viewBox -10..10 (x), -7..7 (y)
  const path = useMemo(() => {
    const steps = 200
    const pts: [number, number][] = []

    if (curve === "ellipse") {
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2
        pts.push([a * Math.cos(t), b * Math.sin(t)])
      }
    } else if (curve === "parabola") {
      // y^2 = 4 * (a/2) * x  -> using a as focal factor, range y ∈ [-b*2, b*2]
      const p = Math.max(0.3, a / 2)
      for (let i = 0; i <= steps; i++) {
        const y = -b * 2 + (i / steps) * b * 4
        const x = (y * y) / (4 * p) - 3
        pts.push([x, y])
      }
    } else {
      // hyperbola: two branches
      const branchRight: [number, number][] = []
      const branchLeft: [number, number][] = []
      for (let i = 0; i <= steps; i++) {
        const t = -1.3 + (i / steps) * 2.6
        const x = a * Math.cosh(t)
        const y = b * Math.sinh(t)
        branchRight.push([x, y])
        branchLeft.push([-x, y])
      }
      return (
        toPath(branchRight) + " " + toPath(branchLeft)
      )
    }

    return toPath(pts)
  }, [curve, a, b])

  const foci = useMemo(() => {
    if (!showFoci) return []
    if (curve === "ellipse") {
      const c = Math.sqrt(Math.max(0, a * a - b * b))
      return [
        [c, 0],
        [-c, 0],
      ] as [number, number][]
    }
    if (curve === "hyperbola") {
      const c = Math.sqrt(a * a + b * b)
      return [
        [c, 0],
        [-c, 0],
      ] as [number, number][]
    }
    if (curve === "parabola") {
      const p = Math.max(0.3, a / 2)
      return [[p - 3, 0]] as [number, number][]
    }
    return []
  }, [curve, a, b, showFoci])

  const reset = () => {
    setA(3)
    setB(2)
    setShowFoci(true)
  }

  const currentFormula = CURVES.find((c) => c.id === curve)?.formula ?? ""

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
      aria-labelledby="engine-title"
    >
      {/* Header */}
      <header className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
            Geometry Engine
          </p>
          <h2
            id="engine-title"
            className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-white tracking-tight text-balance"
          >
            動態解析幾何引擎
          </h2>
          <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400 text-pretty">
            拖動參數實時觀察曲線形態與焦點位置
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-[#007AFF]/10 px-3 py-1.5">
          <Sparkles className="size-3.5 text-[#007AFF]" aria-hidden="true" />
          <span className="text-xs font-medium text-[#007AFF]">實時渲染</span>
        </div>
      </header>

      {/* Curve selector */}
      <div
        role="tablist"
        aria-label="曲線類型"
        className="inline-flex self-start rounded-full bg-black/[0.04] dark:bg-white/[0.06] p-1 mb-5"
      >
        {CURVES.map((c) => {
          const active = c.id === curve
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={active}
              onClick={() => setCurve(c.id)}
              className={`
                px-4 py-1.5 text-sm font-medium rounded-full transition-all
                ${
                  active
                    ? "bg-white dark:bg-[rgba(255,255,255,0.15)] text-neutral-900 dark:text-white shadow-sm"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                }
              `}
            >
              {c.label}
            </button>
          )
        })}
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl bg-gradient-to-b from-white/80 dark:from-white/[0.06] to-white/40 dark:to-white/[0.02] ring-1 ring-black/5 dark:ring-white/[0.06] p-4">
        <svg
          viewBox="-10 -7 20 14"
          className="w-full h-[280px]"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`${CURVES.find((c) => c.id === curve)?.label} 曲線示意圖`}
        >
          {/* Grid */}
          <g stroke="#E5E5EA" strokeWidth="0.03">
            {Array.from({ length: 21 }, (_, i) => i - 10).map((x) => (
              <line key={`v${x}`} x1={x} y1={-7} x2={x} y2={7} />
            ))}
            {Array.from({ length: 15 }, (_, i) => i - 7).map((y) => (
              <line key={`h${y}`} x1={-10} y1={y} x2={10} y2={y} />
            ))}
          </g>

          {/* Axes */}
          <g stroke="#86868B" strokeWidth="0.06" strokeLinecap="round">
            <line x1={-10} y1={0} x2={10} y2={0} />
            <line x1={0} y1={-7} x2={0} y2={7} />
          </g>

          {/* Curve */}
          <path
            d={path}
            fill="none"
            stroke="#007AFF"
            strokeWidth="0.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="scale(1,-1)"
          />

          {/* Foci */}
          <g transform="scale(1,-1)">
            {foci.map(([fx, fy], i) => (
              <g key={i}>
                <circle cx={fx} cy={fy} r="0.22" fill="#007AFF" />
                <circle
                  cx={fx}
                  cy={fy}
                  r="0.5"
                  fill="none"
                  stroke="#007AFF"
                  strokeOpacity={0.25}
                  strokeWidth="0.06"
                />
              </g>
            ))}
          </g>
        </svg>

        {/* Formula badge */}
        <div className="absolute left-5 top-5 rounded-lg bg-white/80 dark:bg-black/50 backdrop-blur px-2.5 py-1 ring-1 ring-black/5 dark:ring-white/[0.08]">
          <span className="font-mono text-xs text-neutral-700 dark:text-neutral-300">
            {currentFormula}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 space-y-5">
        <Slider
          label={curve === "parabola" ? "焦參數 p" : "長半軸 a"}
          value={a}
          min={1}
          max={6}
          step={0.1}
          onChange={setA}
        />
        <Slider
          label={curve === "parabola" ? "縱向範圍" : "短半軸 b"}
          value={b}
          min={1}
          max={5}
          step={0.1}
          onChange={setB}
        />

        {/* Toggle + actions */}
        <div className="flex items-center justify-between pt-2">
          <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
            <span
              role="switch"
              aria-checked={showFoci}
              tabIndex={0}
              onClick={() => setShowFoci((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault()
                  setShowFoci((v) => !v)
                }
              }}
              className={`
                relative inline-flex h-6 w-10 items-center rounded-full transition-colors
                ${showFoci ? "bg-[#007AFF]" : "bg-black/15"}
              `}
            >
              <span
                className={`
                  inline-block size-5 transform rounded-full bg-white shadow
                  transition-transform
                  ${showFoci ? "translate-x-[18px]" : "translate-x-0.5"}
                `}
              />
            </span>
            <span className="text-sm text-neutral-700 dark:text-neutral-300">顯示焦點</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              onClick={reset}
              className="
                inline-flex items-center gap-1.5
                rounded-full px-4 py-2
                text-sm font-medium text-neutral-700 dark:text-neutral-300
                bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1]
                transition-colors
              "
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              重置
            </button>
            <button
              className="
                inline-flex items-center gap-1.5
                rounded-full px-4 py-2
                text-sm font-medium text-white
                bg-[#007AFF] hover:bg-[#0071EB] active:bg-[#0062CC]
                shadow-lg shadow-[#007AFF]/25
                transition-colors
              "
            >
              <Play className="size-3.5 fill-current" aria-hidden="true" />
              開始解題
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">{label}</span>
        <span className="text-sm font-medium text-neutral-900 dark:text-white tabular-nums">
          {value.toFixed(1)}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.1]">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[#007AFF]"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          aria-label={label}
          className="
            absolute inset-0 w-full h-full opacity-0 cursor-pointer
          "
        />
        <div
          className="
            absolute top-1/2 -translate-y-1/2 -translate-x-1/2
            size-4 rounded-full bg-white
            ring-1 ring-black/10 shadow-md
            pointer-events-none
          "
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function toPath(pts: [number, number][]) {
  if (pts.length === 0) return ""
  return pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(3)} ${y.toFixed(3)}`)
    .join(" ")
}
