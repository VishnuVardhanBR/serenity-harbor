import React, { useState, useEffect, useRef } from "react";
import "./HomePage.css";
import NavBar from "./NavBar";
import Section from "./Section";
import Description from "./Description";
import Features from "./Features";
import Footer from "./Footer";
import { leapfrog } from "ldrs";
import Logo from "../../static/logo-text.png";

leapfrog.register();

const HomePage = () => {
	return (
		<div className="w-full relative min-h-[100vh] flex flex-col items-center">
			<NavBar />
			<Section />
			<Description />
			<Features />
			<Footer />
		</div>
	);
};
export default HomePage;
