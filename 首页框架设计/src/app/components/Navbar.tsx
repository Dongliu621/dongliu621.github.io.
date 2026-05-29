import { NavLink } from 'react-router';
import { Bell, Search, Menu, User } from 'lucide-react';
import { GlassCard } from './GlassCard';

export function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 px-6 py-4">
      <GlassCard className="px-6 py-3 flex items-center justify-between rounded-full">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-[#1A73E8] font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-[#1A73E8] flex items-center justify-center text-white">
              S
            </div>
            <span>StudySpace</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${isActive ? 'text-[#1A73E8]' : 'text-gray-600 hover:text-[#1A73E8]'}`
              }
            >
              首页
            </NavLink>
            <NavLink 
              to="/courses" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${isActive ? 'text-[#1A73E8]' : 'text-gray-600 hover:text-[#1A73E8]'}`
              }
            >
              课程
            </NavLink>
            <NavLink 
              to="/tasks" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${isActive ? 'text-[#1A73E8]' : 'text-gray-600 hover:text-[#1A73E8]'}`
              }
            >
              任务
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-white/50 border border-white/80 px-4 py-2 rounded-full shadow-inner">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="搜索内容..." 
              className="bg-transparent border-none outline-none text-sm w-48 text-[#202124] placeholder-gray-400"
            />
          </div>

          <button className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-gray-600 hover:text-[#1A73E8] hover:bg-white transition-all">
            <Bell className="w-5 h-5" />
          </button>
          
          <button className="w-10 h-10 rounded-full bg-[#1A73E8]/10 text-[#1A73E8] flex items-center justify-center font-medium overflow-hidden border border-[#1A73E8]/20 transition-all hover:bg-[#1A73E8]/20">
            <User className="w-5 h-5" />
          </button>
          
          <button className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
