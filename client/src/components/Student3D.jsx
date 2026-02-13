import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import '../styles/Student3D.css';

const Student3D = ({ handState = 'idle' }) => {
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
        idle: { rotateZ: [15, 20, 15], transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } },
        prep: { rotateZ: -60, transition: { duration: 0.3 } },
        thrown: { rotateZ: 30, transition: { duration: 0.2 } }
    };

    const pencilVariants = {
        idle: { opacity: 1, scale: 1 },
        prep: { opacity: 1, scale: 1.2 },
        thrown: { opacity: 0, scale: 0, transition: { duration: 0.1 } }
    };

    return (
        <motion.div
            className="character-3d-container"
            style={{
                rotateY: mousePosition.x,
                rotateX: -mousePosition.y,
            }}
            animate={{
                y: [0, -10, 0],
            }}
            transition={{
                y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }
            }}
        >
            {/* Student 3D Model - ACADEMIC BATTLE READY */}
            <div className="student-3d">
                {/* Backpack - Behind body */}
                <div className="backpack" />
                <div className="backpack-strap left" />
                <div className="backpack-strap right" />

                {/* Head */}
                <motion.div
                    className="student-head"
                    style={{
                        transformOrigin: 'center center'
                    }}
                    animate={{
                        rotateZ: [-1, 1, -1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="face">
                        <div className="eyes">
                            <motion.div
                                className="eye left-eye"
                                animate={{
                                    scaleY: [1, 0.1, 1],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatDelay: 2,
                                }}
                            />
                            <motion.div
                                className="eye right-eye"
                                animate={{
                                    scaleY: [1, 0.1, 1],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatDelay: 2,
                                }}
                            />
                        </div>
                        <div className="mouth determined" />
                    </div>
                </motion.div>

                {/* Body - Hoodie */}
                <div className="student-body">
                    <div className="hoodie" />

                    {/* Floating Books - MANDATORY IDENTIFIER */}
                    <div className="floating-books">
                        <motion.div
                            className="book book-1"
                            animate={{
                                y: [0, -15, 0],
                                rotateZ: [-5, 5, -5],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div
                            className="book book-2"
                            animate={{
                                y: [0, -10, 0],
                                rotateZ: [10, -10, 10],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5
                            }}
                        />
                    </div>

                    <motion.div
                        className="arm left-arm"
                        animate={{
                            rotateZ: [-15, -20, -15],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="arm right-arm"
                        variants={armVariants}
                        animate={handState}
                    >
                        {/* Pencil Sword - Weaponized School Item */}
                        <motion.div
                            className="pencil-sword"
                            variants={pencilVariants}
                            animate={handState}
                        />
                    </motion.div>
                </div>

                {/* Legs and Sneakers */}
                <div className="student-legs">
                    <motion.div
                        className="leg left-leg"
                        animate={{
                            rotateZ: [0, -2, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <div className="shoe" />
                    </motion.div>
                    <motion.div
                        className="leg right-leg"
                        animate={{
                            rotateZ: [0, 2, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                        }}
                    >
                        <div className="shoe" />
                    </motion.div>
                </div>

                {/* Energy particles around student */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="energy-particle student-particle"
                        style={{
                            left: `${50 + Math.cos(i * Math.PI / 3) * 50}%`,
                            top: `${50 + Math.sin(i * Math.PI / 3) * 50}%`,
                        }}
                        animate={{
                            scale: [0.5, 1.2, 0.5],
                            opacity: [0.3, 0.8, 0.3],
                            rotate: 360,
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Glowing aura - BLUE DOMINANT */}
            <motion.div
                className="character-aura student-aura"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </motion.div>
    );
};

export default Student3D;
