import React, { useContext } from "react";
import { IsDraggableContext } from "@shared/Contexts";

const ChessPiece = ({ toDisplay, onDragStart, onDragStop }: any) => {
    const draggableRef = useContext(IsDraggableContext);
    const nodeRef = React.useRef(null);
    // console.count("piece-render");
    return (
        <div
            ref={nodeRef}
            className="cursor-grab"
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragStop}
        >
            {toDisplay}
        </div>
    );
};

export default ChessPiece;
