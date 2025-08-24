import React from 'react';
import { useState, useCallback } from 'react';
import Header from './components/Header';
import PromptForm from './components/PromptForm';
import Storyboard from './components/Storyboard';
import { generateScript, generateImage } from './services/geminiService';
import type { Scene } from './types';
import { AppState } from './constants';
import type { AppStateValue } from './constants';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppStateValue>(AppState.IDLE);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [error, setError] = useState<string | null>(null);

  const updateScene = useCallback((sceneId: string, updates: Partial<Scene>) => {
    setScenes(currentScenes =>
      currentScenes.map(s => s.id === sceneId ? { ...s, ...updates } : s)
    );
  }, []);
  
  const handleScriptGeneration = async (prompt: string) => {
    setAppState(AppState.GENERATING_SCRIPT);
    setError(null);
    setScenes([]);
    try {
      const rawScenes = await generateScript(prompt);
      const newScenes: Scene[] = rawScenes.map((rs, index) => ({
        id: `scene-${index}-${Date.now()}`,
        description: rs.description,
        imagePrompt: rs.imagePrompt,
        imageBase64: null,
        imageStatus: 'idle',
      }));
      setScenes(newScenes);
      setAppState(AppState.SCRIPT_READY);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred during script generation.');
      setAppState(AppState.ERROR);
    }
  };
  
  const handleImageGeneration = useCallback(async () => {
    setAppState(AppState.GENERATING_IMAGES);
    setError(null);
    
    scenes.forEach(scene => {
      updateScene(scene.id, { imageStatus: 'loading' });
    });

    const imagePromises = scenes.map(scene => (
      generateImage(scene.imagePrompt)
        .then(imageBase64 => updateScene(scene.id, { imageBase64, imageStatus: 'done' }))
        .catch(err => {
          console.error(`Failed to generate image for scene ${scene.id}:`, err);
          updateScene(scene.id, { imageStatus: 'error' });
        })
    ));

    await Promise.all(imagePromises);
    
    setScenes(currentScenes => {
        const allSucceeded = currentScenes.every(s => s.imageStatus === 'done');
        if (allSucceeded) {
            setAppState(AppState.IMAGES_READY);
        } else {
            setError("Some images could not be generated. You may need to start over.");
            setAppState(AppState.IMAGES_READY); // Still finish to show partial results
        }
        return currentScenes;
    });
  }, [scenes, updateScene]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="container mx-auto px-4 pb-12">
        <Header />
        <PromptForm 
          isLoading={appState === AppState.GENERATING_SCRIPT}
          onSubmit={handleScriptGeneration}
        />
        {error && (
            <div className="my-8 max-w-2xl mx-auto p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg">
                <p className="font-bold">An Error Occurred</p>
                <p>{error}</p>
            </div>
        )}
        <Storyboard 
            scenes={scenes}
            appState={appState}
            onGenerateImages={handleImageGeneration}
        />
      </main>
    </div>
  );
};

export default App;
