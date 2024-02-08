import React from 'react'
import Logo from '../static/logo-text.png'
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";

const Footer = () => {
  return (
      <div className='w-full bg-white flex justify-between items-center p-5 pl-20 pr-20'>
          <img src={Logo} alt='logo' className='w-20 h-20' />
          <div className='flex gap-10'>
              <p className='text-base font-medium'>About</p>
              <p className='text-base font-medium'>Contact</p>
              <p className='text-base font-medium'>Privacy Policy</p>
          </div>
          <div className='flex gap-5'>
              <FaLinkedin size={30} />
              <FaGithub size={30} />
                <FaInstagramSquare size={30} />
              </div>
    </div>
  )
}

export default Footer
