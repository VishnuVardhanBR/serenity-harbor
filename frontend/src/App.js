import React, { useState, useEffect } from 'react';
import ChatPage from "./components/ChatPage";
import LoginPage from "./components/LoginPage";
import AdminPage from "./components/AdminPage";
import RegisterPage from "./components/RegisterPage";
import { Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [isLoginStatusChecked, setIsLoginStatusChecked] = useState(false);
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoginStatusChecked(true);
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/verify_token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                if (response.ok) {
                    setIsUserLoggedIn(true);
                    setUserType(response.json()['usertype'])
                }
            } catch (error) {
                console.error('Error verifying token:', error);
            }
            setIsLoginStatusChecked(true);
        };

        verifyToken();
    }, []);


    if (!isLoginStatusChecked) {
        return <div>Loading...</div>; 
    }

    return (
        <div>
            <Routes>
                <Route path="/" element={isUserLoggedIn ? <Navigate to="/home" /> : <LoginPage />} />
                <Route path="/login" element={isUserLoggedIn ? <Navigate to="/home" /> : <LoginPage />} />
                <Route path="/register" element={isUserLoggedIn ? <Navigate to="/home" /> : <RegisterPage />} />
                <Route path="/home" element={userType!== null ?userType === 'consumer' ? <ChatPage /> : <AdminPage />:<LoginPage/>} />
            </Routes>
        </div>
    );
}
