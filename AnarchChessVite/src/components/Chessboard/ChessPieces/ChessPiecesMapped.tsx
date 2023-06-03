import { ChessPiecesName } from "@shared/enums";

import { ReactComponent as BlackKing } from "@/assets/Pieces/black_king.svg";
import { ReactComponent as WhiteKing } from "@/assets/Pieces/white_king.svg";
import { ReactComponent as BlackQueen } from "@/assets/Pieces/black_queen.svg";
import { ReactComponent as WhiteQueen } from "@/assets/Pieces/white_queen.svg";
import { ReactComponent as BlackKnight } from "@/assets/Pieces/black_knight.svg";
import { ReactComponent as WhiteKnight } from "@/assets/Pieces/white_knight.svg";
import { ReactComponent as BlackBishop } from "@/assets/Pieces/black_bishop.svg";
import { ReactComponent as WhiteBishop } from "@/assets/Pieces/white_bishop.svg";
import { ReactComponent as BlackPawn } from "@/assets/Pieces/black_pawn.svg";
import { ReactComponent as WhitePawn } from "@/assets/Pieces/white_pawn.svg";
import { ReactComponent as BlackRook } from "@/assets/Pieces/black_rook.svg";
import { ReactComponent as WhiteRook } from "@/assets/Pieces/white_rook.svg";
import { ReactComponent as BlackKnook } from "@/assets/Pieces/black_knook.svg";
import { ReactComponent as WhiteKnook } from "@/assets/Pieces/white_knook.svg";

const map = new Map<ChessPiecesName, any>([
    [ChessPiecesName.blackPawn, <BlackPawn />],
    [ChessPiecesName.whitePawn, <WhitePawn />],
    [ChessPiecesName.blackQueen, <BlackQueen />],
    [ChessPiecesName.whiteQueen, <WhiteQueen />],
    [ChessPiecesName.blackKing, <BlackKing />],
    [ChessPiecesName.whiteKing, <WhiteKing />],
    [ChessPiecesName.blackBishop, <BlackBishop />],
    [ChessPiecesName.whiteBishop, <WhiteBishop />],
    [ChessPiecesName.blackKnight, <BlackKnight />],
    [ChessPiecesName.whiteKnight, <WhiteKnight />],
    [ChessPiecesName.blackRook, <BlackRook />],
    [ChessPiecesName.whiteRook, <WhiteRook />],
    [ChessPiecesName.blackKnook, <BlackKnook />],
    [ChessPiecesName.whiteKnook, <WhiteKnook />],
]);

export default map;
