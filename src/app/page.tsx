"use client"
import React, { useState } from 'react';
import EducationSection from "./components/Education";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import ProjectsSection from "./components/Projects";
import SkillsSection from "./components/Skills";
import Contact from './components/Contact';
import Footer from './components/Footer';
import Head from 'next/head';


export default function Home() {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const toggleFeedbackForm = () => {
    setShowFeedbackForm(!showFeedbackForm);
  };

  return (
    <>
      <Head>
          
          <link rel="shortcut icon" href="/ico.png" />
        </Head>
      <div>
        <Navbar />
        <Hero />
        <section id="projects">
          <ProjectsSection />
        </section>
        <section id="skills">
          <SkillsSection />
        </section>
        <section id="education">
          <EducationSection />
        </section>
        <section id="feedback" className="bg-white dark:bg-gray-900 p-4 flex flex-col gap-2 justify-center items-center">
          <FeedbackList />
          {showFeedbackForm && <FeedbackForm />}
          <button
          onClick={toggleFeedbackForm}
          className={`mt-4 mb-4 px-6 py-2 rounded-lg shadow-md transition-colors duration-300 ease-in-out ${
            showFeedbackForm ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white font-semibold`}
        >
          {showFeedbackForm ? 'Cancel' : 'Add Feedback'}
        </button>
         
        </section>
        <section id='contact'>
          <Contact/>
        </section>
        <Footer/>
      </div>
    </>
  );
}