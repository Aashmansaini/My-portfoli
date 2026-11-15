import { motion } from "framer-motion";
import GlowCard from "./GlowCard";

const skillCategories = [
    {
        label: "Languages",
        items: ["Python", "SQL", "Java", "C++", "C", "R", "HTML", "CSS"],
    },
    {
        label: "ML & AI",
        items: ["RAG Pipelines", "LangChain", "LangGraph", "ChromaDB", "Ollama", "TensorFlow", "Keras", "Scikit-learn", "LSTM", "Transformers", "Keycloak"],
    },
    {
        label: "Data Science & Analytics",
        items: ["Pandas", "NumPy", "Power BI", "Tableau", "Matplotlib", "Seaborn", "Predictive Modeling", "Feature Engineering"],
    },
    {
        label: "Cloud & Databases",
        items: ["AWS (SageMaker, Lambda, S3)", "ClickHouse", "Snowflake", "PostgreSQL", "MySQL", "Flask APIs"],
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
