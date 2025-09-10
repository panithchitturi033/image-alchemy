
import React, { useState } from 'react';
import type { EditImageData } from '../types';
import { Button } from './common/Button';

interface EditingViewProps {
  onEdit: (prompt: string) => void;
  onBack: () => void;
  sourceImage: EditImageData | null;
  isLoading: boolean;
}

export const EditingView: React.FC<EditingViewProps> = ({ onEdit, onBack, sourceImage, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(prompt);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Image Editor</h2>
        <Button onClick={onBack} variant="secondary" size="sm" disabled={isLoading}>
          Back
        </Button>
      </div>
      {sourceImage && (
        <div className="rounded-lg overflow-hidden border-2 border-white/20">
          <img src={sourceImage.base64} alt="Source for editing" className="w-full h-auto object-contain max-h-64" />
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-prompt" className="block text-sm font-medium text-white/80 mb-2">
            Editing Instruction
          </label>
          <textarea
            id="edit-prompt"
            rows={3}
            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            placeholder="e.g., Add a futuristic city in the background"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <Button type="submit" isLoading={isLoading} disabled={isLoading || !prompt || !sourceImage} className="w-full">
          {isLoading ? 'Transforming...' : 'Apply Edit'}
        </Button>
      </form>
    </div>
  );
};
