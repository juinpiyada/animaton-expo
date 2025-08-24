import React from 'react';
import type { Scene } from '../types';
import type { AppStateValue } from '../constants';
import { AppState } from '../constants';
import SceneCard from './SceneCard';
import Loader from './Loader';

interface StoryboardProps {
  scenes: Scene[];
  appState: AppStateValue;
  onGenerateImages: () => void;
}

const Storyboard: React.FC<StoryboardProps> = ({ scenes, appState, onGenerateImages }) => {
  if (scenes.length === 0) {
    return null;
  }

  const showGenerateImagesButton = appState === AppState.SCRIPT_READY;
  const showGeneratingImagesLoader = appState === AppState.GENERATING_IMAGES;

  return (
    <div className="w-full max-w-6xl mx-auto mt-12">
      <div className="flex justify-center mb-8">
        {showGenerateImagesButton && (
          <button onClick={onGenerateImages} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 text-lg shadow-lg">
            Generate All Images
          </button>
        )}
        {showGeneratingImagesLoader && (
          <div className="flex items-center gap-3 text-lg font-semibold text-purple-300">
            <Loader className="w-6 h-6" />
            Generating images, please wait...
          </div>
        )}
      </div>

      <div className="space-y-8">
        {scenes.map((scene, index) => (
          <SceneCard key={scene.id} scene={scene} sceneNumber={index + 1} />
        ))}
      </div>

       {appState === AppState.IMAGES_READY && (
        <div className="text-center mt-12 p-6 bg-gray-800 rounded-lg">
            <h2 className="text-3xl font-bold text-green-400">Storyboard Complete!</h2>
            <p className="text-gray-300 mt-2">Your scene images are ready. You can review each scene above.</p>
        </div>
       )}
    </div>
  );
};

export default Storyboard;
