import React from "react";
import "./DetailsCard.css";
import Logo from "../static/logo.png";

const DetailsCard = () => {
  return (
    <div class="card">
      <div class="first-content flex flex-col">
        <img src={Logo} alt="logo" className="w-36 h-28" />
        <p>Detail 1</p>
      </div>
      <div class="second-content">
        <p className="text-sm font-bold p-5 text-white">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
          recusandae autem enim quos sequi possimus, ea ullam itaque perferendis
          quod repudiandae ipsum tempora officia reprehenderit repellendus nihil
          et voluptatum inventore.
        </p>
      </div>
    </div>
  );
};

export default DetailsCard;
