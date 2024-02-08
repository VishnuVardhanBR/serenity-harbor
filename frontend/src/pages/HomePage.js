import React, { useState, useEffect, useRef } from "react";
import "./HomePage.css";
// import { leapfrog } from "ldrs";
import NavBar from "../components/NavBar";
import Section from "../components/Section";
import Description from "../components/Description";
import Features from "../components/Features";
import Slides from "../components/Slides";
import '@mantine/core/styles.css';
import Footer from "../components/Footer";
// leapfrog.register();

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