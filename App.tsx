
import React, { useState, useCallback } from 'react';
import { CreationView } from './components/CreationView';
import { EditingView } from './components/EditingView';
import { CanvasDisplay } from './components/CanvasDisplay';
import { Header } from './components/Header';
import { generateImage, editImage } from './services/geminiService';
import type { AspectRatio, EditImageData, GenerateImageData } from './types';
import { View } from './types';

const AnimatedBackground: React.FC = () => (
  <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
    <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
    <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] bg-orange-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    <style>{`
      @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      .animate-blob {
        animation: blob 7s infinite;
      }
      .animation-delay-2000 {
        animation-delay: 2s;
      }
      .animation-delay-4000 {
        animation-delay: 4s;
      }
    `}</style>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.CREATION);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<EditImageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (data: GenerateImageData) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageB64 = await generateImage(data.prompt, data.negativePrompt, data.aspectRatio);
      setGeneratedImage(`data:image/png;base64,${imageB64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEdit = useCallback(async (prompt: string) => {
    if (!sourceImage) {
      setError('No source image selected for editing.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageB64 = await editImage(sourceImage, prompt);
      setGeneratedImage(`data:image/png;base64,${imageB64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during editing.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [sourceImage]);

  const handleSwitchToEdit = useCallback((imageData: EditImageData) => {
    setSourceImage(imageData);
    setGeneratedImage(null);
    setError(null);
    setView(View.EDITING);
  }, []);
  
  const handleSwitchToCreation = useCallback(() => {
    setSourceImage(null);
    setGeneratedImage(null);
    setError(null);
    setView(View.CREATION);
  }, []);


  return (
    <div className="relative min-h-screen w-full text-white font-sans overflow-hidden">
      <AnimatedBackground />
      <main className="relative z-10 flex flex-col items-center p-4 sm:p-6 lg:p-8">
        <Header />
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl h-fit">
            {view === View.CREATION ? (
              <CreationView onGenerate={handleGenerate} onSwitchToEdit={handleSwitchToEdit} isLoading={isLoading} />
            ) : (
              <EditingView onEdit={handleEdit} onBack={handleSwitchToCreation} sourceImage={sourceImage} isLoading={isLoading} />
            )}
            {error && <div className="mt-4 text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}
          </div>
          <CanvasDisplay isLoading={isLoading} image={generatedImage} sourceImage={sourceImage?.base64} view={view} />
        </div>
      </main>
    </div>
  );
};

export default App;
