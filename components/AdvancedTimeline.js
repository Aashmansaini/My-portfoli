import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import GlowCard from "./GlowCard";

export default function AdvancedTimeline({ items }) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const lineOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

    return (
        <div ref={containerRef} style={{ position: "relative", padding: "40px 0" }}>
            {/* Background Track */}
            <div className="timeline-track" style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "24px",
                width: "2px",
                background: "rgba(255,255,255,0.05)",
                zIndex: 0,
            }} />
            
            {/* Animated Glowing Line */}
            <motion.div className="timeline-progress" style={{
                position: "absolute",
                top: 0,
                left: "24px",
                width: "2px",
                height: lineHeight,
                opacity: lineOpacity,
                background: "linear-gradient(180deg, transparent, #e8a0bf 50%, #fff 100%)",
                boxShadow: "0 0 15px #e8a0bf",
                zIndex: 1,
            }} />

            <div style={{ display: "grid", gap: "48px", position: "relative", zIndex: 2 }}>
                {items.map((item, index) => (
                    <TimelineItem key={index} item={item} />
                ))}
            </div>
        </div>
    );
}

function TimelineItem({ item }) {
    const itemRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: itemRef,
        offset: ["start 85%", "center center"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [50, 0]);
    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

    return (
        <motion.article
            ref={itemRef}
            className="advanced-timeline-item"
            style={{
                y,
                opacity,
                scale,
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                willChange: "transform, opacity"
            }}
        >
            {/* Glowing Dot */}
            <div className="timeline-dot-wrapper">
                <motion.div 
                    style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        background: "#070707",
                        border: "2px solid #e8a0bf",
                        boxShadow: "0 0 20px rgba(232, 160, 191, 0.4)",
                        zIndex: 3,
                    }}
                    whileInView={{ scale: [1, 1.3, 1], background: ["#070707", "#e8a0bf", "#070707"] }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                />
            </div>

            <GlowCard className="card-compact">
                <div style={{ padding: "28px" }}>
                    <div className="timeline-date">{item.date}</div>
                    <h3 className="timeline-title">{item.title}</h3>
                    <p className="timeline-desc">{item.description}</p>
                    {item.tags && item.tags.length > 0 && (
                        <div className="timeline-tags">
                            {item.tags.map((tag) => (
                                <span key={tag} className="timeline-tag">{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            </GlowCard>
        </motion.article>
    );
}
