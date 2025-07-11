import React, { useState, useEffect } from 'react';
import { TAILWIND_COLOR_MAP } from '../lib/colors'; // Import from shared file

interface ScoreInputControlProps {
  value: number; // The current round score from the parent
  onChange: (newValue: number) => void; // Callback to update the parent's round score
  disabled?: boolean;
  playerColor: string; // New prop for player-specific color
}

const ScoreInputControl: React.FC<ScoreInputControlProps> = ({
  value,
  onChange,
  disabled = false,
  playerColor,
}) => {
  // Internal state to track which cards are currently "toggled on"
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [selectedBonusCards, setSelectedBonusCards] = useState<number[]>([]);
  const [isX2MultiplierSelected, setIsX2MultiplierSelected] = useState<boolean>(false);
  const [isFlip7BonusActive, setIsFlip7BonusActive] = useState<boolean>(false);

  // Effect to synchronize internal states with the parent's value
  // This is important when the parent resets the score (e.g., new round)
  useEffect(() => {
    if (value === 0) {
      setSelectedCards([]);
      setSelectedBonusCards([]);
      setIsX2MultiplierSelected(false);
      setIsFlip7BonusActive(false);
    }
  }, [value]);

  const regularCardValues = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12
  const bonusCardValues = [2, 4, 6, 8, 10];

  const calculateTotalScore = (cards: number[], bonusCards: number[], x2Multiplier: boolean) => {
    let regularScore = cards.reduce((sum, val) => sum + val, 0);
    if (x2Multiplier) {
      regularScore *= 2;
    }
    const bonusScore = bonusCards.reduce((sum, val) => sum + val, 0);

    // Check for Flip7 bonus
    const uniqueRegularCards = new Set(cards);
    const flip7Bonus = (uniqueRegularCards.size === 7) ? 15 : 0;
    setIsFlip7BonusActive(flip7Bonus > 0);

    return regularScore + bonusScore + flip7Bonus;
  };

  const updateScore = (newSelectedCards: number[], newSelectedBonusCards: number[], newIsX2MultiplierSelected: boolean) => {
    onChange(calculateTotalScore(newSelectedCards, newSelectedBonusCards, newIsX2MultiplierSelected));
  };

  const handleCardToggle = (cardValue: number) => {
    let newSelectedCards: number[];
    if (selectedCards.includes(cardValue)) {
      newSelectedCards = selectedCards.filter((val) => val !== cardValue);
    } else {
      newSelectedCards = [...selectedCards, cardValue];
    }
    setSelectedCards(newSelectedCards);
    updateScore(newSelectedCards, selectedBonusCards, isX2MultiplierSelected);
  };

  const handleBonusCardToggle = (bonusValue: number) => {
    let newSelectedBonusCards: number[];
    if (selectedBonusCards.includes(bonusValue)) {
      newSelectedBonusCards = selectedBonusCards.filter((val) => val !== bonusValue);
    } else {
      newSelectedBonusCards = [...selectedBonusCards, bonusValue];
    }
    setSelectedBonusCards(newSelectedBonusCards);
    updateScore(selectedCards, newSelectedBonusCards, isX2MultiplierSelected);
  };

  const handleX2MultiplierToggle = () => {
    setIsX2MultiplierSelected((prev) => {
      const newState = !prev;
      updateScore(selectedCards, selectedBonusCards, newState);
      return newState;
    });
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newManualScore = parseInt(e.target.value) || 0;
    onChange(newManualScore); // Update the parent's state directly
    setSelectedCards([]); // Clear selected cards if manual input is used
    setSelectedBonusCards([]); // Clear bonus cards if manual input is used
    setIsX2MultiplierSelected(false); // Clear multiplier if manual input is used
    setIsFlip7BonusActive(false); // Clear Flip7 bonus if manual input is used
  };

  const handleBust = () => {
    setSelectedCards([]);
    setSelectedBonusCards([]);
    setIsX2MultiplierSelected(false);
    setIsFlip7BonusActive(false);
    onChange(0);
  };

  const getButtonStyles = (value: number, type: 'regular' | 'bonus' | 'multiplier') => {
    let backgroundColor = '';
    let textColor = '';
    let isSelected = false;

    if (type === 'regular') {
      isSelected = selectedCards.includes(value);
      backgroundColor = isSelected ? TAILWIND_COLOR_MAP[playerColor]['500'] : TAILWIND_COLOR_MAP[playerColor]['200'];
      textColor = isSelected ? 'white' : TAILWIND_COLOR_MAP[playerColor]['800'];
    } else if (type === 'bonus') {
      isSelected = selectedBonusCards.includes(value);
      backgroundColor = isSelected ? TAILWIND_COLOR_MAP.orange['500'] : TAILWIND_COLOR_MAP.orange['200'];
      textColor = isSelected ? 'white' : TAILWIND_COLOR_MAP.orange['800'];
    } else if (type === 'multiplier') {
      isSelected = isX2MultiplierSelected;
      backgroundColor = isSelected ? TAILWIND_COLOR_MAP.purple['500'] : TAILWIND_COLOR_MAP.purple['200'];
      textColor = isSelected ? 'white' : TAILWIND_COLOR_MAP.purple['800'];
    }

    return { backgroundColor, color: textColor };
  };

  const baseButtonClass = "px-3 py-1.5 text-base font-semibold rounded transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {regularCardValues.map((val) => (
          <button
            key={val}
            onClick={() => handleCardToggle(val)}
            disabled={disabled || (isFlip7BonusActive && !selectedCards.includes(val))}
            className={baseButtonClass}
            style={getButtonStyles(val, 'regular')}
          >
            {val}
          </button>
        ))}
      </div>
      <div className="flex justify-center mt-2">
        <button
          key={0}
          onClick={() => handleCardToggle(0)}
          disabled={disabled || (isFlip7BonusActive && !selectedCards.includes(0))}
          className={baseButtonClass}
          style={getButtonStyles(0, 'regular')}
        >
          0
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
        {bonusCardValues.map((val) => (
          <button
            key={`bonus-${val}`}
            onClick={() => handleBonusCardToggle(val)}
            disabled={disabled}
            className={baseButtonClass}
            style={getButtonStyles(val, 'bonus')}
          >
            +{val}
          </button>
        ))}
        <button
          onClick={handleX2MultiplierToggle}
          disabled={disabled}
          className={baseButtonClass}
          style={getButtonStyles(0, 'multiplier')} // Value 0 is a placeholder for styling
        >
          x2
        </button>
      </div>
      <input
        type="number"
        value={value}
        onChange={handleManualChange}
        disabled={disabled}
        className="w-full px-2 py-2 border border-gray-300 rounded-md text-center text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      />
      {isFlip7BonusActive && (
        <span className="text-green-600 text-sm font-bold">+15 Flip7 Bonus!</span>
      )}
      <button
        onClick={handleBust}
        disabled={disabled}
        className="px-5 py-2.5 text-base font-semibold rounded transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 text-white hover:bg-red-700"
      >
        Bust
      </button>
    </div>
  );
};

export default ScoreInputControl;
