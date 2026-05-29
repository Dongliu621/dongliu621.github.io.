'use client';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [account, setAccount] = useState('puiva');
  const [password, setPassword] = useState('1234');
  const [message, setMessage] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 核心粒子引擎逻辑
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    let animationFrameId: number;

    // 设置画布全屏
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 鼠标交互位置
    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 150 // 鼠标吸引/连线的半径
    };

    window.addEventListener('mousemove', (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // 粒子类
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 1; // 粒子大小
        this.speedX = (Math.random() - 0.5) * 1.5; // 飘动速度
        this.speedY = (Math.random() - 0.5) * 1.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // 碰到边缘反弹
        if (this.x > canvas!.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas!.height || this.y < 0) this.speedY = -this.speedY;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(26, 115, 232, 0.2)'; // 极简的淡蓝色粒子
        ctx.fill();
      }
    }

    // 初始化粒子群
    const init = () => {
      particlesArray = [];
      const numberOfParticles = (canvas.width * canvas.height) / 9000; // 根据屏幕大小决定粒子密度
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    // 动画循环与连线逻辑
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        // 粒子与粒子之间的连线
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(26, 115, 232, ${0.1 - distance / 1000})`; // 距离越近线越清晰
            ctx.lineWidth = 0.5;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }

        // 鼠标与粒子的动态互动 (磁吸连线)
        if (mouse.x && mouse.y) {
          const dxMouse = particlesArray[i].x - mouse.x;
          const dyMouse = particlesArray[i].y - mouse.y;
          const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distanceMouse < mouse.radius) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(26, 115, 232, ${0.3 - distanceMouse / 500})`; // 鼠标连线更明显一点
            ctx.lineWidth = 1;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            
            // 可选：让粒子轻微向鼠标靠拢（引力效果）
            // particlesArray[i].x -= dxMouse * 0.01;
            // particlesArray[i].y -= dyMouse * 0.01;
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    // 清理事件监听
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (account === 'puiva' && password === '1234') {
      setMessage('🎉 登录成功，欢迎回来！');
    } else {
      setMessage('账号或密码错误，请重试。');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center overflow-hidden" style={{ fontFamily: "'Google Sans Flex', sans-serif" }}>
      
      {/* 粒子动画背景层，放置在最底层 (z-0) */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 pointer-events-none" 
      />

      {/* 核心 UI 层，悬浮在粒子之上 (z-10) */}
      <main className="relative z-10 w-full max-w-sm px-6 text-center flex flex-col items-center bg-white/60 backdrop-blur-2xl py-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80">
        
        <h1 className="text-4xl md:text-5xl font-medium text-[#202124] mb-12 tracking-tight leading-tight">
          今天你准备<br />学习了吗？
        </h1>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div>
            <input
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 transition-all text-lg text-[#202124] placeholder-gray-400"
              placeholder="账号"
            />
          </div>
          
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 transition-all text-lg text-[#202124] placeholder-gray-400"
              placeholder="密码"
            />
          </div>
          
          <button
            type="submit"
            className="mt-4 w-full bg-[#1A73E8] hover:bg-[#1557B0] active:scale-[0.98] text-white font-medium py-3.5 rounded-xl text-lg transition-all shadow-md shadow-[#1A73E8]/20"
          >
            登录
          </button>
        </form>

        <div className="h-6 mt-6">
          {message && (
            <p className={`text-sm font-medium ${message.includes('成功') ? 'text-green-600' : 'text-red-500'}`}>
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}