'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 2, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
  ]);

  const clickHandler = (x: number, y: number) => {
    //console.log(x, y);
    const newBoard = structuredClone(board);

    for (let i = 1; i < 8; i++) {
      //一個下が同じ色の時returnして終了
      if (board[y + i] !== undefined && board[y + i][x] === turnColor && i === 1) {
        console.log(x, y + i);
        return;
      }
      //iがどのような値でも石の下に空白があるときreturnして終了
      if (board[y + i] !== undefined && board[y + i][x] === 0) {
        console.log(x, y + i);
        return;
      }
      //石の下に相手の色のがあるときcontinueしてfor文を続ける
      if (board[y + i] !== undefined && board[y + i][x] === 2 / turnColor) {
        continue;
      }
      //一個下が相手の色でそれより下に空白がなくて自分の色があるとき石を置ける
      newBoard[y][x] = turnColor;
      setTurnColor(2 / turnColor);
      setBoard(newBoard);
    }

    // if (
    //   board[y + i] !== undefined &&
    //   board[y + i][x] === 2 / turnColor && //下は違う色
    //   board[y + 2][x] === turnColor
    // ) {
    //   newBoard[y][x] = turnColor;
    //   newBoard[y + 1][x] = turnColor;
    //   setTurnColor(2 / turnColor); //ターンを変える
    // }
    //setBoard(newBoard); //盤面を更新
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              {color !== 0 && (
                <div
                  className={styles.stone}
                  style={{ background: color === 1 ? '#000' : '#fff' }}
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
