import React, { useEffect, useRef } from "react";

export const FrictionlessConfetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }

    let particles: Particle[] = [];
    const colors = ["#2563FF", "#FFA07A", "#FFD700", "#FF69B4", "#20B2AA", "#87CEFA", "#BA55D3", "#4CAF50"];

    const spawnParticles = () => {
      for (let i = 0; i < 150; i++) {
        // Spawn from top, scattered across the screen
        particles.push({
          x: Math.random() * width,
          y: Math.random() * -height - 20,
          size: Math.random() * 8 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: Math.random() * 4 - 2,
          speedY: Math.random() * 4 + 4,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 4 - 2,
          opacity: 1,
        });
      }
    };

    // Trigger on mount
    spawnParticles();

    // Expose global trigger
    (window as any).triggerPageConfetti = () => {
      spawnParticles();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const activeParticles = [];
      for (const p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height) {
          continue; // discard particle
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        // Draw geometric shapes (squares, circles, triangles) randomly
        const rem = Math.floor(p.size) % 3;
        if (rem === 1) {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (rem === 2) {
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        activeParticles.push(p);
      }

      particles = activeParticles;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      delete (window as any).triggerPageConfetti;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[200] w-full h-full"
    />
  );
};
