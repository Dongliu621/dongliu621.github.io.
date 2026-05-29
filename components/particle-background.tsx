"use client"

import { useEffect, useRef, useState } from "react"

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let particlesArray: Particle[] = []
    let animationFrameId: number
    let isDark = document.documentElement.classList.contains("dark")

    // 监听 dark class 变化
    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark")
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 150,
    }

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX
      mouse.y = event.clientY
    }

    const handleMouseOut = () => {
      mouse.x = null
      mouse.y = null
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseout", handleMouseOut)

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.size = Math.random() * 2 + 1
        this.speedX = (Math.random() - 0.5) * 1.5
        this.speedY = (Math.random() - 0.5) * 1.5
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.x > canvas!.width || this.x < 0) this.speedX = -this.speedX
        if (this.y > canvas!.height || this.y < 0) this.speedY = -this.speedY
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)

        if (isDark) {
          // 暗色模式：发光蓝色星尘
          ctx.fillStyle = "rgba(80, 160, 255, 0.5)"
          ctx.shadowColor = "rgba(80, 160, 255, 0.6)"
          ctx.shadowBlur = 6
        } else {
          // 亮色模式：柔和蓝色粒子
          ctx.fillStyle = "rgba(26, 115, 232, 0.2)"
          ctx.shadowColor = "transparent"
          ctx.shadowBlur = 0
        }
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    const init = () => {
      particlesArray = []
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 9000)
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle())
      }
    }

    const animate = () => {
      // 暗色模式填充黑色底色，亮色模式清空透明
      if (isDark) {
        ctx.fillStyle = "#000000"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()

        // 粒子間連線
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x
          const dy = particlesArray[i].y - particlesArray[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            if (isDark) {
              ctx.strokeStyle = `rgba(80, 160, 255, ${0.2 - distance / 600})`
              ctx.lineWidth = 0.6
            } else {
              ctx.strokeStyle = `rgba(26, 115, 232, ${0.1 - distance / 1000})`
              ctx.lineWidth = 0.5
            }
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y)
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y)
            ctx.stroke()
          }
        }

        // 滑鼠與粒子的磁吸連線互動
        if (mouse.x && mouse.y) {
          const dxMouse = particlesArray[i].x - mouse.x
          const dyMouse = particlesArray[i].y - mouse.y
          const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)

          if (distanceMouse < mouse.radius) {
            ctx.beginPath()
            if (isDark) {
              ctx.strokeStyle = `rgba(100, 180, 255, ${0.4 - distanceMouse / 400})`
              ctx.lineWidth = 1.2
            } else {
              ctx.strokeStyle = `rgba(26, 115, 232, ${0.3 - distanceMouse / 500})`
              ctx.lineWidth = 1
            }
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    init()
    animate()

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseout", handleMouseOut)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mounted])

  if (!mounted) {
    return <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none w-full h-full"
    />
  )
}
