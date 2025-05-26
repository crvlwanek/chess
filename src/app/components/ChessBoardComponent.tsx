import { DragEventHandler, useCallback } from "react";
import { ChessBoard, PIECES } from "../../../lib/ChessBoard";
import SVGIcon, { IconKey } from "./SVGIcon";

const getColor = (index: number): string => {
  const mod2 = index % 2;
  const mod8 = Math.floor(index / 8);

  const val = mod8 % 2 ? !mod2 : mod2;
  return val ? "bg-lime-600/70" : "bg-yellow-200/30";
};

const pieceMap: { [key in PIECES]: IconKey } = {
  [PIECES.WHITE_PAWN]: "WhitePawn",
  [PIECES.WHITE_KNIGHT]: "WhiteKnight",
  [PIECES.WHITE_BISHOP]: "WhiteBishop",
  [PIECES.WHITE_ROOK]: "WhiteRook",
  [PIECES.WHITE_QUEEN]: "WhiteQueen",
  [PIECES.WHITE_KING]: "WhiteKing",
  [PIECES.BLACK_PAWN]: "BlackPawn",
  [PIECES.BLACK_KNIGHT]: "BlackKnight",
  [PIECES.BLACK_BISHOP]: "BlackBishop",
  [PIECES.BLACK_ROOK]: "BlackRook",
  [PIECES.BLACK_QUEEN]: "BlackQueen",
  [PIECES.BLACK_KING]: "BlackKing",
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

  const piece = board.getPieceOn(index);

  return (
    <div
      key={index}
      className={`${getColor(index)} hover:bg-yellow-200 relative`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {piece !== undefined && (
        <SVGIcon
          iconKey={pieceMap[piece]}
          draggable
          onDragStart={onDragStart}
          className="absolute inset-0.5"
        />
      )}
    </div>
  );
};

const ChessBoardComponent = ({
  board,
  setFEN,
}: {
  board: ChessBoard;
  setFEN: (val: string) => void;
}) => {
  return (
    <div className="grid grid-cols-8 grid-rows-8 justify-center select-none border-lime-800 border-4 h-[400px] w-[400px]">
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
  );
};

export default ChessBoardComponent;
