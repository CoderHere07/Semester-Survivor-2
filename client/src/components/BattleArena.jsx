import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { updateStats, setStage, switchTurn, resetGame, incrementAttackCount, resetAttackCount, updateGpa } from '../store/gameSlice';
import { STAGES, TEACHER_ATTACKS, STUDENT_ACTIONS } from '../gameData';
import axios from 'axios';
import Student3D from './Student3D';
import Teacher3D from './Teacher3D';
import { LayoutDashboard, ArrowRight, RotateCcw } from 'lucide-react';
import '../styles/BattleArena.css';

// Import Sounds
import assignmentSound from '../sounds/Assignment.mp3';
import classParticipationSound from '../sounds/cp.mp3';
import extraCreditSound from '../sounds/extracredit.mp3';
import midtermSound from '../sounds/midterm.mp3';
import ontimeSound from '../sounds/ontime.mp3';
import powernapSound from '../sounds/powernap.mp3';
import projectSound from '../sounds/project.mp3';
import quizSound from '../sounds/quiz.mp3';
import smartQuestionSound from '../sounds/question.mp3';
import takeNotesSound from '../sounds/takenotes.mp3';
import semesterClearSound from '../sounds/semester clear.mp3';
import semesterFailedSound from '../sounds/semester failed.mp3';

