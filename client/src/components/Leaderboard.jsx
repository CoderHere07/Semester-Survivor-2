import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { ChevronLeft, Search, Trophy, Medal, Star } from 'lucide-react';
import '../styles/Leaderboard.css';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get('/api/game/leaderboard');
                setLeaders(res.data || []);
                setIsLoading(false);
            } catch (err) {
                console.error(err);
                setIsLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const filteredLeaders = leaders.filter(leader =>
        leader.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="leaderboard-page-container">
            {/* Back Button */}
            <Link to="/" className="btn-back-hub">
                <ChevronLeft size={18} /> RETURN TO COMMAND CENTER
            </Link>

            <div className="leaderboard-content">
                <div className="leaderboard-glass-card">
                    <header className="leaderboard-header">
                        <h1 className="leaderboard-title">DEAN'S LIST</h1>
                        <p className="small opacity-70 uppercase ls-2">HALL OF ACADEMIC FAME // TOP SURVIVORS</p>
                    </header>

                    {/* Search Field */}
                    <div className="leaderboard-search-group">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            className="leaderboard-search-input"
                            placeholder="Search for your rivals..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Rankings List */}
                    <div className="rankings-scroll-area">
                        {isLoading ? (
                            <div className="text-center p-5 opacity-50">Tracing records...</div>
                        ) : filteredLeaders.length > 0 ? (
                            <div className="leaderboard-table-header">
                                <span className="header-rank">#</span>
                                <span className="header-name">STUDENT</span>
                                <span className="header-gpa">GPA</span>
                                <span className="header-score">SEMESTER</span>
                            </div>
                        ) : null}

                        {isLoading ? null : filteredLeaders.length > 0 ? (
                            filteredLeaders.map((leader, index) => (
                                <div key={index} className="rank-item">
                                    <div className="rank-num-box">
                                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                                    </div>
                                    <div className="rank-name-box">
                                        {leader.username}
                                    </div>
                                    <div className="rank-gpa-box">
                                        {leader.gpa?.toFixed(2) || '4.00'}
                                    </div>
                                    <div className="rank-score-box">
                                        Semester {leader.highScore || 1}
                                    </div>
                                </div>
                            ))
                        ) : (
                            !isLoading && <div className="text-center p-5 opacity-50">No academic matches found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
