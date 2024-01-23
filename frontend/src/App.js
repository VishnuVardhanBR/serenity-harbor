import React from 'react';
import ChatPage from "./components/ChatPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";

import { Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
    const isUserLoggedIn = !!localStorage.getItem('token');
    return (
        <div>
            <Routes>
                <Route path="/" element={isUserLoggedIn ? <Navigate to="/chat" /> : <LoginPage />} />
                <Route path="/login" element={isUserLoggedIn ? <Navigate to="/chat" /> : <LoginPage />} />
                <Route path="/register" element={isUserLoggedIn ? <Navigate to="/chat" /> : <RegisterPage />} />
                <Route path="/chat" element={isUserLoggedIn ? <ChatPage /> : <Navigate to="/login" />} />
            </Routes>
        </div>
    );
}
