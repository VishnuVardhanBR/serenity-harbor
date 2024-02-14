import Logo from "../static/logo-text-color.png";
import LoadingOverlay from "./LoadingOverlay"
import React, { useState, useEffect } from "react";
import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
	const [selectedTab, setSelectedTab] = useState("consumer");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		confirmPassword: "",
		age: "",
		sex: "",
		nationality: "",
		usertype: "consumer",
	});
	const [nationalities, setNationalities] = useState([]);

	useEffect(() => {
		fetch(
			"https://gist.githubusercontent.com/marijn/274449/raw/736f7650be6cffd67750a50aa3998a03c19802c5/nationalities.csv"
		)
			.then((response) => response.text())
			.then((text) => {
				const nations = text.split(",");
				setNationalities(nations);
			})
			.catch((error) => console.error("Error fetching nationalities:", error));
	}, []);

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		setLoading(true);
        e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			alert("Passwords don't match");
			setLoading(false);
			return;
		}
		try {
			const response = await fetch(process.env.REACT_APP_BACKEND_HOST+"/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				throw new Error("Registration failed");
			}

			const data = await response.json();
			localStorage.setItem("token", data.token);
			navigate("/home");
			window.location.reload();
		} catch (error) {
			console.error("Error:", error);
			setLoading(false);			
		}
	};

	return (
		<div className="register-container main-container">
			{loading && <LoadingOverlay/>}
			<div className="tabs">
				<div
					className={`tab ${selectedTab === "consumer" ? "active" : ""}`}
					onClick={() => {
						setSelectedTab("consumer");
						setFormData({ ...formData, usertype: "consumer" });
					}}
				>
					General
				</div>
				<div
					className={`tab ${selectedTab === "admin" ? "active" : ""}`}
					onClick={() => {
						setSelectedTab("admin");
						setFormData({ ...formData, usertype: "admin" });
					}}
				>
					Admin
				</div>
			</div>
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
				{selectedTab === "consumer" && (
					<>
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
						<select
							name="nationality"
							value={formData.nationality}
							onChange={handleInputChange}
							className="register-input"
							required
						>
							<option value="">Select Nationality</option>
							{nationalities.map((nation, index) => (
								<option key={index} value={nation}>
									{nation}
								</option>
							))}
						</select>
					</>
				)}
				<button type="submit" className="register-button">
					Register
				</button>
			</form>
			<div className="login-link">
				Already have an account? <a href="/login">Login</a>
			</div>
		</div>
	);
};

export default RegisterPage;
