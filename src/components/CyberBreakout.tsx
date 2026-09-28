import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Gamepad2,
  Trophy,
  RotateCcw,
  Sparkles,
  Zap,
  Flame,
  Play,
  Pause,
  ArrowRight,
  ShieldCheck,
  MousePointer,
  Heart,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { SERVICES } from '../data/services.ts';

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  points: number;
  serviceTitle: string;
  alive: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
}

export const CyberBreakout: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Game States
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'gameover' | 'victory'>('ready');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [unlockedService, setUnlockedService] = useState<string | null>(null);

  // References for game physics
  const paddleRef = useRef({ x: 200, y: 380, width: 85, height: 10, speed: 7 });
  const ballRef = useRef({ x: 240, y: 360, vx: 3.5, vy: -3.5, radius: 6.5, speed: 4.5 });
  const bricksRef = useRef<Brick[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const inputRef = useRef({ left: false, right: false, mouseX: 0, isMouseActive: false });

  // Palette corresponding to Saad's 6 services in plain English
  const SERVICE_BRICK_COLORS = [
    { title: 'Business Websites (WordPress/Custom)', color: '#00F0FF', points: 150 },
    { title: 'Online Shops (Shopify/Woo)', color: '#FF0055', points: 200 },
    { title: 'Logos, Banners & Graphic Design', color: '#8B5CF6', points: 120 },
    { title: 'Get Found on Google & Marketing', color: '#FFE600', points: 180 },
    { title: 'Fast Hosting & Daily Backups', color: '#10B981', points: 250 },
    { title: 'Custom Web Tools & Calculators', color: '#A855F7', points: 300 },
  ];

  // Initialize Bricks Grid
  const initBricks = useCallback((canvasWidth: number) => {
    const rows = 6;
    const cols = 8;
    const padding = 6;
    const offsetTop = 45;
    const offsetLeft = 20;
    const brickWidth = (canvasWidth - offsetLeft * 2 - (cols - 1) * padding) / cols;
    const brickHeight = 16;

    const bricks: Brick[] = [];
    for (let r = 0; r < rows; r++) {
      const rowInfo = SERVICE_BRICK_COLORS[r % SERVICE_BRICK_COLORS.length];
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: offsetLeft + c * (brickWidth + padding),
          y: offsetTop + r * (brickHeight + padding),
          w: brickWidth,
          h: brickHeight,
          color: rowInfo.color,
          points: rowInfo.points,
          serviceTitle: rowInfo.title,
          alive: true,
        });
      }
    }
    bricksRef.current = bricks;
  }, []);

  // Spawn Particle Explosion on Brick Hit
  const createExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        alpha: 1.0,
        size: 2 + Math.random() * 3,
      });
    }
  };

  // Reset ball & paddle after losing life
  const resetBallAndPaddle = (canvasWidth: number, canvasHeight: number) => {
    paddleRef.current.width = 85;
    paddleRef.current.x = (canvasWidth - paddleRef.current.width) / 2;
    paddleRef.current.y = canvasHeight - 24;

    const angle = (Math.PI / 4) + (Math.random() * Math.PI) / 2; // launch upwards
    const speed = 4.2;
    ballRef.current.x = canvasWidth / 2;
    ballRef.current.y = paddleRef.current.y - 12;
    ballRef.current.vx = (Math.random() < 0.5 ? -1 : 1) * speed * 0.75;
    ballRef.current.vy = -speed;
  };

  const restartGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;

    setScore(0);
    setLives(3);
    setCombo(0);
    setUnlockedService(null);
    initBricks(w);
    resetBallAndPaddle(w, h);
    setGameState('playing');
  };

  // Main Canvas & Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const setupCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      const w = rect?.width || 680;
      const h = 420;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initBricks(w);
      resetBallAndPaddle(w, h);
    };

    setupCanvas();
    window.addEventListener('resize', setupCanvas);

    // Keyboard & Mouse Handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        inputRef.current.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        inputRef.current.right = true;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        if (gameState === 'ready' || gameState === 'gameover' || gameState === 'victory') {
          restartGame();
        } else if (gameState === 'playing') {
          setGameState('paused');
        } else if (gameState === 'paused') {
          setGameState('playing');
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        inputRef.current.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        inputRef.current.right = false;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      inputRef.current.mouseX = e.clientX - rect.left;
      inputRef.current.isMouseActive = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        inputRef.current.mouseX = e.touches[0].clientX - rect.left;
        inputRef.current.isMouseActive = true;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Render loop
    const loop = () => {
      animId = requestAnimationFrame(loop);

      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      // 1. Clear background
      ctx.fillStyle = isDark ? '#060612' : '#f8fafc';
      ctx.fillRect(0, 0, w, h);

      // Subtle Background Grid
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Physics & Logic (only when playing)
      if (gameState === 'playing') {
        const paddle = paddleRef.current;
        const ball = ballRef.current;

        // Move paddle via Mouse / Touch
        if (inputRef.current.isMouseActive) {
          paddle.x = Math.max(8, Math.min(w - paddle.width - 8, inputRef.current.mouseX - paddle.width / 2));
        } else {
          // Keyboard fallback
          if (inputRef.current.left) paddle.x -= paddle.speed;
          if (inputRef.current.right) paddle.x += paddle.speed;
          paddle.x = Math.max(8, Math.min(w - paddle.width - 8, paddle.x));
        }

        // Move Ball
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Ball - Wall Collisions (Left, Right, Top)
        if (ball.x - ball.radius < 8) {
          ball.x = 8 + ball.radius;
          ball.vx *= -1;
        } else if (ball.x + ball.radius > w - 8) {
          ball.x = w - 8 - ball.radius;
          ball.vx *= -1;
        }

        if (ball.y - ball.radius < 8) {
          ball.y = 8 + ball.radius;
          ball.vy *= -1;
        }

        // Ball - Paddle Collision
        if (
          ball.y + ball.radius >= paddle.y &&
          ball.y - ball.radius <= paddle.y + paddle.height &&
          ball.x >= paddle.x &&
          ball.x <= paddle.x + paddle.width &&
          ball.vy > 0
        ) {
          ball.vy *= -1;

          // Dynamic bounce deflection based on where it hit the paddle
          const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
          ball.vx = hitPos * 5.2;

          // Add slight speed increment for exhilarating progression
          const currentSpeed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
          if (currentSpeed < 7.5) {
            ball.vx *= 1.02;
            ball.vy *= 1.02;
          }

          createExplosion(ball.x, paddle.y, '#00F0FF');
        }

        // Ball - Bricks Collisions
        let remainingBricks = 0;
        bricksRef.current.forEach((b) => {
          if (!b.alive) return;
          remainingBricks++;

          if (
            ball.x + ball.radius >= b.x &&
            ball.x - ball.radius <= b.x + b.w &&
            ball.y + ball.radius >= b.y &&
            ball.y - ball.radius <= b.y + b.h
          ) {
            b.alive = false;
            createExplosion(b.x + b.w / 2, b.y + b.h / 2, b.color);
            setUnlockedService(b.serviceTitle);

            // Deflection
            ball.vy *= -1;

            // Score with combo multiplication
            setScore((prev) => {
              const gained = b.points;
              const newTotal = prev + gained;
              setHighScore((h) => Math.max(h, newTotal));
              return newTotal;
            });
            setCombo((c) => c + 1);
          }
        });

        // Check Victory
        if (remainingBricks === 0) {
          setGameState('victory');
        }

        // Ball dropped below bottom
        if (ball.y - ball.radius > h) {
          setCombo(0);
          setLives((prev) => {
            const nextLives = prev - 1;
            if (nextLives <= 0) {
              setGameState('gameover');
            } else {
              resetBallAndPaddle(w, h);
            }
            return nextLives;
          });
        }
      }

      // 3. Render Bricks
      bricksRef.current.forEach((b) => {
        if (!b.alive) return;

        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = isDark ? 8 : 2;

        // Brick rounded rectangle
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, b.h, 4);
        ctx.fill();

        // Subtle specular highlight line
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fillRect(b.x + 2, b.y + 1, b.w - 4, 2);
      });
      ctx.shadowBlur = 0;

      // 4. Render Paddle
      const paddle = paddleRef.current;
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = isDark ? 14 : 4;
      ctx.fillStyle = isDark ? '#ffffff' : '#09090b';

      ctx.beginPath();
      ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 5);
      ctx.fill();

      // Neon cyan border
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 5. Render Ball
      const ball = ballRef.current;
      ctx.shadowColor = '#FF0055';
      ctx.shadowBlur = isDark ? 16 : 6;
      ctx.fillStyle = '#FF0055';

      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();

      // White hot core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 6. Render Particle Explosions
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.alpha -= 0.03;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', setupCanvas);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameState, isDark, initBricks]);

  return (
    <section className={`relative py-20 border-t transition-colors overflow-hidden ${
      isDark ? 'bg-[#05050E] border-white/[0.06]' : 'bg-[#F8FAFC] border-zinc-200'
    }`}>
      {/* Background Volumetric Neon Ambiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[140px] pointer-events-none bg-[#00F0FF]/15" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-80 h-80 rounded-full blur-[130px] pointer-events-none bg-[#FF0055]/10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF] text-[11px] font-mono font-bold tracking-wider mb-2">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>INTERACTIVE SERVICE EXPLORER</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight ${
              isDark ? 'text-white' : 'text-zinc-950'
            }`}>
              PLAY BREAKOUT & DISCOVER WHAT I BUILD
            </h2>
            <p className={`text-xs sm:text-sm font-mono mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Move your mouse or slide your finger to bounce the ball and uncover all 6 ways I can help your business.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-4 bg-black/40 dark:bg-black/60 p-3 rounded-2xl border border-white/10 font-mono">
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 uppercase block leading-none">SCORE</span>
              <span className="text-base sm:text-lg font-black text-emerald-400">{score.toLocaleString()}</span>
            </div>

            <div className="h-6 w-px bg-white/10" />

            <div className="text-right">
              <span className="text-[10px] text-zinc-500 uppercase block leading-none">HIGH</span>
              <span className="text-base sm:text-lg font-black text-[#00F0FF]">{highScore.toLocaleString()}</span>
            </div>

            <div className="h-6 w-px bg-white/10" />

            {/* Lives */}
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 transition-all ${
                    i < lives ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* The Game Canvas Box */}
        <div className={`relative rounded-3xl border overflow-hidden shadow-2xl ${
          isDark ? 'border-white/10 bg-[#060613]' : 'border-zinc-300 bg-white'
        }`}>
          {/* Top Bar HUD */}
          <div className="px-5 py-3 border-b border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-zinc-400">
                {unlockedService ? `UNLOCKED: ${unlockedService}` : 'MOVE PADDLE TO BEGIN'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {combo > 2 && (
                <span className="px-2 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-amber-500" />
                  <span>{combo}X COMBO</span>
                </span>
              )}

              <button
                type="button"
                onClick={restartGame}
                className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
                title="Restart Game"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Canvas Element Container */}
          <div className="relative w-full h-[380px] sm:h-[420px] cursor-crosshair">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Ready / Game Over / Victory Overlay Modals */}
            {gameState !== 'playing' && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
                {gameState === 'ready' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4 max-w-sm"
                  >
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 flex items-center justify-center shadow-lg">
                      <Gamepad2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-display font-black text-2xl text-white">
                      SERVICE BREAKOUT
                    </h3>
                    <p className="font-mono text-xs text-zinc-400">
                      Bounce the ball to knock out the blocks and explore our services! Move your paddle with your mouse, finger, or arrow keys.
                    </p>
                    <button
                      type="button"
                      onClick={restartGame}
                      className="w-full py-3 px-6 rounded-xl font-display font-bold text-sm bg-[#00F0FF] text-black hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-black" />
                      <span>START BREAKOUT GAME</span>
                    </button>
                  </motion.div>
                )}

                {gameState === 'gameover' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4 max-w-sm"
                  >
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                      <Flame className="w-8 h-8" />
                    </div>
                    <h3 className="font-display font-black text-2xl text-white">
                      GAME OVER
                    </h3>
                    <p className="font-mono text-xs text-zinc-400">
                      Final Score: <strong className="text-emerald-400">{score.toLocaleString()}</strong>
                    </p>
                    <button
                      type="button"
                      onClick={restartGame}
                      className="w-full py-3 px-6 rounded-xl font-display font-bold text-sm bg-white text-zinc-950 hover:bg-zinc-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>PLAY AGAIN</span>
                    </button>
                  </motion.div>
                )}

                {gameState === 'victory' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4 max-w-sm"
                  >
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <h3 className="font-display font-black text-2xl text-emerald-400">
                      VICTORY! ALL SERVICES SMASHED
                    </h3>
                    <p className="font-mono text-xs text-zinc-400">
                      Outstanding agility! Score: <strong className="text-emerald-400">{score.toLocaleString()}</strong>
                    </p>
                    <button
                      type="button"
                      onClick={restartGame}
                      className="w-full py-3 px-6 rounded-xl font-display font-bold text-sm bg-emerald-400 text-black hover:bg-emerald-300 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>PLAY AGAIN</span>
                    </button>
                  </motion.div>
                )}

                {gameState === 'paused' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4 max-w-sm"
                  >
                    <h3 className="font-display font-black text-2xl text-white">
                      GAME PAUSED
                    </h3>
                    <button
                      type="button"
                      onClick={() => setGameState('playing')}
                      className="w-full py-3 px-6 rounded-xl font-display font-bold text-sm bg-[#00F0FF] text-black hover:bg-cyan-300 transition-all cursor-pointer"
                    >
                      RESUME GAME
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Service Legend Strip at Bottom */}
          <div className="p-4 border-t border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-black/40">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold mb-2">
              SHATTERABLE SERVICE TILES:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-mono text-[11px]">
              {SERVICE_BRICK_COLORS.map((s, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-xl border border-black/10 dark:border-white/10 flex items-center gap-2 bg-white/40 dark:bg-white/[0.02]"
                >
                  <span
                    className="w-3 h-3 rounded-md shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <div className="overflow-hidden">
                    <span className="truncate block font-bold text-zinc-800 dark:text-zinc-200 text-[10px]">
                      {s.title.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-zinc-500">+{s.points} PTS</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
