import { useRef } from 'react';
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
} from 'framer-motion';

import Navbar from '../components/Navbar';
import ThreeDScene from '../components/ThreeDScene';
import ScrollReveal from '../components/ScrollReveal';
import GlowCard from '../components/GlowCard';
import AdvancedTimeline from '../components/AdvancedTimeline';
import SkillsGrid from '../components/SkillsGrid';
import MagneticButton from '../components/MagneticButton';

export default function Home() {
    const heroRef = useRef(null);

    const { scrollYProgress } = useScroll();

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 55,
        damping: 26,
        mass: 0.4,
    });

    const networkScale = useTransform(
        smoothProgress,
        [0, 0.35, 1],
        [0.92, 1.04, 1.18]
    );
    const networkOpacity = useTransform(
        smoothProgress,
        [0, 0.2, 0.8, 1],
        [0.72, 0.92, 0.68, 0.48]
    );
    const networkX = useTransform(smoothProgress, [0, 0.35, 1], ['0%', '0%', '-4%']);
    const networkY = useTransform(smoothProgress, [0, 1], ['0%', '3%']);
    const bgDarkenOpacity = useTransform(smoothProgress, [0, 1], [0, 0.85]);

    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });

    const smoothHeroProgress = useSpring(heroProgress, {
        stiffness: 70,
        damping: 24,
        mass: 0.35,
    });

    const titleY = useTransform(smoothHeroProgress, [0, 1], [0, -55]);
    const titleScale = useTransform(smoothHeroProgress, [0, 1], [1, 0.94]);
    const titleOpacity = useTransform(smoothHeroProgress, [0, 0.78, 1], [1, 1, 0.35]);

    return (
        <>
            <a href="#main-content" className="skip-link">Skip to content</a>
            <div className="noise" aria-hidden="true" />
            <Navbar />
            <motion.div
                className="global-network-bg"
                aria-hidden="true"
                style={{
                    scale: networkScale,
                    opacity: networkOpacity,
                    x: networkX,
                    y: networkY,
                }}
            >
                <ThreeDScene />
            </motion.div>

            <motion.div
                aria-hidden="true"
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 1,
                    backgroundColor: "#000000",
                    opacity: bgDarkenOpacity,
                    pointerEvents: "none",
                }}
            />

            <main id="main-content">
                {/* ─── Hero ─── */}
                <section id="home" className="hero" ref={heroRef}>
                    <div className="hero-sticky">
                        <motion.div
                            className="hero-content"
                            style={{
                                y: titleY,
                                scale: titleScale,
                                opacity: titleOpacity,
                            }}
                        >
                            <motion.div
                                className="eyebrow"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="status-dot" />
                                Available for AI/ML Engineering roles
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 44, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            >
                                Aashman Saini.
                                <span className="hero-gradient" style={{ display: 'block' }}>
                                    AI &amp; ML Engineer.
                                </span>
                            </motion.h1>

                            <motion.p
                                className="hero-copy"
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.9, delay: 0.15 }}
                            >
                                I build machine learning systems that ship. NLP chatbots serving
                                500K+ users. Prediction models trained on real-world data.
                                Triple AWS certified.
                            </motion.p>
                            <motion.p
                                className="hero-meta"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.9, delay: 0.22 }}
                            >
                                Based in Delhi.
                            </motion.p>

                            <motion.div
                                className="hero-actions"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.9, delay: 0.28 }}
                            >
                                <MagneticButton primary href="#experience">
                                    View my work
                                </MagneticButton>
                                <MagneticButton href="#contact">
                                    Get in touch
                                </MagneticButton>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* ─── Experience ─── */}
                <section className="section" id="experience">
                    <ScrollReveal>
                        <div className="section-header">
                            <div>
                                <div className="section-label">Experience</div>
                                <h2>Professional Journey.</h2>
                            </div>
                        </div>
                    </ScrollReveal>

                    <AdvancedTimeline
                        items={[
                            {
                                date: 'Jan 2026 – Present',
                                title: 'AI/ML Engineer Intern · Kapable',
                                description: 'Building RAG pipelines to convert recorded coaching sessions into structured evaluation reports. Working on NLP-based personality prediction using text analysis and integrating local LLMs for production use.',
                                tags: ['Python', 'RAG Pipelines', 'NLP', 'LLMs', 'Ollama'],
                            },
                            {
                                date: 'Aug – Dec 2025',
                                title: 'AI/ML Engineer Intern · MBD Group',
                                description: 'Designed and deployed an NLP chatbot for the Aasoka education platform to handle real-time student queries at scale. Currently serving 500,000+ users in production.',
                                tags: ['Python', 'TensorFlow', 'NLP', 'Model Deployment'],
                            },
                            {
                                date: 'Jun – Sep 2024',
                                title: 'Data Analyst Intern · DNISPL',
                                description: 'Automated repetitive data entry workflows across B2B client pipelines, reducing processing time by 40%. Managed and queried 10,000+ line enterprise databases and built operational reporting dashboards.',
                                tags: ['Python', 'SQL', 'Pandas', 'PostgreSQL', 'Dashboards'],
                            },
                        ]}
                    />
                </section>

                {/* ─── Projects ─── */}
                <section className="section" id="projects">
                    <ScrollReveal>
                        <div className="section-header">
                            <div>
                                <div className="section-label">Projects</div>
                                <h2>What I've built.</h2>
                            </div>
                        </div>
                    </ScrollReveal>

                    <AdvancedTimeline
                        items={[
                            {
                                date: '2026',
                                title: 'Video-to-Report RAG Pipeline',
                                description: 'Built an automated pipeline for Kapable that converts recorded coaching sessions into structured evaluation reports. Utilizes NLP and local LLMs to extract personality traits and performance evidence from video transcripts.',
                                tags: ['Python', 'RAG', 'NLP', 'LLMs', 'Ollama'],
                            },
                            {
                                date: '2025',
                                title: 'Stock Prediction System',
                                description: 'Architected a market forecasting platform trained on 5 years of historical data, achieving a 0.0006 epoch loss using an ensemble of LSTM, RNN, GRU, and Transformer models. Integrated a conversational AI assistant for real-time statistical analysis and performance reporting.',
                                tags: ['Python', 'TensorFlow', 'LSTM', 'Flask', 'Transformer'],
                            },
                            {
                                date: '2024',
                                title: 'Hospital Management System',
                                description: 'Engineered a Power BI analytics suite for real-time patient tracking and predictive readmission risk modeling. Developed an IoT-driven alert system and a conversational agent to automate patient query resolution.',
                                tags: ['Power BI', 'SQL', 'Python', 'IoT', 'Predictive Modeling'],
                            },
                            {
                                date: '2024',
                                title: 'Traffic Prediction System',
                                description: 'Designed high-accuracy (85%+) analytical pipelines for real-time traffic monitoring. Implemented feature engineering and model optimization across multiple LSTM architectures to forecast traffic flow patterns.',
                                tags: ['Python', 'Scikit-learn', 'LSTM', 'Feature Engineering'],
                            },
                        ]}
                    />
                </section>

                {/* ─── Skills ─── */}
                <section className="section" id="skills">
                    <ScrollReveal>
                        <div className="section-header-simple">
                            <div className="section-label">Skills</div>
                            <h2>Stack.</h2>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal>
                        <SkillsGrid />
                    </ScrollReveal>
                </section>

                {/* ─── Credentials (Certifications + Education) ─── */}
                <section className="section" id="credentials">
                    <ScrollReveal>
                        <div className="section-header-simple">
                            <div className="section-label">Credentials</div>
                            <h2>Certified &amp; Educated.</h2>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal>
                        <div className="cert-list">
                            {[
                                { name: 'AWS Certified Generative AI Developer', level: 'Professional', validity: '2025–2028' },
                                { name: 'AWS Certified Machine Learning Engineer', level: 'Associate', validity: '2025–2028' },
                                { name: 'AWS Certified AI Practitioner', level: 'Foundational', validity: '2025–2028' },
                                { name: 'Microsoft Certified: Power BI Data Analyst', level: 'Associate', validity: '2024–2025' },
                            ].map((cert) => (
                                <GlowCard key={cert.name} className="card-compact" contentClassName="cert-item">
                                    <div>
                                        <div className="cert-name">{cert.name}</div>
                                        <span className="cert-level">{cert.level}</span>
                                    </div>
                                    <span className="cert-validity">{cert.validity}</span>
                                </GlowCard>
                            ))}
                        </div>
                    </ScrollReveal>

                    <ScrollReveal>
                        <div className="edu-list">
                            {[
                                {
                                    degree: "B.Tech in Information Technology",
                                    school: "Guru Gobind Singh Indraprastha University(MSIT), Delhi",
                                    period: "2022 – 2026",
                                    stats: "GPA 7.0/10"
                                },
                                {
                                    degree: "Higher Secondary Education",
                                    school: "Nirmal Bhartia School, Delhi",
                                    period: "Completed 2022",
                                    stats: "94%"
                                }
                            ].map((edu, index) => (
                                <GlowCard key={index} className="card-compact" contentClassName="edu-item">
                                    <div className="edu-info">
                                        <div className="edu-degree">{edu.degree}</div>
                                        <div className="edu-school">{edu.school}</div>
                                    </div>
                                    <div className="edu-meta">
                                        <span className="edu-period">{edu.period}</span>
                                        <span className="edu-stats">{edu.stats}</span>
                                    </div>
                                </GlowCard>
                            ))}
                        </div>
                    </ScrollReveal>
                </section>

                {/* ─── Contact ─── */}
                <section className="section" id="contact">
                    <ScrollReveal>
                        <GlowCard className="card-compact" contentClassName="contact-panel">
                            <div>
                                <div className="section-label">Contact</div>
                                <h2>Let's talk.</h2>
                                <p className="section-intro" style={{ marginBottom: "24px" }}>
                                    Open to AI/ML Engineering and Data Science roles.<br />
                                    New Delhi, India.
                                </p>
                                <div className="hero-actions">
                                    <MagneticButton primary href="mailto:aashman.saini@gmail.com">
                                        aashman.saini@gmail.com
                                    </MagneticButton>
                                    <MagneticButton href="https://www.linkedin.com/in/aashman-saini" target="_blank" rel="noopener noreferrer">
                                        LinkedIn
                                    </MagneticButton>
                                    <MagneticButton href="https://github.com/Aashmansaini" target="_blank" rel="noopener noreferrer">
                                        GitHub
                                    </MagneticButton>
                                    {/* Ensure Aashman_Saini_Resume.pdf is placed in /public folder */}
                                    <MagneticButton
                                        href="/Aashman_Saini_Resume.pdf"
                                        download="Aashman_Saini_Resume.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        id="resume-download"
                                    >
                                        Download Resume
                                    </MagneticButton>
                                </div>
                            </div>
                        </GlowCard>
                    </ScrollReveal>
                </section>
            </main>

            <footer className="footer">
                <span>© 2026 Aashman Saini</span>
                <div className="footer-links">
                    <a href="https://github.com/Aashmansaini" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="https://www.linkedin.com/in/aashman-saini" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href="mailto:aashman.saini@gmail.com">Email</a>
                </div>
            </footer>
        </>
    );
}