import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate(); 

    const handleLogin = async () => {
        try {
            const res = await axios.post<{ token: string }>('http://localhost:4000/api/auth/login', { username, password });

            localStorage.setItem('token', res.data.token);
            Swal.fire({
                icon: 'success',
                title: 'Logged in successfully',
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/home');
        } catch (err: any) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Login failed',
                text: err.response?.data?.msg || 'An error occurred during login',
            });
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                />
                <div style={{ paddingBottom: '20px', paddingTop: '20px' }}>
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </div>
                <button onClick={handleLogin} className="login-button">
                    Login
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
