"use client";

import { useCallback, useMemo, useState } from "react";
import ChessBoardComponent from "./components/ChessBoardComponent";
import { ChessBoard } from "../../lib/ChessBoard";
import SVGIcon from "./components/SVGIcon";

export default function Home() {
  const board = useMemo(() => new ChessBoard(), []);
  const [_, setFEN] = useState(board.toFEN());
  const reset = useCallback(() => {
    board.reset();
    setFEN(board.toFEN());
  }, []);
  return (
    <div className="text-5xl p-2 font-mono flex flex-col items-center justify-center w-full h-screen gap-4">
      <ChessBoardComponent board={board} setFEN={setFEN} />
      <button
        className="text-lg rounded-sm bg-red-500 text-white py-2 px-4 cursor-pointer"
        onClick={reset}
      >
        Reset
      </button>
    </div>
  );
}
