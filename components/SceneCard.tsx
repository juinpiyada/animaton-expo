import React from 'react';
import type { Scene } from '../types';
import Loader from './Loader';

interface SceneCardProps {
  scene: Scene;
  sceneNumber: number;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene, sceneNumber }) => {
  const getStatusBorderColor = (status: 'idle' | 'loading' | 'done' | 'error') => {
    switch (status) {
      case 'loading': return 'border-yellow-500';
      case 'done': return 'border-green-500';
      case 'error': return 'border-red-500';
      default: return 'border-gray-600';
    }
  };

  const MediaDisplay: React.FC = () => {
    if (scene.imageStatus === 'loading') {
      return (
        <div className="w-full h-full bg-black/50 flex items-center justify-center">
          <Loader className="w-10 h-10" />
        </div>
      );
    }
    
    if (scene.imageBase64) {
      return (
        <img 
          src={`data:image/jpeg;base64,${scene.imageBase64}`} 
          alt={scene.imagePrompt} 
          className="w-full h-full object-cover"
        />
      );
    }
    
    // Placeholder
    return (
      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
        <p className="text-gray-400">Image will appear here</p>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className={`aspect-video w-full border-r-2 ${getStatusBorderColor(scene.imageStatus)}`}>
          <MediaDisplay />
        </div>
        <div className="p-6 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-indigo-400 mb-2">Scene {sceneNumber}</h3>
          <p className="text-gray-300">{scene.description}</p>
          {scene.imageStatus === 'error' && <p className="text-red-400 mt-2 font-semibold">Image generation failed.</p>}
        </div>
      </div>
    </div>
  );
};

export default SceneCard;
