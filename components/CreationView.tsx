
import React, { useState, useRef } from 'react';
import type { AspectRatio, EditImageData, GenerateImageData } from '../types';
import { fileToEditImageData } from '../services/geminiService';
import { Button } from './common/Button';
import { UploadIcon } from './common/Icons';

interface CreationViewProps {
  onGenerate: (data: GenerateImageData) => void;
  onSwitchToEdit: (imageData: EditImageData) => void;
  isLoading: boolean;
}

export const CreationView: React.FC<CreationViewProps> = ({ onGenerate, onSwitchToEdit, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1' as AspectRatio);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ prompt, negativePrompt, aspectRatio });
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const imageData = await fileToEditImageData(e.target.files[0]);
        onSwitchToEdit(imageData);
      } catch (error) {
        console.error("Error processing file:", error);
        alert(error instanceof Error ? error.message : "An error occurred.");
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-white/80 mb-2">
          Your Vision (Prompt)
        </label>
        <textarea
          id="prompt"
          rows={4}
          className="w-full bg-black/30 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          placeholder="e.g., A majestic lion wearing a crown, cinematic lighting"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="negative-prompt" className="block text-sm font-medium text-white/80 mb-2">
          Exclude (Negative Prompt)
        </label>
        <input
          type="text"
          id="negative-prompt"
          className="w-full bg-black/30 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          placeholder="e.g., blurry, cartoon, watermark"
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
        />
      </div>
      
      <div>
        <label htmlFor="aspect-ratio" className="block text-sm font-medium text-white/80 mb-2">
          Aspect Ratio
        </label>
        <select
          id="aspect-ratio"
          className="w-full bg-black/30 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
        >
          <option value="1:1">Square (1:1)</option>
          <option value="3:4">Portrait (3:4)</option>
          <option value="4:3">Landscape (4:3)</option>
          <option value="9:16">Tall (9:16)</option>
          <option value="16:9">Widescreen (16:9)</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button type="submit" isLoading={isLoading} disabled={isLoading || !prompt} className="flex-1">
          {isLoading ? 'Conjuring...' : 'Generate Image'}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        <Button type="button" onClick={triggerFileUpload} variant="secondary" disabled={isLoading} className="flex-1">
          <UploadIcon className="w-5 h-5 mr-2" />
          Upload & Edit
        </Button>
      </div>
    </form>
  );
};
