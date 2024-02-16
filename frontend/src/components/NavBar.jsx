import React from 'react'
import Logo from "../static/logo-color-righttext.png";
import { Button } from "@mantine/core";
import { useNavigate } from 'react-router-dom';
const NavBar = () => {
    const navigate = useNavigate();
  return (
      <div className="w-[100%] fixed top-0 flex justify-center items-center z-50 bg-white">
          <div className='w-[70%] flex justify-between'>
          <img src={Logo} alt="logo" className="w-80 pt-1" />
          {/* <div className="flex flex-row gap-10 items-center">
              <p onClick={()=>navigate('/home')} className="text-lg font-semibold cursor-pointer text-green-500">Home</p>
              <p onClick={()=>navigate('/chat')} className="text-lg font-semibold cursor-pointer text-green-500">Chat</p>
              <p onClick={()=>navigate('/contact')} className="text-lg font-semibold cursor-pointer text-green-500">Contact</p>
          </div> */}
        <div className="flex flex-row mt-10 h-fit gap-5 items-center">
          <Button
            variant="gradient"
            gradient={{ from: "green", to: "teal", deg: 360 }}
            onClick={()=>navigate('/login')}
          >
            Login
          </Button>
          <Button variant="outline" color="teal" onClick={()=>navigate('/register')}>
            Sign Up
          </Button>
              </div>
              </div>
      </div>
  )
}

export default NavBar;
