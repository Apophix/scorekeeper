import React, { useState } from 'react';
import ColorPicker from './ColorPicker';
import { TAILWIND_COLOR_MAP } from '../lib/colors';
import { Award, Pencil } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  totalScore: number;
  color: string;
}

interface PlayerCardProps {
  player: Player;
  onColorChange: (newColor: string) => void;
  onNameChange: (newName: string) => void;
  rank: number;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onColorChange, onNameChange, rank }) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(player.name);

  const handleColorChange = (newColor: string) => {
    onColorChange(newColor);
    setIsColorPickerOpen(false);
  };

  const handleNameSave = () => {
    if (editedName.trim() !== '' && editedName !== player.name) {
      onNameChange(editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleNameSave();
    }
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
          className="w-6 h-6 rounded-full mr-2 border-2 border-gray-300 flex-shrink-0"
          style={{ backgroundColor: TAILWIND_COLOR_MAP[player.color]['500'] }}
        />
        <div className="flex items-center flex-grow">
          {isEditingName ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleKeyDown}
              className="text-base font-normal text-gray-500 mb-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
              autoFocus
            />
          ) : (
            <h3 className="text-base font-normal text-gray-500 mb-1 flex-grow">{player.name}</h3>
          )}
          <button onClick={() => setIsEditingName(!isEditingName)} className="ml-2 p-1 rounded hover:bg-gray-200 flex-shrink-0">
            <Pencil className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        {isColorPickerOpen && (
          <ColorPicker
            currentPlayerColor={player.color}
            onSelectColor={handleColorChange}
          />
        )}
      </div>
      <div className="flex items-center justify-center">
        {player.totalScore > 0 && getRankIcon(rank)}
        <p className="text-xl font-bold text-center ml-2">{player.totalScore}</p>
      </div>
    </div>
  );
};

export default PlayerCard;
