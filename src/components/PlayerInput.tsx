import React, { useState, useEffect, useRef } from 'react';

interface PlayerInputProps {
  onAddPlayer: (playerName: string, playerColor: string) => void;
  availableColors: string[];
  tailwindColorMap: { [key: string]: { [shade: string]: string } };
  players: { color: string }[]; // Add players prop to get used colors
}

const PlayerInput: React.FC<PlayerInputProps> = ({
  onAddPlayer,
  availableColors,
  tailwindColorMap,
  players,
}) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState(availableColors[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const isManualSelection = useRef(false);

  // Effect to set initial color or find next available color
  useEffect(() => {
    // If a manual selection was just made, don't override it with automatic suggestion
    if (isManualSelection.current) {
      isManualSelection.current = false; // Reset the flag
      return;
    }

    const nextColorToSuggest = availableColors[players.length % availableColors.length];

    setSelectedColor(nextColorToSuggest);
  }, [players, availableColors]); // Dependencies: players and availableColors

  const handleColorSelect = (color: string) => {
    isManualSelection.current = true; // Mark as manual selection
    setSelectedColor(color);
    setShowColorPicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onAddPlayer(playerName.trim(), selectedColor);
      setPlayerName('');
      // Color selection will be handled by the useEffect after player is added
      // No need to reset selectedColor here, useEffect will handle the next suggestion
      setShowColorPicker(false);
    }
  };

  const currentColorShades = tailwindColorMap[selectedColor];

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-3 mb-6 items-center">
      <div className="flex flex-grow items-center gap-3 relative">
        <input
          type="text"
          placeholder="Enter player name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="flex-grow p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg transition duration-150 ease-in-out"
        />
        <div
          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-transparent hover:border-blue-500 transition duration-150 ease-in-out flex-shrink-0"
          style={{ backgroundColor: currentColorShades?.['500'] || 'gray' }} // Fallback color
          onClick={() => setShowColorPicker(!showColorPicker)}
          title={`Click to select color (${selectedColor})`}
        ></div>
        {showColorPicker && (
          <div className="absolute top-full right-0 mt-2 p-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 grid grid-cols-4 gap-2">
            {availableColors.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-blue-500' : 'border-transparent'}`}
                style={{ backgroundColor: tailwindColorMap[color]['500'] }}
                onClick={() => handleColorSelect(color)}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
      <button
        type="submit"
        className="px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out text-base sm:text-lg"
      >
        Add Player
      </button>
    </form>
  );
};

export default PlayerInput;
