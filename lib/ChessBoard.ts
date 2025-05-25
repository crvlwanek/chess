// Little-Endian Rank-File mapping
// prettier-ignore
export enum SQUARES {
  A8, B8, C8, D8, E8, F8, G8, H8,
  A7, B7, C7, D7, E7, F7, G7, H7,
  A6, B6, C6, D6, E6, F6, G6, H6,
  A5, B5, C5, D5, E5, F5, G5, H5,
  A4, B4, C4, D4, E4, F4, G4, H4,
  A3, B3, C3, D3, E3, F3, G3, H3,
  A2, B2, C2, D2, E2, F2, G2, H2,
  A1, B1, C1, D1, E1, F1, G1, H1,
}

const EMPTY_BITBOARD = BigInt("0x0");
const SINGLE_BIT = BigInt("0x1");

function bits(square: SQUARES): bigint {
  return SINGLE_BIT << BigInt(square);
}

const __ranks: (keyof typeof SQUARES)[][] = [
  ["A8", "B8", "C8", "D8", "E8", "F8", "G8", "H8"],
  ["A7", "B7", "C7", "D7", "E7", "F7", "G7", "H7"],
  ["A6", "B6", "C6", "D6", "E6", "F6", "G6", "H6"],
  ["A5", "B5", "C5", "D5", "E5", "F5", "G5", "H5"],
  ["A4", "B4", "C4", "D4", "E4", "F4", "G4", "H4"],
  ["A3", "B3", "C3", "D3", "E3", "F3", "G3", "H3"],
  ["A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2"],
  ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1"],
];

// Ranks from 8 to 1
const RANKS: bigint[] = __ranks.map((rank) => {
  return rank
    .map((square) => bits(SQUARES[square]))
    .reduce((prev, curr) => prev | curr, EMPTY_BITBOARD);
});

const __files: (keyof typeof SQUARES)[][] = [
  ["A8", "A7", "A6", "A5", "A4", "A3", "A2", "A1"],
  ["B8", "B7", "B6", "B5", "B4", "B3", "B2", "B1"],
  ["C8", "C7", "C6", "C5", "C4", "C3", "C2", "C1"],
  ["D8", "D7", "D6", "D5", "D4", "D3", "D2", "D1"],
  ["E8", "E7", "E6", "E5", "E4", "E3", "E2", "E1"],
  ["F8", "F7", "F6", "F5", "F4", "F3", "F2", "F1"],
  ["G8", "G7", "G6", "G5", "G4", "G3", "G2", "G1"],
  ["H8", "H7", "H6", "H5", "H4", "H3", "H2", "H1"],
];

// Files from A to H
const FILES: bigint[] = __files.map((file) => {
  return file
    .map((square) => bits(SQUARES[square]))
    .reduce((prev, curr) => prev | curr, EMPTY_BITBOARD);
});

// prettier-ignore
export enum PIECES {
  WHITE_PAWN, WHITE_KNIGHT, WHITE_BISHOP, WHITE_ROOK, WHITE_QUEEN, WHITE_KING,
  BLACK_PAWN, BLACK_KNIGHT, BLACK_BISHOP, BLACK_ROOK, BLACK_QUEEN, BLACK_KING,
}

// prettier-ignore
const UNICODE_PIECES = [
  "2659", "2658", "2657", "2656", "2655", "2654",
  "265F", "265E", "265D", "265C", "265B", "265A",
];

// prettier-ignore
const STRING_PIECES = [
  "P", "N", "B", "R", "Q", "K",
  "p", "n", "b", "r", "q", "k"
]

enum AdditionalInfo {
  ActiveColor = 1,
  WhiteCastleKing,
  WhiteCastleQueen,
  BlackCastleKing,
  BlackCastleQueen,
}

const STARTING_ADDITIONAL_INFO = parseInt("11111", 2);
const NO_EN_PASSANT = BigInt("0xFFFFFFFFFFFFFFFF");

const NUMBER_OF_PIECE_TYPES = 12;

const FILLED_BITBOARD = BigInt("0xFFFFFFFFFFFFFFFF");

const WHITE_PAWN_START = RANKS[6];
const WHITE_KNIGHT_START = bits(SQUARES.B1) | bits(SQUARES.G1);
const WHITE_BISHOP_START = bits(SQUARES.C1) | bits(SQUARES.F1);
const WHITE_ROOK_START = bits(SQUARES.A1) | bits(SQUARES.H1);
const WHITE_QUEEN_START = bits(SQUARES.D1);
const WHITE_KING_START = bits(SQUARES.E1);

const BLACK_PAWN_START = RANKS[1];
const BLACK_KNIGHT_START = bits(SQUARES.B8) | bits(SQUARES.G8);
const BLACK_BISHOP_START = bits(SQUARES.C8) | bits(SQUARES.F8);
const BLACK_ROOK_START = bits(SQUARES.A8) | bits(SQUARES.H8);
const BLACK_QUEEN_START = bits(SQUARES.D8);
const BLACK_KING_START = bits(SQUARES.E8);

type BoardState = {
  board: bigint[];
};

type PiecePlacement = {
  piece: PIECES;
  square: SQUARES;
};

export class ChessBoard {
  /** Array[12] of pieces */
  private __board: bigint[] = [];

  /** Bitmask of aditional game info -- see enum */
  private __additionalInfo: number = 0;

