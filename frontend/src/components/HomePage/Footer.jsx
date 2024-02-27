import React from 'react';
import Logo from '../../static/logo-text.png';

import { FaLinkedin, FaGithub, FaXTwitter,FaYoutube} from 'react-icons/fa6';
const Footer = () => {
  return (
    <footer className='w-full bg-white flex justify-between items-center p-5 pl-20 pr-20'>
      <img src={Logo} alt='logo' className='w-20 h-20' />
      <div className='flex gap-10'>
        {/* <p className='text-base font-medium'>About</p>
        <p className='text-base font-medium'>Contact</p>
        <p className='text-base font-medium'>Privacy Policy</p> */}
        <a href='mailto:serenityharborteam@gmail.com' className='text-base font-medium'>Contact Us</a>
      </div>
      <div className='flex gap-5'>
        <a href='https://www.linkedin.com/company/99359987/' target='_blank' rel='noopener noreferrer'><FaLinkedin size={30} /></a>
        <a href='https://github.com/Serenity-Harbor/' target='_blank' rel='noopener noreferrer'><FaGithub size={30} /></a>
        <a href='https://www.youtube.com/@serenityharborteam' target='_blank' rel='noopener noreferrer'><FaYoutube size={30} /></a>
        <a href='https://twitter.com/Serenity_Harbor' target='_blank' rel='noopener noreferrer'><FaXTwitter size={30} /></a>
      </div>
    </footer>
  );
};

export default Footer;
