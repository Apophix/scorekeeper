import React, { useState } from 'react';

interface PlayerInputProps {
  onAddPlayer: (playerName: string) => void;
}

const PlayerInput: React.FC<PlayerInputProps> = ({ onAddPlayer }) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onAddPlayer(playerName.trim());
      setPlayerName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
      <input
        type="text"
        placeholder="Enter player name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="flex-grow p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg transition duration-150 ease-in-out"
      />
      <button
        type="submit"
        className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out text-sm sm:text-base"
      >
        Add Player
      </button>
    </form>
  );
};

export default PlayerInput;