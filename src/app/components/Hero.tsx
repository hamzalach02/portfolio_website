"use client"
import Image from 'next/image';
import React from 'react';
import { FiGithub, FiInstagram, FiLinkedin, FiTwitter } from 'react-icons/fi';

const Hero = () => {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">Hi, I'm Hamza</span>
            <span className="block text-indigo-600 dark:text-indigo-400">Software Engineer</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Passionate about building robust and scalable applications. Experienced in Java, JavaScript, Python, and more.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <a
                href="#contact"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Get in touch
              </a>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <a
                href="#projects"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent bg-gray-200 text-base font-medium rounded-md text-indigo-600  hover:bg-gray-300 md:py-4 md:text-lg md:px-10"
              >
                View Projects
              </a>
            </div>
          </div>
          <div className="mt-8 flex justify-center space-x-6">
            <a href="https://github.com/hamzalach02" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <FiGithub className="h-6 w-6" />
            </a>
            <a href="https://www.linkedin.com/in/hamza-lachgar-068a90275/" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">LinkedIn</span>
              <FiLinkedin className="h-6 w-6" />
            </a>
            <a href="https://www.instagram.com/haamza.lach" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <FiInstagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;