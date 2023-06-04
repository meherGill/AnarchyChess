import { useContext, useRef } from "react";
import { ChessLogicContext } from "@/App";
import { ChessPiecesName, PlayerColor, TypeOfChessPiece } from "@shared/enums";
import { getChessPieceNameFor } from "../../components/ChessLogic/ChessLogic";
import chessPieceToIconMapper from "@shared/ChessPiecesMapped";

interface PromotionModalPropsInterface {
    callBack: Function;
    closeModal: Function;
}

const PromotionModal = ({
    callBack,
    closeModal,
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
        <div className="w-screen h-screen bg-neutral-800/95 absolute z-50 flex justify-center items-center">
            <div className="flex flex-col justify-around items-center bg-neutral-900 rounded-md p-5 h-40">
                <h2>Promote Pawn To</h2>
                <ul className="flex justify-center items-center">
                    {optionsToDisplay()}
                </ul>
            </div>
        </div>
    );
};

export default PromotionModal;
