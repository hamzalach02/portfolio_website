import React from 'react';
import { FiUser, FiBook, FiCalendar, FiAward } from 'react-icons/fi';

const EducationSection = () => {
  const educationData = [
    {
      year: '2020',
      degree: 'High School Diploma',
      icon: <FiAward className="w-6 h-6 text-indigo-500" />
    },
    {
      year: '2020-2022',
      degree: 'Preparatory Years',
      icon: <FiBook className="w-6 h-6 text-indigo-500" />,
      details: [
        'First Year: Foundations in Science and Languages, Practical Work.',
        'Second Year: Communication, Economics, Algorithms, Databases, Projects.'
      ]
    },
    {
      year: '2022 - 2025',
      degree: 'Engineering Cycle (MIAGE)',
      icon: <FiAward className="w-6 h-6 text-indigo-500" />,
      details: [
        'The MIAGE option combines computer science and management to train versatile experts.',
        'From programming to information systems management, it opens opportunities in business intelligence.'
      ]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900  ">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 sm:text-4xl">
            About Me & Education
          </h2>
        </div>
        
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gray-200 dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <div className="flex items-center mb-4">
                <FiUser className="w-8 h-8 text-indigo-500 mr-4" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  About Me
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                I am a 22-year-old 4th-year software engineering student with a strong passion for technology and software development. My motivation for building projects from scratch has driven me to continuously learn and improve my skills.
              </p>
            </div>
          </div>
          
          <div className="mt-12 bg-gray-200 dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <div className="flex items-center mb-6">
                <FiBook className="w-8 h-8 text-indigo-500 mr-4" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Education
                </h3>
              </div>
              <div className="space-y-8">
                {educationData.map((edu, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 mr-4">
                      {edu.icon}
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <FiCalendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{edu.year}</span>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{edu.degree}</h4>
                      {edu.details && (
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1">
                          {edu.details.map((detail, i) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationSection;