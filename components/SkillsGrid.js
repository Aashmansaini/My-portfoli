import { motion } from "framer-motion";
import GlowCard from "./GlowCard";

const skillCategories = [
    {
        label: "Languages",
        items: ["Python", "SQL", "Java", "C++"],
    },
    {
        label: "ML & Deep Learning",
        items: ["TensorFlow", "Scikit-learn", "LSTM", "GRU", "Transformers", "RAG Pipelines"],
    },
    {
        label: "Data & Analytics",
        items: ["Pandas", "NumPy", "Power BI", "Jupyter", "Feature Engineering"],
    },
    {
        label: "Cloud & Tools",
        items: ["AWS", "Flask", "Git", "GitHub", "PostgreSQL"],
    },
];

export default function SkillsGrid() {
    return (
        <div className="skills-grid">
            {skillCategories.map((cat, catIndex) => (
                <motion.div
                    key={cat.label}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: catIndex * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                    <GlowCard className="card-compact" contentClassName="skill-category">
                        <h4>{cat.label}</h4>
                        <ul>
                            {cat.items.map((skill) => (
                                <li key={skill}>{skill}</li>
                            ))}
                        </ul>
                    </GlowCard>
                </motion.div>
            ))}
        </div>
    );
}
