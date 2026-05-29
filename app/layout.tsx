import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from 'next-themes'
import { ParticleBackground } from '@/components/particle-background'
import { ZenFocusTimer } from '@/components/zen-focus-timer'
import { DynamicIsland } from '@/components/dynamic-island'
import { ExamIslandProvider } from '@/hooks/use-exam-island'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: '數學備考 · Dashboard',
  description: '專為澳門四校聯考數學打造的智能學習台 —— 知識點雷達與歷屆真題題庫',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="bg-[#F5F5F7] dark:bg-[#000000] dark:text-white" suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#F5F5F7] dark:bg-[#000000] text-neutral-900 dark:text-white transition-colors duration-500">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ExamIslandProvider>
            {/* 粒子交互背景 — 最底層 z-0 */}
            <ParticleBackground />
            
            {/* 灵动岛 — 最顶层 z-9999 */}
            <DynamicIsland />
            
            {/* 頁面內容 */}
            {children}
            
            {/* Zen Focus 番茄鐘懸浮球 */}
            <ZenFocusTimer />
          </ExamIslandProvider>
        </ThemeProvider>
        
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
