import { motion } from "framer-motion";
import { useRef, useState } from "react";

export default function MagneticButton({ children, href, className = "", primary = false, ...props }) {
    const buttonRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouse = (e) => {
        if (!buttonRef.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
        
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        
        const x = (clientX - centerX) * 0.3; // Strength of magnetic pull
        const y = (clientY - centerY) * 0.3;
        
        setPosition({ x, y });
    };

    const reset = () => {
        setIsHovered(false);
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.a
            href={href}
            ref={buttonRef}
            className={`btn ${primary ? "primary" : ""} ${className}`}
            {...props}
            onMouseMove={handleMouse}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            style={{
                position: "relative",
                overflow: "hidden",
                zIndex: 1,
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
            }}
        >
            <motion.div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: primary ? "#e8a0bf" : "rgba(255, 255, 255, 0.1)",
                    zIndex: -1,
                    scale: 0,
                    borderRadius: "50%",
                    originX: 0.5,
                    originY: 0.5,
                }}
                animate={{ scale: isHovered ? 2.5 : 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
            />
            <span style={{ 
                position: "relative", 
                zIndex: 2, 
                color: isHovered ? (primary ? "#050505" : "#fff") : (primary ? "#050505" : "var(--text)"),
                transform: "translateZ(0)",
                display: "inline-block"
            }}>
                {children}
            </span>
        </motion.a>
    );
}
