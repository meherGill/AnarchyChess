# Diff Details

Date : 2023-06-10 01:49:48

Directory /Users/meherwangill/programming/AnarchyChess/AnarchyChess/AnarchChessVite/src/components/ChessLogic

Total : 36 files,  -1302 codes, -18 comments, -112 blanks, all -1432 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [AnarchChessVite/src/App.tsx](/AnarchChessVite/src/App.tsx) | TypeScript JSX | -23 | 0 | -4 | -27 |
| [AnarchChessVite/src/assets/Pieces/black_bishop.svg](/AnarchChessVite/src/assets/Pieces/black_bishop.svg) | XML | -12 | 0 | -1 | -13 |
| [AnarchChessVite/src/assets/Pieces/black_king.svg](/AnarchChessVite/src/assets/Pieces/black_king.svg) | XML | -12 | 0 | -1 | -13 |
| [AnarchChessVite/src/assets/Pieces/black_knight.svg](/AnarchChessVite/src/assets/Pieces/black_knight.svg) | XML | -22 | 0 | -1 | -23 |
| [AnarchChessVite/src/assets/Pieces/black_knook.svg](/AnarchChessVite/src/assets/Pieces/black_knook.svg) | XML | -172 | -1 | -1 | -174 |
| [AnarchChessVite/src/assets/Pieces/black_pawn.svg](/AnarchChessVite/src/assets/Pieces/black_pawn.svg) | XML | -5 | 0 | -1 | -6 |
| [AnarchChessVite/src/assets/Pieces/black_queen.svg](/AnarchChessVite/src/assets/Pieces/black_queen.svg) | XML | -26 | 0 | -2 | -28 |
| [AnarchChessVite/src/assets/Pieces/black_rook.svg](/AnarchChessVite/src/assets/Pieces/black_rook.svg) | XML | -39 | 0 | -1 | -40 |
| [AnarchChessVite/src/assets/Pieces/white_bishop.svg](/AnarchChessVite/src/assets/Pieces/white_bishop.svg) | XML | -12 | 0 | -1 | -13 |
| [AnarchChessVite/src/assets/Pieces/white_king.svg](/AnarchChessVite/src/assets/Pieces/white_king.svg) | XML | -9 | 0 | 0 | -9 |
| [AnarchChessVite/src/assets/Pieces/white_knight.svg](/AnarchChessVite/src/assets/Pieces/white_knight.svg) | XML | -19 | 0 | -1 | -20 |
| [AnarchChessVite/src/assets/Pieces/white_knook.svg](/AnarchChessVite/src/assets/Pieces/white_knook.svg) | XML | -172 | -1 | -1 | -174 |
| [AnarchChessVite/src/assets/Pieces/white_pawn.svg](/AnarchChessVite/src/assets/Pieces/white_pawn.svg) | XML | -5 | 0 | -1 | -6 |
| [AnarchChessVite/src/assets/Pieces/white_queen.svg](/AnarchChessVite/src/assets/Pieces/white_queen.svg) | XML | -15 | 0 | -1 | -16 |
| [AnarchChessVite/src/assets/Pieces/white_rook.svg](/AnarchChessVite/src/assets/Pieces/white_rook.svg) | XML | -25 | 0 | -1 | -26 |
| [AnarchChessVite/src/assets/react.svg](/AnarchChessVite/src/assets/react.svg) | XML | -1 | 0 | 0 | -1 |
| [AnarchChessVite/src/components/Chessboard/ChessPieces/ChessPieces.tsx](/AnarchChessVite/src/components/Chessboard/ChessPieces/ChessPieces.tsx) | TypeScript JSX | -38 | 0 | -6 | -44 |
| [AnarchChessVite/src/components/Chessboard/ChessSquare.tsx](/AnarchChessVite/src/components/Chessboard/ChessSquare.tsx) | TypeScript JSX | -52 | -1 | -8 | -61 |
| [AnarchChessVite/src/components/Chessboard/Chessboard.css](/AnarchChessVite/src/components/Chessboard/Chessboard.css) | CSS | 0 | 0 | -1 | -1 |
| [AnarchChessVite/src/components/Chessboard/Chessboard.tsx](/AnarchChessVite/src/components/Chessboard/Chessboard.tsx) | TypeScript JSX | -163 | -7 | -13 | -183 |
| [AnarchChessVite/src/components/TurnToPlayBanner/TurnToPlayBanner.tsx](/AnarchChessVite/src/components/TurnToPlayBanner/TurnToPlayBanner.tsx) | TypeScript JSX | -78 | -3 | -5 | -86 |
| [AnarchChessVite/src/index.css](/AnarchChessVite/src/index.css) | CSS | -3 | 0 | 0 | -3 |
| [AnarchChessVite/src/main.tsx](/AnarchChessVite/src/main.tsx) | TypeScript JSX | -9 | 0 | -2 | -11 |
| [AnarchChessVite/src/shared/ChessPiecesMapped.tsx](/AnarchChessVite/src/shared/ChessPiecesMapped.tsx) | TypeScript JSX | -32 | 0 | -4 | -36 |
| [AnarchChessVite/src/shared/Contexts.ts](/AnarchChessVite/src/shared/Contexts.ts) | TypeScript | -1 | 0 | 0 | -1 |
| [AnarchChessVite/src/shared/Contexts/ModalContext.tsx](/AnarchChessVite/src/shared/Contexts/ModalContext.tsx) | TypeScript JSX | -19 | 0 | -4 | -23 |
| [AnarchChessVite/src/shared/Contexts/TurnToPlayContext.tsx](/AnarchChessVite/src/shared/Contexts/TurnToPlayContext.tsx) | TypeScript JSX | -25 | 0 | -4 | -29 |
| [AnarchChessVite/src/shared/Hooks/useModal.ts](/AnarchChessVite/src/shared/Hooks/useModal.ts) | TypeScript | -13 | 0 | -3 | -16 |
| [AnarchChessVite/src/shared/Modal/Modal.tsx](/AnarchChessVite/src/shared/Modal/Modal.tsx) | TypeScript JSX | -35 | 0 | -4 | -39 |
| [AnarchChessVite/src/shared/Modal/PromotionModal.tsx](/AnarchChessVite/src/shared/Modal/PromotionModal.tsx) | TypeScript JSX | -82 | 0 | -9 | -91 |
| [AnarchChessVite/src/shared/chessboardConfigs.ts](/AnarchChessVite/src/shared/chessboardConfigs.ts) | TypeScript | -32 | 0 | -4 | -36 |
| [AnarchChessVite/src/shared/enums.ts](/AnarchChessVite/src/shared/enums.ts) | TypeScript | -54 | -4 | -7 | -65 |
| [AnarchChessVite/src/shared/helperFunctionsForTest.ts](/AnarchChessVite/src/shared/helperFunctionsForTest.ts) | TypeScript | -16 | 0 | -3 | -19 |
| [AnarchChessVite/src/shared/types.ts](/AnarchChessVite/src/shared/types.ts) | TypeScript | -31 | 0 | -5 | -36 |
| [AnarchChessVite/src/shared/utility.ts](/AnarchChessVite/src/shared/utility.ts) | TypeScript | -50 | 0 | -11 | -61 |
| [AnarchChessVite/src/vite-env.d.ts](/AnarchChessVite/src/vite-env.d.ts) | TypeScript | 0 | -1 | -1 | -2 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details