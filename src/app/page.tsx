"use client";

import { DragEventHandler, useCallback, useState } from "react";
import { ChessBoard } from "../../lib/ChessBoard";

export default function Home() {
  return <ChessBoardComponent />;
}

const getColor = (index: number): string => {
  const mod2 = index % 2;
  const mod8 = Math.floor(index / 8);

  const val = mod8 % 2 ? !mod2 : mod2;
  return val ? "bg-lime-600/70" : "bg-yellow-200/30";
};

const ChessSquare = ({
  index,
  board,
  setFEN,
}: {
  index: number;
  board: ChessBoard;
  setFEN: (val: string) => void;
}) => {
  const onDragStart: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.dataTransfer.setData("text/plain", index.toString());
      event.dataTransfer.dropEffect = "move";
    },
    [index]
  );

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    [index]
  );

  const onDrop: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      const data = event.dataTransfer.getData("text/plain");
      board.move(+data, index);
      setFEN(board.toFEN());
    },
    [index]
  );

  return (
    <div
      key={index}
      className={`p-2 ${getColor(index)} hover:bg-yellow-200`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {board.getPieceOn(index) !== undefined
        ? ChessBoard.getUnicodeCharacter(board.getPieceOn(index)!)
        : ""}
    </div>
  );
};

const ChessBoardComponent = () => {
  const [board, setBoard] = useState(new ChessBoard());
  const [fen, setFEN] = useState(board.toFEN());
  const reset = useCallback(() => {
    board.reset();
    setFEN(board.toFEN());
  }, [setBoard]);
  return (
    <div className="text-5xl p-2 font-mono flex flex-col items-center justify-center w-full h-screen gap-4">
      <div className="grid grid-cols-8 grid-rows-8 justify-center select-none border-lime-800 border-4">
        {Array(64)
          .fill(0)
          .map((_, index) => (
            <ChessSquare
              key={index}
              index={index}
              board={board}
              setFEN={setFEN}
            />
          ))}
      </div>
      <div className="text-lg">{fen}</div>
      <button
        className="text-lg rounded-sm bg-red-500 text-white py-2 px-4 cursor-pointer"
        onClick={reset}
      >
        Reset
      </button>
    </div>
  );
};
