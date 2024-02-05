import React, { useState, useEffect, useRef } from "react";
import "./HomePage.css";
import { leapfrog } from "ldrs";
leapfrog.register();

const HomePage = () => {
    return (
        <div className="home-container main-container">
            <h1>Home Page</h1>
        </div>
    );

};
export default HomePage;