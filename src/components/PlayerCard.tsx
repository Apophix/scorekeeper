import React from 'react';

interface Player {
  id: string;
  name: string;
  totalScore: number;
}

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">{player.name}</h3>
      <p className="text-xl font-bold mb-2">Total Score: {player.totalScore}</p>
    </div>
  );
};

export default PlayerCard;
