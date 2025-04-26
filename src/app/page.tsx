'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 2, 0, 0, 0],
    [0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const clickHandler = (x: number, y: number) => {
    //console.log(x, y);
    const newBoard = structuredClone(board);

    for (let i = 1; i < 8; i++) {
      //クリックした一個下が同じ色の時returnして終了
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
      for (let j = 0; j < i; j++) {
        if (
          //y+jのところが空白または相手の色のときひっくり返す
          (board[y + j] !== undefined && board[y + j][x] === 2 / turnColor) ||
          (board[y + j] !== undefined && board[y + j][x] === 0)
        ) {
          newBoard[y + j][x] = turnColor;

          setTurnColor(2 / turnColor);
          setBoard(newBoard);
        }
      }
      return;
    }
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
