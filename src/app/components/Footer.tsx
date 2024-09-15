import React from 'react';
import Link from 'next/link';
import { FiGithub, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center">
              <span className="text-4xl font-extrabold tracking-wide uppercase">H</span>
              <svg className="w-6 h-6 text-indigo-500 mx-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L1.5 22h21L12 2z" />
              </svg>
              <span className="text-4xl font-extrabold tracking-wide uppercase">L</span>
            </Link>
            <p className="text-sm text-gray-400">Software Engineer</p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/hamza-lachgar-068a90275/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiLinkedin size={20} />
              </a>
              <a href="https://github.com/hamzalach02" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiGithub size={20} />
              </a>
              <a href="https://www.instagram.com/haamza.lach/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase mb-4">Navigation</h3>
            <ul className="space-y-2">
              {['Projects', 'Skills', 'Education', 'Feedback', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400 text-sm">
                <FiMail size={16} className="mr-2" />
                <a href="mailto:lachhamza02@gmail.com" className="hover:text-white transition-colors">lachhamza02@gmail.com</a>
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <FiPhone size={16} className="mr-2" />
                <a href="tel:+212636920046" className="hover:text-white transition-colors">+212 6 36 92 00 46</a>
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <FiMapPin size={16} className="mr-2" />
                <span>Massira III, Marrakech, Morocco</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400 text-center">
            © {currentYear} Hamza Lachgar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;