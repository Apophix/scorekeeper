import React, { useState } from 'react';
import ColorPicker from './ColorPicker';
import { TAILWIND_COLOR_MAP } from '../lib/colors';

interface Player {
  id: string;
  name: string;
  totalScore: number;
  color: string;
}

interface PlayerCardProps {
  player: Player;
  onColorChange: (newColor: string) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onColorChange }) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleColorChange = (newColor: string) => {
    onColorChange(newColor);
    setIsColorPickerOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-2">
        <button
          onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
          className="w-6 h-6 rounded-full mr-2 border-2 border-gray-300"
          style={{ backgroundColor: TAILWIND_COLOR_MAP[player.color]['500'] }}
        />
        <h3 className="text-base font-normal text-gray-500 mb-1">{player.name}</h3>
        {isColorPickerOpen && (
          <ColorPicker
            currentPlayerColor={player.color}
            onSelectColor={handleColorChange}
          />
        )}
      </div>
      <p className="text-xl font-bold mb-2 text-center">{player.totalScore}</p>
    </div>
  );
};

export default PlayerCard;
