"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingGlassBlockProps {
	className?: string;
	delay?: number;
	duration?: number;
	size?: "sm" | "md" | "lg" | "xl";
    rotate?: number;
    moveRange?: number;
    children?: React.ReactNode;
}

const sizes = {
	sm: "w-16 h-16",
	md: "w-24 h-24",
	lg: "w-32 h-32",
	xl: "w-48 h-48",
};

export default function FloatingGlassBlock({
	className,
	delay = 0,
	duration = 8,
	size = "md",
    rotate = 0,
    moveRange = 30,
    children,
}: FloatingGlassBlockProps) {
	return (
		<motion.div
			initial={{ 
                y: 0, 
                rotateX: rotate, 
                rotateY: rotate, 
                rotateZ: rotate,
                scale: 1
            }}
			animate={{
				y: [0, -moveRange, 0],
				rotateX: [rotate, rotate + 5, rotate],
				rotateY: [rotate, rotate + 8, rotate],
                rotateZ: [rotate, rotate + 1, rotate - 1, rotate],
                scale: [1, 1.02, 1],
			}}
			transition={{
				y: {
                    duration: duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay,
                },
                rotateX: {
                    duration: duration * 1.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay,
                },
                rotateY: {
                    duration: duration * 1.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay,
                },
                rotateZ: {
                    duration: duration * 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay,
                },
                scale: {
                    duration: duration * 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay,
                }
			}}
            style={{ transformStyle: 'preserve-3d' }}
			className={cn(
				"absolute z-10",
				sizes[size],
				className
			)}
		>
            {/* SIDE GLOW: Khối đặc phát sáng nội tại */}
            <div className="absolute inset-0 rounded-3xl bg-secondary/10 blur-2xl [transform:translateZ(0px)] opacity-50" />

            {/* BACK FACE: Lớp đáy tạo độ dày vật lý */}
            <div className="absolute inset-0 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 [transform:translateZ(-25px)] opacity-40 shadow-2xl" />

            {/* VOLUMETRIC LIGHT: Khúc xạ bên trong */}
            <div className="absolute inset-4 rounded-full bg-primary/20 blur-[40px] [transform:translateZ(10px)] pointer-events-none" />

            {/* FRONT FACE: Lớp kính mặt trước với hiệu ứng chiều sâu */}
            <div className="absolute inset-0 rounded-3xl glass glow-primary border-white/40 flex items-center justify-center overflow-hidden [transform:translateZ(30px)] shadow-[0_20px_40px_rgba(0,0,0,0.15),inset_0_0_20px_rgba(255,255,255,0.4)]">
                {/* Surface Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-white/5 pointer-events-none" />
                
                {/* Content / Icon inside - LỒI LÊN: Đẩy cao hẳn lên trên mặt kính */}
                <div className="relative z-10 flex items-center justify-center w-full h-full p-4 [transform:translateZ(25px)] drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)] scale-110">
                    {children}
                </div>
                
                {/* Viền Bevel tinh tế hơn */}
                <div className="absolute inset-px rounded-[inherit] border border-white/40 pointer-events-none mix-blend-overlay" />
                <div className="absolute inset-[2px] rounded-[inherit] border border-white/10 pointer-events-none" />
            </div>

            {/* SIDE WALLS: Giả lập độ dày của khối thủy tinh/nhựa */}
            <div className="absolute inset-0 rounded-3xl [transform:translateZ(15px)] border-[15px] border-white/5 blur-[4px] pointer-events-none opacity-60" />
            <div className="absolute inset-0 rounded-3xl [transform:translateZ(-10px)] border-[15px] border-primary/5 blur-[6px] pointer-events-none opacity-40" />
        </motion.div>
	);
}
