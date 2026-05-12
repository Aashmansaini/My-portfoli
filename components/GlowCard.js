import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

export default function GlowCard({ children, className = "", contentClassName = "", noCardStyle = false, as = "div", style = {}, ...props }) {
    const cardRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((ev) => {
        if (!cardRef.current) return;
        const { left, top } = cardRef.current.getBoundingClientRect();
        setMousePosition({ x: ev.clientX - left, y: ev.clientY - top });
    }, []);

    const Component = motion[as] || motion.div;

    return (
        <Component
            ref={cardRef}
            className={`${noCardStyle ? "" : "card"} ${className}`.trim()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            style={{
                position: "relative",
                overflow: "hidden",
                backfaceVisibility: "hidden",
                ...style,
            }}
            whileHover={noCardStyle ? undefined : { y: -4 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            {...props}
        >
            <motion.div
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(232, 160, 191, 0.08), transparent 40%)`,
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />
            <motion.div
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "inherit",
                    padding: "1px",
                    background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(232, 160, 191, 0.4), transparent 40%)`,
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    pointerEvents: "none",
                    zIndex: 2,
                }}
            />
            <div className={contentClassName} style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>{children}</div>
        </Component>
    );
}
