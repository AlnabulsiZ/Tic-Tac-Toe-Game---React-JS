import '../index.css'; 
type CellProps = {
  id: number;
  cell: string;
  gameStatus: "playing" | "won" | "draw";
  onClick: () => void;
};

const Cell = ({ cell, gameStatus, onClick }: CellProps) => {
  return (
    <div
      onClick={onClick}
      className={`cell-base ${cell ? "cell-filled" : "cell-empty"} ${
        gameStatus !== "playing" ? "cell-disabled" : ""
      } ${cell === "O" ? "cell-O" : cell === "X" ? "cell-X" : ""}`}
    >
      {cell === "O" ? "O" : cell === "X" ? "X" : ""}
    </div>
  );
};

export default Cell;
