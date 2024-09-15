import React from 'react';
import { FiCode, FiUsers, FiDatabase, FiTool, FiMessageSquare, FiLayers, FiGitBranch } from 'react-icons/fi';

const SkillsSection = () => {
  const skillCategories = [
    {
      name: "Programming Languages",
      icon: <FiCode className="w-6 h-6" />,
      skills: ["Java", "PHP", "JavaScript", "Python", "C", "C++", "C#"]
    },
    {
      name: "Web Technologies",
      icon: <FiLayers className="w-6 h-6" />,
      skills: ["HTML", "CSS", "React", "Angular", "Next.js"]
    },
    {
      name: "Frameworks",
      icon: <FiTool className="w-6 h-6" />,
      skills: ["Spring Boot", "Laravel", "Flask", "Django"]
    },
    {
      name: "Databases",
      icon: <FiDatabase className="w-6 h-6" />,
      skills: ["MySQL", "PostgreSQL","MongoDb", "Oracle"]
    },
    {
      name: "DevOps",
      icon: <FiGitBranch className="w-6 h-6" />,
      skills: ["Git", "GitHub","Gitlab", "Docker","CI/CD"]
    },
    {
      name: "Behavioral Skills",
      icon: <FiUsers className="w-6 h-6" />,
      skills: ["Teamwork", "Communication", "Problem-solving", "Adaptability", "Creativity"]
    }
  ];

  return (
    <div className="bg-gray-50  dark:bg-gray-900  transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 sm:text-4xl">
            My Skills
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, index) => (
            <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 dark:bg-indigo-900 rounded-full p-3 mr-4">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex}
                      className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full px-3 py-1 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;