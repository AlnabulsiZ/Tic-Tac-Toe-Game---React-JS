import { useEffect, useState } from "react";
import Cell from "./Components/Cell";
import './index.css'; 
export default function Home() {
  const [size, setSize] = useState(3);
  const [cells, setCells] = useState<string[]>(Array(9).fill(""));
  const [go, setGo] = useState<"O" | "X">("O");
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "draw">("playing");
  const [score, setScore] = useState({ O: 0, X: 0, draw: 0 });

  useEffect(() => {
    resetBoard(size);
  }, [size]);

  const resetBoard = (newSize: number) => {
    setCells(Array(newSize * newSize).fill(""));
    setGo("O");
    setGameStatus("playing");
  };

  const resetGame = () => {
    setScore({ O: 0, X: 0, draw: 0 });
    resetBoard(size);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) return;
    const newSize = Math.min(Math.max(value, 3), 10);
    setSize(newSize);
  };

  const checkWinner = (currentCells: string[], player: "O" | "X"): boolean => {
    for (let i = 0; i < size; i++) {
      if (currentCells.slice(i * size, (i + 1) * size).every(cell => cell === player)) {
        return true;
      }
      if (Array.from({ length: size }, (_, j) => currentCells[j * size + i]).every(cell => cell === player)) {
        return true;
      }
    }

    const diagonal1 = Array.from({ length: size }, (_, i) => currentCells[i * size + i]);
    const diagonal2 = Array.from({ length: size }, (_, i) => currentCells[i * size + (size - 1 - i)]);

    return diagonal1.every(cell => cell === player) || diagonal2.every(cell => cell === player);
  };

  const handleCellClick = (id: number) => {
    if (gameStatus !== "playing" || cells[id] !== "") return;

    const newCells = [...cells];
    newCells[id] = go;
    setCells(newCells);

    if (checkWinner(newCells, go)) {
      setGameStatus("won");
      setScore(prev => ({ ...prev, [go]: prev[go] + 1 }));
      return;
    }

    if (newCells.every(cell => cell !== "")) {
      setGameStatus("draw");
      setScore(prev => ({ ...prev, draw: prev.draw + 1 }));
      return;
    }

    setGo(prev => (prev === "O" ? "X" : "O"));
  };

  return (
    <div className="container">
      <div className="title">
        <h1>Tic Tac Toe</h1>
      </div>

      <div className="tools">
        <div className="size">
          <label id="size">Board Size (3-10)</label>
          <input
            type="number"
            id="size"
            value={size}
            onChange={handleSizeChange}
            min="3"
            max="10"
            className="input-number"
          />
        </div>

        <div className="game-status" id="status">
          {gameStatus === "won" ? (
            <span>{`${go} wins!`}</span>
          ) : gameStatus === "draw" ? (
            <span>Draw!</span>
          ) : (
            <span>{`It's ${go}'s turn`}</span>
          )}
          <img
            src="reload.png"
            alt="restart"
            onClick={() => resetBoard(size)}
            className="reset"
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="score">
          <p>O Wins: {score.O}</p>
          <p>X Wins: {score.X}</p>
          <p>Draws: {score.draw}</p>
        </div>
      </div>

      <div
        className="gameBoard"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(50px, 1fr))` }}
      >
        {cells.map((cell, index) => (
          <Cell
            key={index}
            id={index}
            cell={cell}
            gameStatus={gameStatus}
            onClick={() => handleCellClick(index)}
          />
        ))}
      </div>

      <div className="buttons">
        <button onClick={resetGame} className="reset-btn">New Game</button>
        <button onClick={() => resetBoard(size)} className="reset-btn">New Round</button>
      </div>
    </div>
  );
}
