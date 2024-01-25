import Logo from "../static/logo-text-color.png";
import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            if (data.status === 'User logged in successfully') {
                localStorage.setItem('token', data.token);
                navigate("/home");
			    window.location.reload();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="login-container">
            <img src={Logo} alt="Logo" className="logo" />
            <form onSubmit={handleLogin} className="login-form">
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Username"
                    className="login-input"
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password"
                    className="login-input"
                />
                <button type="submit" className="login-button">Login</button>
            </form>
            <div className="register-link">
                New Here? <a href="/register">Register</a>
            </div>

        </div>
    );
};

export default LoginPage;
