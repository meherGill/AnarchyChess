import { ISquareCoordinate, IGeneratedMoves } from "./types";

export const customSortFn = (a: ISquareCoordinate, b: ISquareCoordinate) => {
    if (a.row < b.row) {
        return -1;
    } else if (a.row > b.row) {
        return 1;
    } else {
        return a.column - b.column;
    }
};

export const customSortFnWithActions = (a: IGeneratedMoves, b: IGeneratedMoves) => {
    return customSortFn(a.coord, b.coord)
}

export const getCoordsOnly = (generatedMoves: Array<IGeneratedMoves>) => {
    return generatedMoves.map(move => move.coord)
}