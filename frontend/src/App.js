import React, { useState, useEffect } from "react";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingOverlay from "./components/LoadingOverlay";
import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';

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
        const response = await fetch("http://localhost:8080/verify_token", {
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
            element={isUserLoggedIn ? <Navigate to="/home" /> : <LandingPage />}
          />
          <Route
            path="/login"
            element={isUserLoggedIn ? <Navigate to="/home" /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={
              isUserLoggedIn ? <Navigate to="/home" /> : <RegisterPage />
            }
          />
          <Route
            path="/home"
            element={
            //   userType !== null ? (
            //     userType === "consumer" ? (
                  <HomePage />
                /* ) : (
                  <AdminPage />
                )
              ) : (
                <LoginPage />
              ) */}
            // {/* } */}
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
                <LoginPage />
              )
            }
          />
        </Routes>
      </div>
  );
}
