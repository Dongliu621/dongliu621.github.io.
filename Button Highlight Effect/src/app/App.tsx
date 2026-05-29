import React from 'react';
import { motion } from 'motion/react';
import { 
  SpotlightButton, 
  ShinyButton, 
  NeonButton, 
  BorderGlowButton, 
  PulseButton, 
  AnimatedPressButton 
} from './components/ButtonEffects';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 p-8 md:p-16 text-neutral-200 font-sans selection:bg-blue-500/30">
      <div className="mx-auto max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-500">
            按钮高亮效果展示
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            一系列基于 Tailwind CSS 和 Framer Motion 构建的现代按钮交互与高亮效果，专为增强用户体验而设计。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Spotlight Effect */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="group flex flex-col items-center justify-center rounded-3xl border border-neutral-800/50 bg-neutral-900/20 p-12 backdrop-blur-sm transition-all hover:bg-neutral-900/40 hover:border-neutral-700/50"
          >
            <div className="mb-8 text-center">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">聚光灯效果</h3>
              <p className="text-sm text-neutral-500">光标追踪径向渐变</p>
            </div>
            <SpotlightButton>
              探索功能
            </SpotlightButton>
          </motion.div>

          {/* Shiny Sweep Effect */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="group flex flex-col items-center justify-center rounded-3xl border border-neutral-800/50 bg-neutral-900/20 p-12 backdrop-blur-sm transition-all hover:bg-neutral-900/40 hover:border-neutral-700/50"
          >
            <div className="mb-8 text-center">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">反光扫光效果</h3>
              <p className="text-sm text-neutral-500">悬停时一抹亮光划过</p>
            </div>
            <ShinyButton>
              升级高级版
            </ShinyButton>
          </motion.div>

          {/* Neon Glow Effect */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="group flex flex-col items-center justify-center rounded-3xl border border-neutral-800/50 bg-neutral-900/20 p-12 backdrop-blur-sm transition-all hover:bg-neutral-900/40 hover:border-neutral-700/50"
          >
            <div className="mb-8 text-center">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">霓虹发光效果</h3>
              <p className="text-sm text-neutral-500">阴影与描边带来赛博质感</p>
            </div>
            <NeonButton>
              启动引擎
            </NeonButton>
          </motion.div>

          {/* Border Glow Effect */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="group flex flex-col items-center justify-center rounded-3xl border border-neutral-800/50 bg-neutral-900/20 p-12 backdrop-blur-sm transition-all hover:bg-neutral-900/40 hover:border-neutral-700/50"
          >
            <div className="mb-8 text-center">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">流光边框效果</h3>
              <p className="text-sm text-neutral-500">旋转渐变边框聚焦视线</p>
            </div>
            <BorderGlowButton>
              同步数据
            </BorderGlowButton>
          </motion.div>

          {/* Pulse Effect */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="group flex flex-col items-center justify-center rounded-3xl border border-neutral-800/50 bg-neutral-900/20 p-12 backdrop-blur-sm transition-all hover:bg-neutral-900/40 hover:border-neutral-700/50"
          >
            <div className="mb-8 text-center">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">呼吸脉冲效果</h3>
              <p className="text-sm text-neutral-500">常态动效吸引持续关注</p>
            </div>
            <PulseButton>
              系统正常
            </PulseButton>
          </motion.div>

          {/* Spring Press Effect */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="group flex flex-col items-center justify-center rounded-3xl border border-neutral-800/50 bg-neutral-900/20 p-12 backdrop-blur-sm transition-all hover:bg-neutral-900/40 hover:border-neutral-700/50"
          >
            <div className="mb-8 text-center">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">弹性点击效果</h3>
              <p className="text-sm text-neutral-500">流畅缩放带来真实反馈</p>
            </div>
            <AnimatedPressButton>
              立即购买
            </AnimatedPressButton>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center text-sm text-neutral-600 flex items-center justify-center gap-2"
        >
          <span>使用 Tailwind CSS v4 与 Motion 构建</span>
          <span>·</span>
          <span>鼠标悬停查看效果</span>
        </motion.div>
      </div>
    </div>
  );
}
