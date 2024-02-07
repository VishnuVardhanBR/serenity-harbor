import React, { useState, useEffect, useRef } from "react";
import "./LandingPage.css";
import { leapfrog } from "ldrs";
import Logo from "../static/logo.png";
import { Button } from "@mantine/core";
import DetailsCard from "../components/DetailsCard";
leapfrog.register();

const LandingPage = () => {
  const data = [1, 2, 3, 4, 5];
  return (
    <div className="w-full min-h-[100vh] flex flex-col items-center">
      <div className="w-[70%] flex justify-between">
        <img src={Logo} alt="logo" className="w-36 h-28" />
        <div className="flex flex-row mt-10 h-fit gap-5 items-center">
          <Button
            variant="gradient"
            gradient={{ from: "green", to: "teal", deg: 360 }}
          >
            Login
          </Button>
          <Button variant="outline" color="teal">
            Sign Up
          </Button>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center gap-5">
        <p className="text-4xl font-bold text-green-500">
          Welcome to the chat app
        </p>
        <p className="text-2xl text-green-500">
          Login or sign up to start chatting
        </p>
      </div>
      <div className="w-full mt-10 flex justify-center items-center">
        <div className="w-full grid grid-cols-3 gap-16">
          {data.map((item) => (
            <DetailsCard />
          ))}
        </div>
      </div>
    </div>
  );
};
export default LandingPage;
