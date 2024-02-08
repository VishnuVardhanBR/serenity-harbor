import React from "react";
import Logo from "../static/logo-text.png";
import { Button } from "@mantine/core";
import { IoMdChatbubbles } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Section = () => {
    const navigate= useNavigate()
  return (
    <div className="w-full bg-gray-200 flex justify-center items-center mt-[115px]">
      <div className="w-[60%] flex justify-center items-center gap-5">
        <div className="flex flex-col w-1/2 gap-2 items-center">
          <p className="text-2xl font-semibold leading-[2]">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa
            maxime cumque nemo eius quidem dolores dolor nam nulla ducimus
            deleniti distincti
          </p>
          <p className="text-base font-base">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa
            maxime cumque nemo eius quidem dolores dolor n
          </p>
          <Button
            leftSection={<IoMdChatbubbles />}
            variant="gradient"
                      className="w-[50%] rounded-lg mt-2"
            onClick={()=>navigate('/chat')}
            style={{ width: "50%", borderRadius: "15px" }}
            gradient={{ from: "green", to: "teal", deg: 360 }}
          >
            Start Chatting
          </Button>
        </div>
        <div className="w-1/2">
          <img src={Logo} alt="logo" className=" w-5/6 h-full" />
        </div>
      </div>
    </div>
  );
};

export default Section;
