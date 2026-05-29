"use client"

import { motion } from "framer-motion"

/* ════════════════════════════════════
   路由转场动画模板
   
   template.tsx 在每次路由切换时重新挂载，
   天然适合做入场动画，无需 AnimatePresence
   也能保持流畅丝滑。
   
   - 进入：从右侧平滑滑入 + 淡入 + 微放大
   ════════════════════════════════════ */

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 26,
        mass: 0.8,
      }}
    >
      {children}
    </motion.div>
  )
}
