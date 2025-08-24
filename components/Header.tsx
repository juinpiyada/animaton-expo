
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-8 md:py-12">
      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
        AI Storyboard Studio
      </h1>
      <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
        Turn your ideas into cinematic stories. Generate scripts, visualize scenes, and create video storyboards with the power of AI.
      </p>
    </header>
  );
};

export default Header;
