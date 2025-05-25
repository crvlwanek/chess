import { expect, test, describe } from "vitest";
import { ChessBoard, PIECES, SQUARES } from "./ChessBoard";

const startingBoard = [
  BigInt(71776119061217280),
  BigInt(4755801206503243776),
  BigInt(2594073385365405696),
  BigInt(9295429630892703744),
  BigInt(576460752303423488),
  BigInt(1152921504606846976),
  BigInt(65280),
  BigInt(66),
  BigInt(36),
  BigInt(129),
  BigInt(8),
  BigInt(16),
];

describe("ChessBoard", () => {
  describe("constructor", () => {
    test("default", () => {
      const board = new ChessBoard();
      expect(board.getBoardState().board).toEqual(startingBoard);
    });

    test("empty board", () => {
      const board = new ChessBoard([]);
      expect(board.getBoardState().board).toEqual(
        Array(12).fill(BigInt("0x0"))
      );
    });

    test("with pieces", () => {
      const board = new ChessBoard([
        { piece: PIECES.BLACK_ROOK, square: SQUARES.E3 },
        { piece: PIECES.WHITE_KNIGHT, square: SQUARES.A2 },
      ]);
      expect(board.getPieceOn(SQUARES.E3)).toEqual(PIECES.BLACK_ROOK);
      expect(board.getPieceOn(SQUARES.A2)).toEqual(PIECES.WHITE_KNIGHT);
    });
  });

  describe("toFEN", () => {
    test("starting position", () => {
      const board = new ChessBoard();
      expect(board.toFEN()).toEqual(
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
      );
    });
  });
});
