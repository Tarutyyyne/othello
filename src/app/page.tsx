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
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const directions = [
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
  ];
  const clickHandler = (x: number, y: number) => {
    //console.log(x, y);
    const newBoard = structuredClone(board);
    //クリックしたところが空白じゃなければreturnする
    if (board[y][x] !== 0) {
      return;
    }
    //クリックしたら八方向にむける
    for (let i = 0; i < 8; i++) {
      const newY: number = y + directions[i][0];
      const newX: number = x + directions[i][1];
      //board[newY]は存在しない配列を指すのでそこの要素を指定することはできない[newX]は不要
      //周囲の空白のところの処理を飛ばす
      if (board[newY] !== undefined && board[newY][newX] === 0) {
        continue;
      }
      console.log(i);
      console.log(board);
      //隣の石が異なる色をしているときに石をおける
      if (board[newY] !== undefined && board[newY][newX] === 2 / turnColor) {
        for (let j = 1; j < 8; j++) {
          if (
            board[newY + directions[i][0] * j] !== undefined &&
            board[newY + directions[i][0] * j][newX + directions[i][1] * j] === 0
          ) {
            console.log(`a${j}`);
            break;
          }
          if (
            board[newY + directions[i][0] * j] !== undefined &&
            board[newY + directions[i][0] * j][newX + directions[i][1] * j] === turnColor
          ) {
            newBoard[y][x] = turnColor;
            for (let k = 0; k < j + 1; k++) {
              newBoard[newY + directions[i][0] * k][newX + directions[i][1] * k] = turnColor;
              console.log(j, k);
            }
            setTurnColor(2 / turnColor);
            setBoard(newBoard);
            break;
          }

          console.log(newY, newX);
        }
      }
    }
  };

  const reverseBelow = (x: number, y: number, newBoard: number[][]) => {
    //下方向
    for (let i = 0; i < 8; i++) {
      const newY: number = y + directions[4][0] * i;
      console.log(i);
      //クリックした一個下が同じ色の時returnして終了
      if (board[newY] !== undefined && board[newY][x] === turnColor && i === 1) {
        console.log(x, newY);
        return;
      }
      //iがどのような値でも石の下に空白があるときreturnして終了
      if (board[newY] !== undefined && board[newY][x] === 0 && i !== 0) {
        console.log(x, newY);
        return;
      }
      console.log('w');
      //石の下に相手の色のがあるときcontinueしてfor文を続ける
      if (board[newY] !== undefined && board[newY][x] === 2 / turnColor) {
        continue;
      }

      console.log('A');
      //一個下が相手の色でそれより下に空白がなくて自分の色があるとき石を置ける
      for (let j = 0; j < i + 1; j++) {
        if (
          //y+jのところが空白または相手の色のときひっくり返す
          (board[y + j] !== undefined && board[y + j][x] === 2 / turnColor) ||
          (board[y + j] !== undefined && board[y + j][x] === 0)
        ) {
          newBoard[y + j][x] = turnColor;
          console.log('turncolor');
          setTurnColor(2 / turnColor);
          setBoard(newBoard);
        }
      }
      //return;
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
