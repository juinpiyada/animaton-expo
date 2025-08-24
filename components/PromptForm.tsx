
import React from 'react';
import { useState } from 'react';
import Loader from './Loader';

interface PromptFormProps {
  isLoading: boolean;
  onSubmit: (prompt: string) => void;
}

const PromptForm: React.FC<PromptFormProps> = ({ isLoading, onSubmit }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-4 shadow-lg flex flex-col gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A futuristic detective story set on Mars"
          className="w-full bg-gray-700 text-white rounded-md p-3 h-28 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5" />
              Generating Script...
            </>
          ) : (
            'Generate Script'
          )}
        </button>
      </form>
    </div>
  );
};

export default PromptForm;
