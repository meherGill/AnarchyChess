import React, { useState } from "react";
import { ChessSquareColor } from "../../shared/enums";

interface ChessSquarePropsInterface {
    squareColor: ChessSquareColor;
}

const ChessSquare = ({ squareColor }: ChessSquarePropsInterface) => {
    let bgToUse: string;
    if (squareColor === ChessSquareColor.dark) {
        bgToUse = "bg-black";
    } else if (squareColor === ChessSquareColor.light) {
        bgToUse = "bg-white";
    }
};
const Chessboard = () => {
    const [chess2dArr, setChess2dArr] = useState<Array<Array<any>>>(() => {
        let twoDArr = [];
        for (let i = 0; i < 8; i++) {
            twoDArr.push(new Array(8).fill(null));
        }
        return twoDArr;
    });
    return (
        <div>
            <div className="h-screen bg-red-900">
                {chess2dArr.map((el, ndx) => {
                    return <div></div>;
                })}
            </div>
        </div>
    );
};

export default Chessboard;
