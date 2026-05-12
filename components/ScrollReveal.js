import { motion } from 'framer-motion';

export default function ScrollReveal({ children, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 42, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                willChange: "transform, opacity",
            }}
        >
            {children}
        </motion.div>
    );
}