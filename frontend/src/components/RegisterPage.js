import Logo from "../static/logo-text-color.png";
import React, { useState } from 'react';
import './RegisterPage.css';
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        age: '',
        sex: '',
        nationality: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate("/chat");
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="register-container">
            <img src={Logo} alt="Logo" className="logo" />
            <form onSubmit={handleSubmit} className="register-form">
                <input 
                    type="text" 
                    name="username" 
                    value={formData.username} 
                    onChange={handleInputChange} 
                    placeholder="Username"
                    className="register-input"
                    required
                />
                <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    placeholder="Password"
                    className="register-input"
                    required
                />
                <input 
                    type="password" 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleInputChange} 
                    placeholder="Confirm Password"
                    className="register-input"
                    required
                />
                <input 
                    type="number" 
                    name="age" 
                    value={formData.age} 
                    onChange={handleInputChange} 
                    placeholder="Age"
                    className="register-input"
                    required
                />
                <select 
                    name="sex" 
                    value={formData.sex} 
                    onChange={handleInputChange} 
                    className="register-input"
                    required
                >
                    <option value="">Select Sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <input 
                    type="text" 
                    name="nationality" 
                    value={formData.nationality} 
                    onChange={handleInputChange} 
                    placeholder="Nationality"
                    className="register-input"
                    required
                />
                <button type="submit" className="register-button">Register</button>
            </form>
            <div className="login-link">
                Already have an account? <a href="/login">Login</a>
            </div>
        </div>
    );
};

export default RegisterPage;
