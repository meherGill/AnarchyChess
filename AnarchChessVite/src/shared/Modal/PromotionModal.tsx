import { MouseEventHandler, useContext, useRef } from "react";
import { ChessLogicContext } from "@/App";
import {
    ChessPiecesName,
    MoveAction,
    PlayerColor,
    TypeOfChessPiece,
} from "@shared/enums";
import { getChessPieceNameFor } from "@components/ChessLogic/ChessLogic";
import chessPieceToIconMapper from "@shared/ChessPiecesMapped";
import { ISquareCoordinate } from "@shared/types";

interface PromotionModalPropsInterface {
    callBack: Function;
    closeModal: Function;
    pieceFrom: ISquareCoordinate;
    pieceTo: ISquareCoordinate;
}

const PromotionModal = ({
    callBack,
    closeModal,
    pieceFrom,
    pieceTo,
}: PromotionModalPropsInterface) => {
    const chessLogicValue = useContext(ChessLogicContext);

    const optionsToDisplay = () => {
        const playerColor = chessLogicValue!.turnToPlay;
        const optionsArr: Array<TypeOfChessPiece> = [
            TypeOfChessPiece.Bishop,
            TypeOfChessPiece.Queen,
            TypeOfChessPiece.Rook,
            TypeOfChessPiece.Knook,
        ];

        const chessPiecesArr = optionsArr.map((option) => {
            return getChessPieceNameFor(option, playerColor);
        });

        let classNameToUse = "";
        if (playerColor === PlayerColor.black) {
            classNameToUse = `bg-gray-700 rounded-md`;
        }

        const handleClick = (selectedTypeIndex: number) => {
            const typeOfPiece = optionsArr[selectedTypeIndex];
            let pawnPromotionActionName;
            switch (typeOfPiece) {
                case TypeOfChessPiece.Bishop:
                    pawnPromotionActionName = MoveAction.pawnPromotionBishop;
                    break;
                case TypeOfChessPiece.Rook:
                    pawnPromotionActionName = MoveAction.pawnPromotionRook;
                    break;
                case TypeOfChessPiece.Knook:
                    pawnPromotionActionName = MoveAction.pawnPromotionKnook;
                    break;
                case TypeOfChessPiece.Queen:
                    pawnPromotionActionName = MoveAction.pawnPromotionQueen;
                    break;
            }
            callBack(pieceFrom, pieceTo, pawnPromotionActionName);
        };

        return chessPiecesArr.map((chessPieceName, selectedTypeIndex) => {
            return (
                <li
                    key={chessPieceName}
                    className={`mx-3 cursor-pointer hover:scale-125 ${classNameToUse}`}
                    onClick={() => handleClick(selectedTypeIndex)}
                >
                    {chessPieceToIconMapper.get(chessPieceName)}
                </li>
            );
        });
    };
    return (
        <>
            <h2>Promote Pawn To</h2>
            <ul className="flex justify-center items-center">
                {optionsToDisplay()}
            </ul>
        </>
    );
};

export default PromotionModal;
