
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
          ImageAlchemy
        </span>
      </h1>
      <p className="mt-2 text-lg text-white/70">
        Transform your ideas into stunning visuals.
      </p>
    </header>
  );
};
