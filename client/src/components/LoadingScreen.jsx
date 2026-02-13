import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Pencil } from 'lucide-react';
import '../styles/LoadingScreen.css';

const LoadingScreen = () => {
    return (
        <motion.div
            className="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            <div className="loading-content">
                <div className="icon-container">
                    <motion.div
                        className="floating-icon book-icon"
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <BookOpen size={48} color="#00c8ff" />
                    </motion.div>

                    <motion.div
                        className="floating-icon cap-icon"
                        animate={{
                            y: [0, -30, 0],
                            rotate: [0, -15, 15, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                        }}
                    >
                        <GraduationCap size={64} color="#ff2a6d" />
                    </motion.div>

                    <motion.div
                        className="floating-icon pencil-icon"
                        animate={{
                            y: [0, -15, 0],
                            rotate: [0, 45, 0],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                    >
                        <Pencil size={40} color="#0aff9d" />
                    </motion.div>
                </div>

                <motion.div
                    className="loading-text-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h1 className="loading-title">ACADEMIC DUEL</h1>
                    <div className="loading-bar-container">
                        <motion.div
                            className="loading-bar-fill"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                        />
                    </div>
                    <motion.p
                        className="loading-status"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        Enrolling in Next Semester...
                    </motion.p>
                </motion.div>
            </div>

            {/* Background Particles */}
            <div className="loading-particles">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            background: i % 2 === 0 ? '#00c8ff' : '#ff2a6d',
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 0.8, 0],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