  /** Target square for en passant if any -- filled bitboard if none */
  private __enPassantTarget: bigint = NO_EN_PASSANT;

  private __halfmoveClock: number = 0;
  private __fullmoveNumber: number = 1;

  private static __buildEmptyBoard(): bigint[] {
    return new Array(NUMBER_OF_PIECE_TYPES).fill(EMPTY_BITBOARD);
  }

  private __isSquareOccupied(square: SQUARES): boolean {
    return this.__board.some(
      (bitboard) => bitboard & (SINGLE_BIT << BigInt(square))
    );
  }

  private __getCastlingString(): string {
    const stringBuilder = [
      this.__additionalInfo & AdditionalInfo.WhiteCastleKing ? "K" : "",
      this.__additionalInfo & AdditionalInfo.WhiteCastleQueen ? "Q" : "",
      this.__additionalInfo & AdditionalInfo.BlackCastleKing ? "k" : "",
      this.__additionalInfo & AdditionalInfo.BlackCastleQueen ? "q" : "",
    ];

    return stringBuilder.join("");
  }

  public constructor(pieces?: PiecePlacement[]) {
    this.__board = ChessBoard.__buildEmptyBoard();

    if (typeof pieces === "undefined") {
      this.reset();
      return;
    }

    if (Array.isArray(pieces)) {
      pieces.forEach(({ piece, square }) => this.placePiece(piece, square));
      return;
    }

    throw new Error("Unknown type for pieces parameter: " + pieces);
  }

  public reset(): void {
    this.__board[PIECES.WHITE_PAWN] = WHITE_PAWN_START;
    this.__board[PIECES.WHITE_KNIGHT] = WHITE_KNIGHT_START;
    this.__board[PIECES.WHITE_BISHOP] = WHITE_BISHOP_START;
    this.__board[PIECES.WHITE_ROOK] = WHITE_ROOK_START;
    this.__board[PIECES.WHITE_QUEEN] = WHITE_QUEEN_START;
    this.__board[PIECES.WHITE_KING] = WHITE_KING_START;

    this.__board[PIECES.BLACK_PAWN] = BLACK_PAWN_START;
    this.__board[PIECES.BLACK_KNIGHT] = BLACK_KNIGHT_START;
    this.__board[PIECES.BLACK_BISHOP] = BLACK_BISHOP_START;
    this.__board[PIECES.BLACK_ROOK] = BLACK_ROOK_START;
    this.__board[PIECES.BLACK_QUEEN] = BLACK_QUEEN_START;
    this.__board[PIECES.BLACK_KING] = BLACK_KING_START;

    this.__additionalInfo = STARTING_ADDITIONAL_INFO;
  }

  public getPieceOn(square: SQUARES): PIECES | undefined {
    for (let i = 0; i < this.__board.length; i++) {
      if (this.__board[i] & bits(square)) {
        return i;
      }
    }

    return undefined;
  }

  /** Returns true if white is the active color, false if black is active */
  public isWhiteActive(): boolean {
    return (this.__additionalInfo & AdditionalInfo.ActiveColor) === 1;
  }

  public placePiece(piece: PIECES, square: SQUARES): void {
    if (this.__isSquareOccupied(square)) return;
    this.__board[piece] |= bits(square);
  }

  public getBoardState(): BoardState {
    return { board: this.__board };
  }

  // https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
  public toFEN(): string {
    const stringBuilder = [];
    let spaceCounter = 0;
    for (let i = 0; i < 64; i++) {
      const piece = this.getPieceOn(i);
      if (piece === undefined) spaceCounter++;
      else {
        if (spaceCounter) stringBuilder.push(spaceCounter.toString());
        stringBuilder.push(ChessBoard.getAlgebraicNotationChar(piece));
        spaceCounter = 0;
      }
      if (i % 8 === 7) {
        if (spaceCounter) stringBuilder.push(spaceCounter.toString());
        if (i !== 63) stringBuilder.push("/");
        spaceCounter = 0;
      }
    }

    return [
      stringBuilder.join(""),
      this.isWhiteActive() ? "w" : "b",
      this.__getCastlingString(),
      this.__enPassantTarget === NO_EN_PASSANT
        ? "-"
        : this.__enPassantTarget.toString(),
      this.__halfmoveClock,
      this.__fullmoveNumber,
    ].join(" ");
  }

  public toString(): string {
    const stringBuilder = [];
    for (let i = 0; i < 64; i++) {
      const piece = this.getPieceOn(i);
      if (piece === undefined) stringBuilder.push(".");
      else stringBuilder.push(ChessBoard.getUnicodeCharacter(piece));
      if (i % 8 === 7) stringBuilder.push("\n");
    }

    return stringBuilder.join("");
  }

  public static getUnicodeCharacter(piece: PIECES): string {
    return String.fromCodePoint(parseInt(UNICODE_PIECES[piece], 16));
  }

  public static getAlgebraicNotationChar(piece: PIECES): string {
    return STRING_PIECES[piece];
  }

  public move(from: SQUARES, to: SQUARES): void {
    const piece = this.getPieceOn(from);
    if (piece === undefined) return;
    if (this.__isSquareOccupied(to)) return;
    this.placePiece(piece, to);
    this.__board[piece] &= ~bits(from);
  }
}
