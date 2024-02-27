import React, { useState, useEffect } from "react";
import ChatPage from "./components/ChatPage";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage/HomePage";
import AdminPage from "./components/AdminPage";
import LandingPage from "./components/LandingPage";
import RegisterPage from "./components/RegisterPage";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingOverlay from "./components/LoadingOverlay";
import Dashboard from "./components/Dashboard";

export default function App() {
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
	const [isLoginStatusChecked, setIsLoginStatusChecked] = useState(false);
	const [userType, setUserType] = useState(null);

	useEffect(() => {
		const verifyToken = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				setIsLoginStatusChecked(true);
				return;
			}

			try {
				const response = await fetch(process.env.REACT_APP_BACKEND_HOST+"/verify_token", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ token }),
				});

				if (response.ok) {
					setIsUserLoggedIn(true);
					const responseData = await response.json();
					console.log(responseData);
					setUserType(responseData.usertype);
				}
			} catch (error) {
				console.error("Error verifying token:", error);
			}
			setIsLoginStatusChecked(true);
		};

		verifyToken();
	}, []);

	if (!isLoginStatusChecked) {
		return <LoadingOverlay />;
	}

	return (
		<div>
			<Routes>
				<Route
					path="/"
					element={isUserLoggedIn ? <Navigate to="/dashboard" /> : <HomePage />}
				/>
				<Route
					path="/login"
					element={isUserLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage />}
				/>
				<Route
					path="/register"
					element={isUserLoggedIn ? <Navigate to="/dashboard" /> : <RegisterPage />}
				/>

				<Route
					path="/dashboard"
					element={
						userType !== null ? (
							userType === "consumer" ? (
								<Dashboard />
							) : (
								<AdminPage />
							)
						) : (
							<HomePage />
						)
					}
				/>
				<Route
					path="/chat"
					element={
						userType !== null ? (
							userType === "consumer" ? (
								<ChatPage />
							) : (
								<AdminPage />
							)
						) : (
							<HomePage />
						)
					}
				/>
			</Routes>
		</div>
	);
}
