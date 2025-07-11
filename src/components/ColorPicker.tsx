import React from 'react';
import { PLAYER_COLORS, TAILWIND_COLOR_MAP } from '../lib/colors';

interface ColorPickerProps {
  currentPlayerColor: string;
  onSelectColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ currentPlayerColor, onSelectColor }) => {
  return (
    <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
      <div className="grid grid-cols-4 gap-2 p-2">
        {PLAYER_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onSelectColor(color)}
            className={`w-10 h-10 rounded-full border-2 ${currentPlayerColor === color ? 'border-blue-500' : 'border-transparent'}`}
            style={{ backgroundColor: TAILWIND_COLOR_MAP[color]['500'] }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;