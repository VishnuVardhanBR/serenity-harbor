import React from "react";
import "./DetailsCard.css";
//import Logo from "../static/logo.png";

const DetailsCard = (props) => {
  return (
    <div className="w-full flex flex-col gap-5 justify-center items-center">
      <div className="w-20 h-20 flex justify-center bg-gray-50 rounded-full items-center">
        <props.logo className="w-10 h-10" />
        </div>
      <div className="w-[80%] flex flex-col gap-5 justify-center items-center">
        <p className="text-xl font-semibold">{props.title}</p>
        <p className="text-base font-semibold">{props.description}</p>
      </div>
    </div>
  );
};

export default DetailsCard;
