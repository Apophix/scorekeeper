import React, { useState } from 'react';
import ColorPicker from './ColorPicker';
import { TAILWIND_COLOR_MAP } from '../lib/colors';
import { Award } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  totalScore: number;
  color: string;
}

interface PlayerCardProps {
  player: Player;
  onColorChange: (newColor: string) => void;
  rank: number;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onColorChange, rank }) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleColorChange = (newColor: string) => {
    onColorChange(newColor);
    setIsColorPickerOpen(false);
  };

  const getRankIcon = (playerRank: number) => {
    switch (playerRank) {
      case 1:
        return <Award className="w-5 h-5 text-yellow-500" fill="currentColor" />;
      case 2:
        return <Award className="w-5 h-5 text-gray-400" fill="currentColor" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-700" fill="currentColor" />;
      default:
        return null;
    }
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
      <div className="flex items-center justify-center">
        {getRankIcon(rank)}
        <p className="text-xl font-bold text-center ml-2">{player.totalScore}</p>
      </div>
    </div>
  );
};

export default PlayerCard;
