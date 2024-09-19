"use client";
import React, { useState, useEffect } from 'react';
import { FiExternalLink, FiGithub } from 'react-icons/fi';

interface Project {
  title: string;
  description: string;
  imageUrl: string;
  github: string;
  live: string;
}

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
 
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`/api/projects`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 sm:text-4xl">
            My Projects
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <div key={index} className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md flex flex-col h-full">
              <img src={`${project.imageUrl}`} alt={project.title} className="w-full h-48 object-cover rounded-t-lg" />
              <div className="flex-1 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{project.title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{project.description}</p>
              </div>
              <div className="p-6 bg-gray-300 dark:bg-gray-700 rounded-b-lg">
                <div className="flex justify-between">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1">
                    <FiGithub className="w-6 h-6" />
                    <span>GitHub</span>
                  </a>
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1">
                    <FiExternalLink className="w-6 h-6" />
                    <span>Live Demo</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
