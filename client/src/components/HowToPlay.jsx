import { Link } from 'react-router-dom';
import { ChevronLeft, Target, BookOpen, Zap } from 'lucide-react';
import '../styles/HowToPlay.css';

const HowToPlay = () => {
    return (
        <div className="how-to-play-container">
            {/* Back Button */}
            <Link to="/" className="btn-back-hub">
                <ChevronLeft size={18} /> RETURN TO COMMAND CENTER
            </Link>

            <div className="guide-content">
                <div className="guide-card">
                    <header className="guide-header">
                        <h1 className="guide-title">ACADEMIC SURVIVAL GUIDE</h1>
                        <p className="guide-subtitle">PROTOCOL FOR SEMESTER GRADUATION // 8 STAGES OF COMBAT</p>
                    </header>

                    <div className="mechanic-grid">
                        {/* 1. ENERGY */}
                        <div className="mechanic-item">
                            <span className="mechanic-icon">🔋</span>
                            <div className="mechanic-label" style={{ color: '#00d4ff' }}>Energy (HP)</div>
                            <p className="mechanic-desc">
                                Your mental battery. If it hits <b>0%</b>, you fall asleep in class and fail the semester automatically.
                            </p>
                            <p className="small opacity-50 italic mt-2">
                                Restore by taking "Sleep" breaks or using "Coffee" powerups.
                            </p>
                        </div>

                        {/* 2. STRESS */}
                        <div className="mechanic-item">
                            <span className="mechanic-icon">🤯</span>
                            <div className="mechanic-label" style={{ color: '#ff2a6d' }}>Stress Level</div>
                            <p className="mechanic-desc">
                                Increases as Teachers launch academic attacks. If your Stress reaches <b>100%</b>, you drop out.
                            </p>
                            <p className="small opacity-50 italic mt-2">
                                Lower Stress by using "Study" or "Relax" tactics during combat.
                            </p>
                        </div>

                        {/* 3. COMBAT */}
                        <div className="mechanic-item">
                            <span className="mechanic-icon">⚔️</span>
                            <div className="mechanic-label" style={{ color: '#00ff88' }}>Victory Path</div>
                            <p className="mechanic-desc">
                                Deplete the Teacher's HP to <b>0%</b> by using Assignments, Quizzes, and Exams to pass the level.
                            </p>
                            <p className="small opacity-50 italic mt-2">
                                Each move uses Energy. Manage your turn resources carefully.
                            </p>
                        </div>
                    </div>

                    <div className="tips-section">
                        <div className="tips-title">SURVIVAL TACTICS</div>
                        <ul className="tips-list">
                            <li className="tip-pill">
                                <Target size={18} color="#00d4ff" />
                                <span>DON'T SPAM ATTACKS</span>
                            </li>
                            <li className="tip-pill">
                                <BookOpen size={18} color="#00ff88" />
                                <span>BOOST PREPARATION</span>
                            </li>
                            <li className="tip-pill">
                                <Zap size={18} color="#ffb86b" />
                                <span>COFFEE IS CRITICAL</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HowToPlay;
