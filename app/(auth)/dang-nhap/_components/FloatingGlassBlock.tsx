"use client"

import { cn } from "@/lib/utils"

import { motion } from "framer-motion"

interface FloatingGlassBlockProps {
  className?: string
  delay?: number
  duration?: number
  size?: "sm" | "md" | "lg" | "xl"
  rotate?: number // Góc xoay mặc định ban đầu
  hoverRotateX?: number // Góc xoay trục X khi hover
  hoverRotateY?: number // Góc xoay trục Y khi hover
  hoverRotateZ?: number // Góc xoay trục Z khi hover
  moveRange?: number
  children?: React.ReactNode
}

const sizes = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
}

// Đưa các variants tĩnh ra ngoài (nếu không phụ thuộc props)
const slicedVolumeVariants = {
  rest: { scale: 1, opacity: 0.2 },
  hover: { scale: 1.2, opacity: 0.4 },
}

const contentVariants = {
  rest: {
    z: 10,
    scale: 1,
  },
  hover: {
    z: 20,
    scale: 0.8,
    filter: "blur(1px)",
  },
}

export default function FloatingGlassBlock({
  className,
  delay = 0,
  duration = 8,
  size = "md",
  rotate = 0,
  hoverRotateX = 10, // Giá trị mặc định khi hover
  hoverRotateY = 15, // Giá trị mặc định khi hover
  hoverRotateZ = 2, // Giá trị mặc định khi hover
  moveRange = 30,
  children,
}: FloatingGlassBlockProps) {
  // ĐƯA CONTAINER VARIANTS VÀO TRONG ĐỂ NHẬN PROPS
  const containerVariants = {
    rest: {
      rotateX: rotate, // Có thể lấy góc rotate ban đầu
      rotateY: rotate,
      rotateZ: 0,
      scale: 1,
    },
    hover: {
      rotateX: hoverRotateX, // Dùng props truyền vào
      rotateY: hoverRotateY, // Dùng props truyền vào
      rotateZ: hoverRotateZ, // Dùng props truyền vào
      scale: 1.05,
    },
  }

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -moveRange, 0] }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
      className={cn("absolute z-10 perspective-[1000px]", sizes[size], className)}
    >
      <motion.div
        initial="rest"
        whileHover="hover"
        style={{ transformStyle: "preserve-3d" }}
        variants={containerVariants} // Biến động theo từng component
        className="relative h-full w-full rounded-3xl"
      >
        {/* BASE LAYER (Độ dày) */}
        <div className="absolute inset-0 transform-[translateZ(-25px)] rounded-3xl border border-white/10 bg-white/5 opacity-40 shadow-2xl backdrop-blur-md" />

        {/* SLICED VOLUME LAYER */}
        <motion.div
          variants={slicedVolumeVariants}
          className="pointer-events-none absolute inset-0 z-0 transform-[translateZ(-10px)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="bg-radial-gradient-glass absolute top-1/2 right-1/2 h-40 w-40 transform-[translateZ(0px)]" />
          <div className="bg-radial-gradient-glass absolute top-1/2 right-1/2 h-32 w-32 transform-[translateZ(10px)]" />
          <div className="bg-radial-gradient-glass absolute top-1/2 right-1/2 h-24 w-24 transform-[translateZ(20px)]" />
          <div className="bg-radial-gradient-glass absolute top-1/2 right-1/2 h-16 w-16 transform-[translateZ(30px)]" />
        </motion.div>

        {/* VOLUMETRIC LIGHT */}
        <div className="bg-primary/20 pointer-events-none absolute inset-4 transform-[translateZ(10px)] rounded-full blur-2xl" />

        {/* FRONT GLASS LAYER */}
        <div className="glass glow-primary absolute inset-0 z-10 flex transform-[translateZ(30px)] items-center justify-center overflow-hidden rounded-3xl border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.15),inset_0_0_20px_rgba(255,255,255,0.4)]">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-white/30 via-transparent to-white/5" />
          <div className="pointer-events-none absolute inset-px rounded-[inherit] border border-white/40 mix-blend-overlay" />
          <div className="pointer-events-none absolute inset-0.5 rounded-[inherit] border border-white/10" />
        </div>

        {/* CONTENT LAYER */}
        <motion.div
          variants={contentVariants}
          className="pointer-events-none absolute inset-0 z-20 flex h-full w-full items-center justify-center p-4"
        >
          <div className="relative z-10 flex h-full w-full items-center justify-center drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)]">
            {children}
          </div>
        </motion.div>

        {/* SIDE WALLS */}
        <div className="pointer-events-none absolute inset-0 transform-[translateZ(15px)] rounded-3xl border-15 border-white/5 opacity-60 blur-xs" />
        <div className="border-primary/5 pointer-events-none absolute inset-0 transform-[translateZ(-10px)] rounded-3xl border-15 opacity-40 blur-[6px]" />

        {/* GLOW LAYER */}
        <div className="bg-secondary/10 absolute inset-0 transform-[translateZ(0px)] rounded-3xl opacity-50 blur-2xl" />
      </motion.div>
    </motion.div>
  )
}
