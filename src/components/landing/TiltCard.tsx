import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function TiltCard({
  children,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // We map values from 0.0 to 1.0 (representing coordinate percentages)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), springConfig);

  // Dynamic radial spotlight background tracking to create visual depth
  const spotlightBg = useTransform(
    [x, y],
    ([currX, currY]) =>
      `radial-gradient(500px circle at ${currX * 100}% ${currY * 100}%, rgba(255, 77, 45, 0.07) 0%, rgba(249, 115, 22, 0.03) 40%, transparent 80%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    onMouseLeave?.();
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {/* Interactive mouse reflection spotlight shimmer layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen z-10"
        style={{ background: spotlightBg }}
      />
      {children}
    </motion.div>
  );
}
