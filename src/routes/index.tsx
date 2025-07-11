import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import PlayerInput from '../components/PlayerInput';
import ScoreInputControl from '../components/ScoreInputControl';
import PlayerCard from '../components/PlayerCard';

interface Player {
  id: string;
  name: string;
  roundScores: number[];
  totalScore: number;
  color: string; // Add color property to Player interface
}

// Helper function to convert string to Title Case
const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export const Route = createFileRoute('/')({
  component: Flip7Scorekeeper,
});

const WINNING_SCORE = 200;

import { TAILWIND_COLOR_MAP, PLAYER_COLORS } from '../lib/colors';

function Flip7Scorekeeper() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [showNewGameOptions, setShowNewGameOptions] = useState<boolean>(false);

  useEffect(() => {
    const currentWinner = players.find(player => player.totalScore >= WINNING_SCORE);
    if (currentWinner) {
      setWinner(currentWinner);
    } else {
      setWinner(null);
    }
  }, [players]);

  const handleAddPlayer = (playerName: string, playerColor: string) => {
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: toTitleCase(playerName),
      roundScores: Array(currentRound).fill(0),
      totalScore: 0,
      color: playerColor, // Use the chosen color
    };
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
  };

  const handleRoundScoreChange = (playerId: string, roundIndex: number, score: number) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        if (player.id === playerId) {
          const newRoundScores = [...player.roundScores];
          newRoundScores[roundIndex] = score;
          const newTotalScore = newRoundScores.reduce((sum, s) => sum + s, 0);
          return { ...player, roundScores: newRoundScores, totalScore: newTotalScore };
        }
        return player;
      })
    );
  };

  const handleNextRound = () => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        const newTotalScore = player.roundScores.reduce((sum, s) => sum + s, 0);
        return { ...player, totalScore: newTotalScore };
      })
    );
    setCurrentRound((prevRound) => prevRound + 1);
    // Initialize new round score for existing players for the new round
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => ({
        ...player,
        roundScores: [...player.roundScores, 0],
      }))
    );
  };

  const handlePreviousRound = () => {
    if (currentRound > 0) {
      setCurrentRound((prevRound) => prevRound - 1);
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => {
          const newRoundScores = player.roundScores.slice(0, player.roundScores.length - 1);
          const newTotalScore = newRoundScores.reduce((sum, s) => sum + s, 0);
          return { ...player, roundScores: newRoundScores, totalScore: newTotalScore };
        })
      );
    }
  };

  const handleNewGameClick = () => {
    setShowNewGameOptions(true);
  };

  const handleResetScores = () => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => ({
        ...player,
        roundScores: Array(currentRound).fill(0),
        totalScore: 0,
      }))
    );
    setWinner(null);
    setCurrentRound(0);
    setShowNewGameOptions(false);
  };

  const handleClearPlayers = () => {
    setPlayers([]);
    setWinner(null);
    setCurrentRound(0);
    setShowNewGameOptions(false);
  };

  const handleDismissWinner = () => {
    setWinner(null);
  };

  const handleColorChange = (playerId: string, newColor: string) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => (p.id === playerId ? { ...p, color: newColor } : p))
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white min-h-screen">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-800 mb-6 sm:mb-8 lg:mb-10 tracking-tight">Flip7 Scorekeeper</h2>

      {!winner && (
        <div className="mb-12 sm:mb-16">
          <PlayerInput onAddPlayer={handleAddPlayer} availableColors={PLAYER_COLORS} tailwindColorMap={TAILWIND_COLOR_MAP} players={players} />
        </div>
      )}

      {winner && (
        <div className="bg-green-50 border border-green-300 text-green-800 px-6 py-4 rounded-lg relative mb-6 sm:mb-8 shadow-md text-center">
          <strong className="font-bold text-lg sm:text-xl">Game Over!</strong>
          <span className="block sm:inline text-base sm:text-lg"> {winner.name} wins with {winner.totalScore} points!</span>
          <button
            onClick={handleDismissWinner}
            className="mt-3 sm:mt-0 sm:ml-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out text-sm sm:text-base"
          >
            Dismiss
          </button>
        </div>
      )}

      {players.length > 0 && (
        <div className="mb-6 sm:mb-8">
          {Array.from({ length: currentRound + 1 }).map((_, roundIndex) => (
            <div key={roundIndex} className={`mb-8 relative ${roundIndex % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'} rounded-lg shadow-sm border border-gray-200 pb-4`}>
              <div className="absolute -top-3 left-3 bg-white px-2 text-xs font-medium text-gray-500 uppercase">
                Round {roundIndex + 1}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
                {players.map((player) => (
                  <div key={player.id} className="text-center flex flex-col items-center p-2">
                    <span className="font-semibold text-sm sm:text-base mb-2" style={{ color: TAILWIND_COLOR_MAP[player.color]['800'] }}>{player.name}</span>
                    {roundIndex === currentRound && !winner ? (
                      <ScoreInputControl
                        value={player.roundScores[roundIndex] || 0}
                        onChange={(score) =>
                          handleRoundScoreChange(player.id, roundIndex, score)
                        }
                        playerColor={player.color}
                      />
                    ) : (
                      <span className="block text-base font-medium" style={{ color: TAILWIND_COLOR_MAP[player.color]['900'] }}>{player.roundScores[roundIndex] || 0}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-8 bg-gray-100 rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-center font-semibold text-gray-700 text-base sm:text-lg mb-3">Total</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {players.sort((a, b) => b.totalScore - a.totalScore).map((player, index) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onColorChange={(newColor) => handleColorChange(player.id, newColor)}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {players.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-6 mt-6 sm:mt-8">
          {!winner && (
            <button
              onClick={handlePreviousRound}
              className="px-5 py-2.5 sm:px-7 sm:py-3.5 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out text-sm sm:text-base"
              disabled={currentRound === 0}
            >
              Previous Round
            </button>
          )}
          {!winner && (
            <button
              onClick={handleNextRound}
              className="px-5 py-2.5 sm:px-7 sm:py-3.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out text-sm sm:text-base"
            >
              Next Round
            </button>
          )}
          <button
            onClick={handleNewGameClick}
            className="px-5 py-2.5 sm:px-7 sm:py-3.5 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out text-sm sm:text-base"
          >
            New Game
          </button>
        </div>
      )}

      {showNewGameOptions && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl text-center w-full max-w-sm sm:max-w-md">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Start a New Game</h3>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base">What would you like to do?</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleResetScores}
                className="px-5 py-2.5 sm:px-7 sm:py-3.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out text-sm sm:text-base"
              >
                Reset Scores (Keep Players)
              </button>
              <button
                onClick={handleClearPlayers}
                className="px-5 py-2.5 sm:px-7 sm:py-3.5 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out text-sm sm:text-base"
              >
                Clear All Players
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
