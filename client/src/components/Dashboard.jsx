import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { logout, loadUser } from '../store/authSlice';
import { resetGame, setGameState } from '../store/gameSlice';
import { STAGES } from '../gameData';
import axios from 'axios';
import Student3D from './Student3D';
import Teacher3D from './Teacher3D';
import { Zap, LogOut } from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { stage, isGameOver, gpa } = useSelector((state) => state.game);
    const [leaders, setLeaders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const currentStageData = STAGES.find(s => s.id === stage) || STAGES[0];

    // Mock calculations or derived stats
    const userRank = leaders.findIndex(l => l.username === user?.username) + 1 || 12;

    useEffect(() => {
        dispatch(loadUser());
        const loadDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const res = await axios.get('http://localhost:5001/api/game', {
                        headers: { 'x-auth-token': token }
                    });
                    if (res.data) dispatch(setGameState(res.data));
                }

                const leadersRes = await axios.get('http://localhost:5001/api/game/leaderboard');
                setLeaders(leadersRes.data || []);
                setIsLoading(false);
            } catch (err) {
                console.error("Dashboard Load Error:", err);
                setIsLoading(false);
            }
        };
        loadDashboardData();
    }, [dispatch]);


    const onLogout = () => {
        dispatch(logout());
        dispatch(resetGame());
        navigate('/login');
    };

    if (isLoading) return null;

    return (
        <div className="dashboard-container">
            {/* Minimal Header */}
            <header className="dashboard-top-nav w-100 d-flex justify-content-between align-items-center mb-4" style={{ zIndex: 100 }}>
                <h1 className="dashboard-title m-0" style={{ fontSize: '1.8rem', letterSpacing: '4px' }}>SEMESTER SURVIVOR</h1>
                <div className="dashboard-logout-link m-0" onClick={onLogout} style={{ cursor: 'pointer' }}>
                    <LogOut size={16} /> Logout
                </div>
            </header>

            <div className="command-center-grid mt-2">

                {/* 1. STUDENT PROFILE CARD */}
                <div className="dashboard-card">
                    <div className="card-header-inner">STUDENT PROFILE</div>

                    <div className="avatar-section">
                        <div className="avatar-glow-aura" />
                        <div style={{ height: '140px', width: '140px', zIndex: 1 }}>
                            <Student3D />
                        </div>
                    </div>

                    <div className="profile-info">
                        <div className="username-text">{user?.username}</div>
                        <div className="rank-text">
                            <Zap size={14} color="#00d4ff" /> Rank #{userRank}
                        </div>
                        <div className="status-active">{isGameOver ? "EXPELLED" : "ACTIVE"}</div>

                        <div className="xp-container">
                            <div className="stat-row d-flex justify-content-between">
                                <span className="stat-label small opacity-70">Semester {stage}</span>
                                <span className="stat-label small">GPA: {gpa}</span>
                            </div>
                            <div className="progress-bar-base">
                                <div className="progress-fill-blue" style={{ width: `${(stage / 8) * 100}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. SEMESTER BATTLE CARD */}
                <div className="dashboard-card">
                    <div className="card-header-inner mb-2">SEMESTER {stage}</div>
                    <div className="small opacity-70 uppercase mb-3">Current Academic Stage</div>

                    <div className="boss-info">
                        <div className="d-flex align-items-center gap-2 text-uppercase fw-bold" style={{ fontSize: '0.85rem' }}>
                            BOSS: <span style={{ color: '#ff2a6d' }}>{currentStageData.teacher.split('Andar')[0]}</span>
                        </div>
                        <div style={{ width: '120px', height: '120px' }}>
                            <Teacher3D />
                        </div>
                    </div>

                    <div className="xp-container mb-3">
                        <div className="stat-row d-flex justify-content-between">
                            <span className="stat-label small opacity-70">Overall Progress</span>
                            <span className="stat-label small">{Math.round((stage / 8) * 100)}%</span>
                        </div>
                        <div className="progress-bar-base">
                            <div className="progress-fill-purple" style={{ width: `${(stage / 8) * 100}%` }} />
                        </div>
                    </div>

                    <motion.button
                        className="btn-enter-class"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/battle')}
                    >
                        <span>{isGameOver ? "REPEAT SEMESTER" : "ENTER CLASS ⚔️"}</span>
                    </motion.button>
                </div>

                {/* 3. HOW TO PLAY CARD */}
                <div className="dashboard-card">
                    <div className="card-header-inner">HOW TO PLAY</div>

                    <ul className="guide-list">
                        <li className="guide-item">
                            <span>⚔️</span>
                            <span><b>Attack</b> - Weaken boss HP</span>
                        </li>
                        <li className="guide-item">
                            <span>📚</span>
                            <span><b>Study</b> - Boost your defense</span>
                        </li>
                        <li className="guide-item">
                            <span>☕</span>
                            <span><b>Coffee</b> - Restore your HP</span>
                        </li>
                    </ul>

                    <Link to="/how-to-play" className="btn-guide-link">
                        Read Guide →
                    </Link>
                </div>

                {/* 4. LEADERBOARD CARD */}
                <div className="dashboard-card leaderboard-container">
                    <div className="card-header-inner">LEADERBOARD</div>

                    <div className="rankings-table">
                        {leaders.slice(0, 3).map((leader, index) => {
                            const isMe = leader.username === user?.username;
                            return (
                                <div key={index} className={`rank-row ${isMe ? 'highlight-me' : ''}`}>
                                    <div className="rank-num">
                                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                                    </div>
                                    <div className="rank-player">{leader.username} {isMe && "(You)"}</div>
                                    <div className="rank-semester opacity-70 text-end">Semester {leader.highScore || 1}</div>
                                </div>
                            );
                        })}

                        {!leaders.slice(0, 3).find(l => l.username === user?.username) && (
                            <div className="rank-row highlight-me">
                                <div className="rank-num">#{userRank}</div>
                                <div className="rank-player">{user?.username} (You)</div>
                                <div className="rank-semester opacity-70 text-end">Semester {user?.highScore || 1}</div>
                            </div>
                        )}
                    </div>

                    <Link to="/leaderboard" className="btn-guide-link d-table mx-auto mt-4 px-3">
                        VIEW FULL RANKINGS →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
