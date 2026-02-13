import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock } from 'lucide-react';
import Student3D from './Student3D';
import Teacher3D from './Teacher3D';
import '../styles/Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const { username, password } = formData;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    // Impact flash state
    const [flash, setFlash] = useState(false);

    useEffect(() => {
        const flashInterval = setInterval(() => {
            setFlash(true);
            setTimeout(() => setFlash(false), 200);
        }, 4500);
        return () => clearInterval(flashInterval);
    }, []);

    useEffect(() => {
        if (isSuccess || user) {
            navigate('/');
        }
        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const userData = { username, password };
        dispatch(login(userData));
    };

    return (
        <div className="login-page-container">
            <motion.h1
                className="main-game-title"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                SEMESTER SURVIVAL
            </motion.h1>
            {/* Background Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="particle"
                    initial={{
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
                        scale: Math.random() * 0.5 + 0.5,
                        opacity: Math.random() * 0.3 + 0.1
                    }}
                    animate={{
                        y: [null, Math.random() * -150 - 50],
                        opacity: [null, 0]
                    }}
                    transition={{
                        duration: Math.random() * 6 + 4,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        width: Math.random() * 8 + 4 + 'px',
                        height: Math.random() * 8 + 4 + 'px',
                    }}
                />
            ))}

            {/* Battle Preview Section */}
            <div className="battle-preview-section">
                {/* Student Side */}
                <motion.div
                    className="character-card"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    <h3 className="character-heading">STUDENT</h3>
                    <motion.div
                        className="character-sprite-container"
                        animate={{ y: [0, -12, 0], scale: [1, 1.03, 1] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div className="aura-glow aura-student"></div>
                        <Student3D />
                    </motion.div>
                    <div className="character-shadow"></div>
                </motion.div>

                {/* VS Element */}
                <div className="vs-element-container">
                    <AnimatePresence>
                        {flash && (
                            <motion.div
                                className="vs-flash-effect"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 0.6, scale: 1.8 }}
                                exit={{ opacity: 0 }}
                            />
                        )}
                    </AnimatePresence>

                    <motion.div
                        className="vs-burst-bg"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    >
                        <svg viewBox="0 0 100 100" width="280" height="280">
                            <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="#FFD700" opacity="0.4" />
                        </svg>
                    </motion.div>

                    <motion.h1
                        className="vs-text"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: 1,
                            scale: flash ? 1.15 : 1
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.5
                        }}
                    >
                        VS
                    </motion.h1>

                </div>

                {/* Teacher Side */}
                <motion.div
                    className="character-card"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    <h3 className="character-heading">TEACHER</h3>
                    <motion.div
                        className="character-sprite-container"
                        animate={{ y: [0, -12, 0], scale: [1, 1.03, 1] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                        <div className="aura-glow aura-teacher"></div>
                        <Teacher3D />
                    </motion.div>
                    <div className="character-shadow"></div>
                </motion.div>
            </div>

            {/* Login Card */}
            <motion.div
                className="login-card-battle"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            >
                <div className="enter-battle-heading">
                    <span className="heading-text">ENTER THE BATTLE</span>
                    <div className="btn-shine"></div>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="input-battle-group">
                        <User className="input-icon" size={22} />
                        <input
                            type="text"
                            className="input-battle"
                            name="username"
                            value={username}
                            onChange={onChange}
                            placeholder="Enter Student Username"
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="input-battle-group">
                        <Lock className="input-icon" size={22} />
                        <input
                            type="password"
                            className="input-battle"
                            name="password"
                            value={password}
                            onChange={onChange}
                            placeholder="Enter Password"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <AnimatePresence>
                        {isError && (
                            <motion.div
                                className="error-message-battle mb-3"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                style={{ color: '#ff2a6d', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }}
                            >
                                ⚠️ {message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        type="submit"
                        className="btn-start-battle"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                    >
                        <span className="btn-text">{isLoading ? 'LOADING...' : 'START THE BATTLE ⚔️'}</span>
                        <div className="btn-shine"></div>
                    </motion.button>
                </form>

                <div className="register-link-container">
                    <p className="register-text">
                        New recruit? <Link to="/register" className="register-link">Register here</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
