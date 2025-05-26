import { DetailedHTMLProps, HTMLAttributes } from "react";
import BlackBishop from "../svg/BlackBishop";
import BlackKing from "../svg/BlackKing";
import BlackKnight from "../svg/BlackKnight";
import BlackPawn from "../svg/BlackPawn";
import BlackQueen from "../svg/BlackQueen";
import BlackRook from "../svg/BlackRook";
import WhiteBishop from "../svg/WhiteBishop";
import WhiteKing from "../svg/WhiteKing";
import WhiteKnight from "../svg/WhiteKnight";
import WhitePawn from "../svg/WhitePawn";
import WhiteQueen from "../svg/WhiteQueen";
import WhiteRook from "../svg/WhiteRook";

const iconKeys = {
  BlackKing,
  BlackQueen,
  BlackRook,
  BlackBishop,
  BlackKnight,
  BlackPawn,
  WhiteKing,
  WhiteQueen,
  WhiteRook,
  WhiteBishop,
  WhiteKnight,
  WhitePawn,
};

export type IconKey = keyof typeof iconKeys;

interface SVGIconProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  iconKey: IconKey;
}

const SVGIcon: React.FC<SVGIconProps> = ({ iconKey, ...props }) => {
  const IconComponent = iconKeys[iconKey];
  return (
    <div {...props}>
      <IconComponent />
    </div>
  );
};

export default SVGIcon;
