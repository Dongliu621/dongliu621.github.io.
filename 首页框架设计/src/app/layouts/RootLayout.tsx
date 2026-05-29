import { Outlet } from 'react-router';
import { ParticleBackground } from '../components/ParticleBackground';
import { Navbar } from '../components/Navbar';

export function RootLayout() {
  return (
    <div className="relative min-h-screen bg-[#F8F9FA] overflow-x-hidden font-sans" style={{ fontFamily: "'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      {/* 粒子动画背景层，放置在最底层 (z-0) */}
      <ParticleBackground />

      {/* 顶部导航栏 */}
      <Navbar />

      {/* 核心页面内容层，悬浮在粒子之上 */}
      <main className="relative z-10 w-full min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
