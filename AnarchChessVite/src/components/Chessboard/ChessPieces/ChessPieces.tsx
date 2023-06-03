import React, { useContext } from "react";

const ChessPiece = ({ toDisplay }: any) => {
    // console.count("piece-render");
    return <div>{toDisplay}</div>;
};

export default ChessPiece;
