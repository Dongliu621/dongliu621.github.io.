import { GlassCard } from '../components/GlassCard';
import { motion } from 'motion/react';
import { BookOpen, Clock, Trophy, PlayCircle, Star, ArrowRight } from 'lucide-react';

export function Dashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto pt-32 pb-16 px-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="mb-10">
        <h1 className="text-4xl md:text-5xl font-medium text-[#202124] mb-4 tracking-tight leading-tight">
          今天你准备<br />学习了吗？
        </h1>
        <p className="text-lg text-gray-500">欢迎回来，puiva。这里是你今天的学习进度。</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <GlassCard className="p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-[#1A73E8]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">正在学习</p>
            <h3 className="text-2xl font-bold text-[#202124]">4 <span className="text-base font-normal text-gray-500">门课程</span></h3>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">本周时长</p>
            <h3 className="text-2xl font-bold text-[#202124]">12.5 <span className="text-base font-normal text-gray-500">小时</span></h3>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">获得积分</p>
            <h3 className="text-2xl font-bold text-[#202124]">1,250 <span className="text-base font-normal text-gray-500">分</span></h3>
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area - Courses */}
        <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-[#202124]">继续学习</h2>
            <button className="text-[#1A73E8] text-sm font-medium hover:underline flex items-center gap-1">
              查看全部 <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <GlassCard className="p-6 overflow-hidden relative group cursor-pointer transition-transform hover:-translate-y-1">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-48 h-32 bg-gradient-to-br from-[#1A73E8] to-[#6FA8F5] rounded-xl flex items-center justify-center text-white shadow-inner relative overflow-hidden">
                <PlayCircle className="w-12 h-12 opacity-80 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546980129-6d518dbb51b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBhYnN0cmFjdHxlbnwxfHx8fDE3NzY4NjEyODJ8MA&ixlib=rb-4.1.0&q=80&w=1080')] mix-blend-overlay opacity-40 bg-cover bg-center"></div>
              </div>
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-md bg-blue-100 text-[#1A73E8] text-xs font-semibold">进阶课程</span>
                  <span className="text-sm text-gray-500 flex items-center"><Star className="w-3 h-3 text-amber-400 mr-1 fill-amber-400"/> 4.9</span>
                </div>
                <h3 className="text-xl font-bold text-[#202124] mb-2">高级 React 与性能优化</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">深入理解 React 渲染机制，掌握 useCallback, useMemo 等钩子的最佳实践以及并发模式的应用。</p>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div className="bg-[#1A73E8] h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>进度: 65%</span>
                  <span>剩余 2 课时</span>
                </div>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6 overflow-hidden relative group cursor-pointer transition-transform hover:-translate-y-1">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-48 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-inner relative overflow-hidden">
                <PlayCircle className="w-12 h-12 opacity-80 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576400883215-7083980b6193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGdyYXBoaWNzfGVufDF8fHx8MTc3Njg2MTI4NXww&ixlib=rb-4.1.0&q=80&w=1080')] mix-blend-overlay opacity-40 bg-cover bg-center"></div>
              </div>
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-600 text-xs font-semibold">基础课程</span>
                  <span className="text-sm text-gray-500 flex items-center"><Star className="w-3 h-3 text-amber-400 mr-1 fill-amber-400"/> 4.8</span>
                </div>
                <h3 className="text-xl font-bold text-[#202124] mb-2">计算机图形学入门</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">从零开始学习 Canvas API，了解 WebGL 基础以及前端动画的数学原理。</p>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>进度: 30%</span>
                  <span>剩余 5 课时</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Sidebar Area - Daily Tasks */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <h2 className="text-2xl font-medium text-[#202124]">今日任务</h2>
          
          <GlassCard className="p-6">
            <div className="flex flex-col gap-4">
              {[
                { id: 1, title: '完成 React 第一章小测验', time: '10:00 AM', done: true },
                { id: 2, title: '阅读 WebGL 渲染管线文档', time: '14:30 PM', done: false },
                { id: 3, title: '提交动画实验作业', time: '18:00 PM', done: false },
              ].map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/40 transition-colors">
                  <div className={`mt-0.5 w-5 h-5 rounded border flex flex-shrink-0 items-center justify-center transition-colors cursor-pointer ${task.done ? 'bg-[#1A73E8] border-[#1A73E8]' : 'border-gray-300 bg-white'}`}>
                    {task.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${task.done ? 'text-gray-400 line-through' : 'text-[#202124]'}`}>{task.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{task.time}</p>
                  </div>
                </div>
              ))}
              
              <button className="mt-2 w-full py-2.5 rounded-lg border border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:bg-white/50 hover:border-[#1A73E8] hover:text-[#1A73E8] transition-all">
                + 添加新任务
              </button>
            </div>
          </GlassCard>
          
          <GlassCard className="p-6 bg-gradient-to-br from-[#1A73E8]/10 to-transparent border-[#1A73E8]/20">
            <h3 className="font-bold text-[#1A73E8] mb-2 flex items-center gap-2">
              <Star className="w-5 h-5" />
              每日名言
            </h3>
            <p className="text-sm text-[#202124] italic leading-relaxed">
              "学习从来无捷径，循序渐进登高峰。" 
              <br/>— 不要停下探索的脚步。
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