const BattleArena = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { stage, energy, stress, isGameOver, turn, gpa, attackCount } = useSelector((state) => state.game);
    const { user } = useSelector((state) => state.auth);

    const [teacherHP, setTeacherHP] = useState(100);
    const [currentStageData, setCurrentStageData] = useState(STAGES[0]);

    // Animation States
    const [isShaking, setIsShaking] = useState(false);
    const [activeProjectile, setActiveProjectile] = useState(null);
    const [damageNumber, setDamageNumber] = useState(null); // { val, x, y, color }
    const [showShield, setShowShield] = useState(false);
    const [showHeal, setShowHeal] = useState(false);
    const [showVictoryModal, setShowVictoryModal] = useState(false);
    const [isSoundPlaying, setIsSoundPlaying] = useState(false);

    // Hand Coordination States
    const [playerHandState, setPlayerHandState] = useState('idle');
    const [teacherHandState, setTeacherHandState] = useState('idle');

    const playSound = (soundFile) => {
        return new Promise((resolve) => {
            const audio = new Audio(soundFile);
            setIsSoundPlaying(true);
            audio.onended = () => {
                setIsSoundPlaying(false);
                resolve();
            };
            audio.onerror = (e) => {
                console.error("Error playing sound:", e);
                setIsSoundPlaying(false);
                resolve();
            };
            audio.play().catch(e => {
                console.error("Play prevented or failed:", e);
                setIsSoundPlaying(false);
                resolve();
            });
        });
    };


    useEffect(() => {
        const stageData = STAGES.find(s => s.id === stage);
        if (stageData) setCurrentStageData(stageData);
    }, [stage]);

    useEffect(() => {
        if (isGameOver) {
            playSound(semesterFailedSound);
        }
    }, [isGameOver]);

    useEffect(() => {
        if (isGameOver || showVictoryModal) return;
        if (turn === 'teacher') {
            const timer = setTimeout(() => handleTeacherTurn(), 1500);
            return () => clearTimeout(timer);
        }
    }, [turn, isGameOver, showVictoryModal]);

    const triggerShake = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 400);
    };

    const spawnDamage = (val, target, color = '#ff2a6d') => {
        const x = target === 'teacher' ? 'calc(50% + 200px)' : 'calc(50% - 200px)';
        setDamageNumber({ val, x, y: '30%', color });
        setTimeout(() => setDamageNumber(null), 1000);
    };

    const handleTeacherTurn = async () => {
        const attack = TEACHER_ATTACKS[Math.floor(Math.random() * TEACHER_ATTACKS.length)];
        const damage = Math.floor(attack.damage * (currentStageData.difficulty || 1));

        const attackSounds = {
            "Assignment": assignmentSound,
            "Class Participation": classParticipationSound,
            "Group Project": projectSound,
            "Midterm Exam": midtermSound,
            "Pop Quiz": quizSound
        };

        if (attackSounds[attack.name]) {
            await playSound(attackSounds[attack.name]);
        }

        // 1. Prep Arm
        setTeacherHandState('prep');

        setTimeout(() => {
            // 2. Release Pencil (Hand goes to 'thrown' state which hides pencil)
            setTeacherHandState('thrown');

            setActiveProjectile({
                start: '70%',
                end: '30%',
                color: '#ff2a6d'
            });

            setTimeout(() => {
                setActiveProjectile(null);
                triggerShake();
                spawnDamage(`-${damage} ${attack.type === 'stress' ? '🤯' : '⚡'}`, 'student', '#ff2a6d');

                if (attack.type === 'stress') {
                    dispatch(updateStats({ stress: damage }));
                } else {
                    dispatch(updateStats({ energy: -damage }));
                }

                // 3. Reset Hand (Pencil reappears)
                setTeacherHandState('idle');
                dispatch(switchTurn());
            }, 800);
        }, 400); // Wait for arm to lift
    };

    const handlePlayerAction = async (action) => {
        if (turn !== 'player' || isGameOver || activeProjectile || isSoundPlaying) return;

        if (action.stat === 'energy' && energy < action.cost) {
            spawnDamage("NEED ENERGY!", 'student', '#ff9900');
            return;
        }

        const actionSounds = {
            "attack_ontime": ontimeSound,
            "attack_extra": extraCreditSound,
            "attack_smart": smartQuestionSound,
            "defend_notes": takeNotesSound,
            "defend_sleep": powernapSound
        };

        if (actionSounds[action.id]) await playSound(actionSounds[action.id]);

        dispatch(incrementAttackCount());

        if (action.type === 'attack') {
            const color = action.id === 'attack_extra' ? '#ff9900' : action.id === 'attack_smart' ? '#8b5cf6' : '#00c8ff';
            dispatch(updateStats({ energy: -action.cost }));

            // 1. Prep Arm
            setPlayerHandState('prep');

            setTimeout(() => {
                // 2. Release Pencil
                setPlayerHandState('thrown');

                setActiveProjectile({
                    start: '30%',
                    end: '70%',
                    color: color
                });

                setTimeout(() => {
                    setActiveProjectile(null);
                    triggerShake();
                    spawnDamage(`-${action.damage} HP 💥`, 'teacher', color);
                    const newHP = Math.max(0, teacherHP - action.damage);
                    setTeacherHP(newHP);

                    // 3. Reset Hand
                    setPlayerHandState('idle');

                    if (newHP <= 0) {
                        handleVictory(attackCount + 1);
                    } else {
                        dispatch(switchTurn());
                    }
                }, 800);
            }, 400);

        } else {
            // Defense/Heal logic - NO PENCIL THROW
            if (action.stat === 'energy') dispatch(updateStats({ energy: -action.cost }));

            if (action.id === 'defend_notes') {
                setShowShield(true);
                dispatch(updateStats({ stress: -action.value }));
                spawnDamage(`-${action.value} Stress 🧘`, 'student', '#40c4ff');
                setTimeout(() => {
                    setShowShield(false);
                    dispatch(switchTurn());
                }, 1000);
            } else if (action.id === 'defend_sleep') {
                setShowHeal(true);
                dispatch(updateStats({ energy: action.value }));
                spawnDamage(`+${action.value} Energy 🔋`, 'student', '#69f0ae');
                setTimeout(() => {
                    setShowHeal(false);
                    dispatch(switchTurn());
                }, 1000);
            }
        }
    };

    const saveProgress = async (nextStage, currentEnergy, currentStress, currentGpa, currentAttacks) => {
        try {
            const token = localStorage.getItem('token');
            if (isNaN(currentEnergy) || isNaN(currentStress)) return;

            await axios.post(import.meta.env.VITE_API_URL + '/api/game/save', {
                stage: nextStage,
                energy: currentEnergy,
                stress: currentStress,
                isGameOver: false,
                gpa: currentGpa,
                attackCount: currentAttacks
            }, {
                headers: { 'x-auth-token': token }
            });
        } catch (err) {
            console.error("Failed to save progress");
        }
    };

    const handleVictory = (finalActions = attackCount) => {
        playSound(semesterClearSound);

        const semesterGpa = finalActions <= 4 ? 4.0 : Math.max(1.0, 4.0 - (finalActions - 4) * 0.5);
        const newGpa = stage === 1 ? semesterGpa : (parseFloat(gpa) * (stage - 1) + semesterGpa) / stage;
        const formattedGpa = newGpa.toFixed(2);
        dispatch(updateGpa(formattedGpa));

        const nextStage = parseInt(stage) + 1;
        const recoveredEnergy = Math.min(100, energy + 10);
        const reducedStress = Math.max(0, stress - 10);

        if (stage < 8) {
            saveProgress(nextStage, recoveredEnergy, reducedStress, formattedGpa, 0);
            setTimeout(() => setShowVictoryModal(true), 1000);
        } else {
            saveProgress(8, energy, stress, formattedGpa, 0);
            navigate('/leaderboard');
        }
    };

    const nextSemester = () => {
        const nextStage = parseInt(stage) + 1;
        setShowVictoryModal(false);
        dispatch(setStage(nextStage));
        dispatch(resetAttackCount());
        setTeacherHP(100);
        dispatch(updateStats({ stress: -10, energy: 10 }));
        if (turn === 'player') dispatch(switchTurn());
    };

    const goToDashboard = () => {
        setShowVictoryModal(false);
        navigate('/');
    };

    // Auto-Save on Turn Change
    useEffect(() => {
        if (!isGameOver && currentStageData && user) {
            if (turn === 'player' || turn === 'teacher') {
                saveProgress(stage, energy, stress, gpa, attackCount);
            }
        }
    }, [turn, energy, stress, isGameOver]);

    if (isGameOver) {
        return (
            <div className="modal-overlay">
                <div className="result-card">
                    <h1 className="result-title text-danger animate-shake">GAME OVER</h1>
                    <div className="result-gpa-main mb-2">Semesters Cleared: {stage - 1}</div>
                    <div className="text-warning h4 mb-4">Final GPA: {gpa}</div>

                    <div className="result-btn-group">
                        <button
                            className="btn-result btn-result-next"
                            onClick={() => { dispatch(resetGame()); navigate('/'); }}
                            disabled={isSoundPlaying}
                        >
                            <RotateCcw size={20} /> RE-ENROLL
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentStageData) return null;

    const attackActions = STUDENT_ACTIONS.filter(a => a.type === 'attack');
    const defenseActions = STUDENT_ACTIONS.filter(a => a.type === 'defense' || a.type === 'heal');

    return (
        <div className={`battle-arena-container ${isShaking ? 'shake-it' : ''}`}>

            {/* Victory Modal */}
            {showVictoryModal && (
                <div className="modal-overlay">
                    <motion.div
                        className="result-card"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <h2 className="result-title text-success">You Passed Semester {stage}!</h2>
                        <div className="result-gpa-main">Semester GPA: {(attackCount <= 4 ? 4.0 : Math.max(1.0, 4.0 - (attackCount - 4) * 0.5)).toFixed(2)}</div>
                        <p className="lead text-white-50">Cumulative GPA: <span className="text-white fw-bold">{gpa}</span></p>

                        <div className="result-btn-group">
                            <button className="btn-result btn-result-hub" onClick={goToDashboard} disabled={isSoundPlaying}>
                                <LayoutDashboard size={18} /> DASHBOARD
                            </button>
                            <button className="btn-result btn-result-next" onClick={nextSemester} disabled={isSoundPlaying}>
                                NEXT SEMESTER <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* 1. TOP HEADER */}
            <header className="battle-header">
                <div className="semester-badge">Semester {stage}/8</div>
                <h1 className="stage-title">{currentStageData.name}</h1>
            </header>

            {/* 2. BATTLE GROUND */}
            <div className="battle-ground">

                {/* STUDENT COLUMN */}
                <div className="battle-column student-column">
                    <motion.div
                        className="char-card student-card"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                    >
                        <div className="sprite-container">
                            <div className="aura-glow student-aura" />
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                style={{ width: '100px' }}
                            >
                                <Student3D handState={playerHandState} />
                            </motion.div>
                        </div>

                        <div className="char-name" style={{ fontSize: '1.4rem', color: '#00c8ff' }}>{user?.username}</div>

                        <div className="stat-group">
                            <div className="stat-header">
                                <span>Energy: {energy}%</span>
                            </div>
                            <div className="progress-base">
                                <motion.div
                                    className="progress-fill energy-fill"
                                    animate={{ width: `${energy}%` }}
                                />
                            </div>

                            <div className="stat-header">
                                <span>Stress: {stress}%</span>
                            </div>
                            <div className="progress-base">
                                <motion.div
                                    className="progress-fill stress-fill"
                                    animate={{ width: `${stress}%` }}
                                />
                            </div>

                            <div className="mt-2 text-center">
                                <span className="badge bg-primary">GPA: {gpa}</span>
                                <span className="badge bg-secondary ms-2">Actions: {attackCount}</span>
                            </div>
                        </div>

                        <AnimatePresence>
                            {showShield && (
                                <motion.div
                                    className="shield-effect"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                            {showHeal && (
                                <motion.div
                                    className="heal-effect"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem' }}
                                >
                                    💤 💤 💤
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* ACTION AREA */}
                    <div className="action-area-under-student">
                        <div className="combat-section">
                            <div className="section-label">ATTACKS</div>
                            <div className="compact-action-grid">
                                {attackActions.map(action => (
                                    <motion.button
                                        key={action.id}
                                        className="battle-btn btn-attack"
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handlePlayerAction(action)}
                                        disabled={turn !== 'player' || isSoundPlaying}
                                    >
                                        <span className="btn-main-text">{action.name.toUpperCase()}</span>
                                        {action.cost > 0 && (
                                            <span className="btn-cost-text" style={{ color: action.id === 'attack_extra' ? '#ff9900' : action.id === 'attack_smart' ? '#8b5cf6' : '#00c8ff' }}>
                                                ⚡ -{action.cost}
                                            </span>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div className="combat-section mt-3">
                            <div className="section-label">DEFENSE</div>
                            <div className="compact-action-grid">
                                {defenseActions.map(action => (
                                    <motion.button
                                        key={action.id}
                                        className="battle-btn btn-defense"
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handlePlayerAction(action)}
                                        disabled={turn !== 'player' || isSoundPlaying}
                                    >
                                        <span className="btn-main-text">{action.name.toUpperCase()}</span>
                                        {(action.cost > 0 || action.type === 'heal') && (
                                            <span className="btn-cost-text" style={{ color: action.id === 'defend_sleep' ? '#0aff9d' : '#ff9900' }}>
                                                ⚡ {action.type === 'heal' ? `+${action.value}` : `-${action.cost}`}
                                            </span>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* VS CENTERPIECE */}
                <div className="vs-centerpiece">
                    <h1 className="vs-text">VS</h1>
                </div>

                {/* TEACHER COLUMN */}
                <div className="battle-column teacher-column">
                    <motion.div
                        className="char-card teacher-card"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                    >
                        <div className="sprite-container">
                            <div className="aura-glow teacher-aura" />
                            <motion.div
                                animate={{ y: [0, 5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                style={{ width: '110px' }}
                            >
                                <Teacher3D handState={teacherHandState} />
                            </motion.div>
                        </div>

                        <div className="char-name" style={{ fontSize: '1.2rem', color: '#ff2a6d' }}>
                            {currentStageData.teacher.split('Andar')[0].trim()}
                        </div>

                        <div className="ki-baat-bubble">
                            {currentStageData.teacher.split('Andar')[1] ? `Andar${currentStageData.teacher.split('Andar')[1]}` : 'Ready for class?'}
                        </div>

                        <div className="stat-group mt-4">
                            <div className="stat-header">
                                <span>Patience</span>
                                <span>{teacherHP}%</span>
                            </div>
                            <div className="progress-base">
                                <motion.div
                                    className="progress-fill patience-fill"
                                    animate={{ width: `${teacherHP}%` }}
                                />
                            </div>
                        </div>

                        {turn === 'teacher' && <div className="mt-3 text-danger fw-bold animate-pulse">Running Class...</div>}
                    </motion.div>
                </div>
            </div>

            {/* PROJECTILE LAYER */}
            <AnimatePresence>
                {activeProjectile && (
                    <motion.div
                        className="projectile"
                        initial={{ left: activeProjectile.start, top: '40%', opacity: 0, scale: 0.5 }}
                        animate={{
                            left: activeProjectile.end,
                            top: ['40%', '10%', '40%'], // Dramatic Bow (Arc)
                            opacity: 1,
                            scale: 2,
                            rotate: 360
                        }}
                        exit={{ opacity: 0, scale: 2.5 }}
                        transition={{
                            left: { duration: 0.8, ease: "linear" },
                            top: { duration: 0.8, ease: "easeOut" },
                            opacity: { duration: 0.2 },
                            rotate: { duration: 0.8, ease: "linear" }
                        }}
                        style={{ position: 'absolute', pointerEvents: 'none', zIndex: 100 }}
                    >
                        {/* Render Styled Pencil Instead of Emoji */}
                        {activeProjectile.start === '30%' ? (
                            <div className="pencil-sword" style={{ position: 'relative', bottom: '0', left: '0', transform: 'none' }} />
                        ) : (
                            <div className="grading-pen" style={{ position: 'relative', bottom: '0', left: '0', transform: 'none' }} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DAMAGE POPUP LAYER */}
            <AnimatePresence>
                {damageNumber && (
                    <motion.div
                        className="damage-popup"
                        initial={{ opacity: 0, y: 0, x: damageNumber.x }}
                        animate={{ opacity: 1, y: -100 }}
                        exit={{ opacity: 0 }}
                        style={{ left: damageNumber.x, top: damageNumber.y, color: damageNumber.color, position: 'absolute', fontWeight: 'bold', fontSize: '1.5rem', zIndex: 20 }}
                    >
                        {damageNumber.val}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BattleArena;
