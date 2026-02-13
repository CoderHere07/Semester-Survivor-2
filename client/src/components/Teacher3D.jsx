import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import '../styles/Teacher3D.css';

const Teacher3D = ({ handState = 'idle' }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 10;
            const y = (e.clientY / window.innerHeight - 0.5) * 10;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Hand Animation Variants
    const armVariants = {
        idle: { rotateZ: [-5, -15, -5], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
        prep: { rotateZ: 60, transition: { duration: 0.3 } },
        thrown: { rotateZ: -30, transition: { duration: 0.2 } }
    };

    const penVariants = {
        idle: { opacity: 1, scale: 1 },
        prep: { opacity: 1, scale: 1.2 },
        thrown: { opacity: 0, scale: 0, transition: { duration: 0.1 } }
    };

    return (
        <motion.div
            className="character-3d-container"
            style={{
                rotateY: -mousePosition.x,
                rotateX: -mousePosition.y,
            }}
            animate={{
                y: [0, -10, 0],
            }}
            transition={{
                y: {
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                }
            }}
        >
            {/* Teacher 3D Model - ACADEMIC AUTHORITY */}
            <div className="teacher-3d">
                {/* Head */}
                <motion.div
                    className="teacher-head"
                    style={{
                        transformOrigin: 'center center'
                    }}
                    animate={{
                        rotateZ: [1, -1, 1],
                    }}
                    transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="face">
                        {/* Glasses - MANDATORY IDENTIFIER */}
                        <motion.div
                            className="glasses"
                            animate={{
                                opacity: [1, 0.8, 1],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                repeatDelay: 3,
                            }}
                        >
                            <div className="glass-frame left-frame">
                                <div className="lens" />
                            </div>
                            <div className="glass-bridge" />
                            <div className="glass-frame right-frame">
                                <div className="lens" />
                            </div>
                        </motion.div>
                        <div className="eyes">
                            <motion.div
                                className="eye left-eye"
                                animate={{
                                    scaleY: [1, 0.1, 1],
                                }}
                                transition={{
                                    duration: 3.5,
                                    repeat: Infinity,
                                    repeatDelay: 2.5,
                                }}
                            />
                            <motion.div
                                className="eye right-eye"
                                animate={{
                                    scaleY: [1, 0.1, 1],
                                }}
                                transition={{
                                    duration: 3.5,
                                    repeat: Infinity,
                                    repeatDelay: 2.5,
                                }}
                            />
                        </div>
                        <div className="mouth stern" />
                        <div className="mustache" />
                    </div>
                </motion.div>

                {/* Body - Suit with Bow Tie */}
                <div className="teacher-body">
                    <div className="suit" />
                    {/* Bow Tie - MANDATORY IDENTIFIER */}
                    <motion.div
                        className="bow-tie"
                        animate={{
                            scale: [1, 1.1, 1], // Restored Pulse
                            rotateZ: [-2, 2, -2]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <div className="tie" />
                    <motion.div
                        className="arm left-arm"
                        variants={armVariants}
                        animate={handState}
                    >
                        {/* Grading Pen - WEAPONIZED TEACHING ITEM */}
                        <motion.div
                            className="grading-pen"
                            variants={penVariants}
                            animate={handState}
                        />
                    </motion.div>
                    <motion.div
                        className="arm right-arm"
                        animate={{
                            rotateZ: [0, 10, 0],
                        }}
                        transition={{
                            duration: 2.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.4
                        }}
                    />
                </div>

                {/* Legs and Formal Shoes */}
                <div className="teacher-legs">
                    <motion.div
                        className="teacher-leg left-leg"
                        animate={{
                            rotateZ: [0, -1, 0],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <div className="teacher-shoe" />
                    </motion.div>
                    <motion.div
                        className="teacher-leg right-leg"
                        animate={{
                            rotateZ: [0, 1, 0],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.6
                        }}
                    >
                        <div className="teacher-shoe" />
                    </motion.div>
                </div>

                {/* Fire particles around teacher */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="energy-particle teacher-particle"
                        style={{
                            left: `${50 + Math.cos(i * Math.PI / 3) * 50}%`,
                            top: `${50 + Math.sin(i * Math.PI / 3) * 50}%`,
                        }}
                        animate={{
                            scale: [0.5, 1.2, 0.5],
                            opacity: [0.3, 0.8, 0.3],
                            rotate: -360,
                            y: [0, -8, 0],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Glowing aura - RED/PURPLE DOMINANT */}
            <motion.div
                className="character-aura teacher-aura"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </motion.div>
    );
};

export default Teacher3D;
