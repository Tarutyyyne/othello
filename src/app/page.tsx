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
    [-1, 0], //上
    [-1, 1], //右上
    [0, 1], //右
    [1, 1], //右下
    [1, 0], //下
    [1, -1], //左下
    [0, -1], //左
    [-1, -1], //左上
  ];
  const [currentColor, setCurrentColor] = useState('BLACK');

  const board0black: number[] = board[0].filter((board) => board === 1);
  const board1black: number[] = board[1].filter((board) => board === 1);
  const board2black: number[] = board[2].filter((board) => board === 1);
  const board3black: number[] = board[3].filter((board) => board === 1);
  const board4black: number[] = board[4].filter((board) => board === 1);
  const board5black: number[] = board[5].filter((board) => board === 1);
  const board6black: number[] = board[6].filter((board) => board === 1);
  const board7black: number[] = board[7].filter((board) => board === 1);
  const blackAmount: number =
    board0black.length +
    board1black.length +
    board2black.length +
    board3black.length +
    board4black.length +
    board5black.length +
    board6black.length +
    board7black.length;
  const board0white: number[] = board[0].filter((board) => board === 2);
  const board1white: number[] = board[1].filter((board) => board === 2);
  const board2white: number[] = board[2].filter((board) => board === 2);
  const board3white: number[] = board[3].filter((board) => board === 2);
  const board4white: number[] = board[4].filter((board) => board === 2);
  const board5white: number[] = board[5].filter((board) => board === 2);
  const board6white: number[] = board[6].filter((board) => board === 2);
  const board7white: number[] = board[7].filter((board) => board === 2);
  const whiteAmount: number =
    board0white.length +
    board1white.length +
    board2white.length +
    board3white.length +
    board4white.length +
    board5white.length +
    board6white.length +
    board7white.length;

  const clickHandler = (x: number, y: number) => {
    //クリックして変化する動作はすべてこの関数の中に記述する
    //以下clickHandlerについての関数
    //console.log(x, y);
    const newBoard = structuredClone(board); //以下structureClone()というboardの配列を変更する関数
    //クリックしたところが空白じゃなければreturnする

    if (board[y][x] !== 0) {
      return; //石があるところをクリックして関数を起動させてはいけない(関数を止める)
    }
    //クリックしたところは空白ではないので関数を実行
    //クリックしたら八方向にむける
    for (let i = 0; i < 8; i++) {
      const newY: number = y + directions[i][0];
      const newX: number = x + directions[i][1];
      //隣の石が異なる色をしているときに石をおける
      if (board[newY] !== undefined && board[newY][newX] === 2 / turnColor) {
        for (let j = 1; j < 8; j++) {
          //初期値+1に方向のベクトルをj倍かけてそこに空白がないか検索
          const extendSearchY: number = directions[i][0] * j;
          const extendSearchX: number = directions[i][1] * j;
          if (
            board[newY + extendSearchY] !== undefined &&
            board[newY + extendSearchY][newX + extendSearchX] === 0
          ) {
            break; //そこに空白があれば石を置けないのでfor文を終わらせる
          }
          //初期値+1に方向のベクトルをj倍かけてそこに同じ色がないか検索
          if (
            board[newY + extendSearchY] !== undefined &&
            board[newY + extendSearchY][newX + extendSearchX] === turnColor
          ) {
            newBoard[y][x] = turnColor;
            //ここで石をひっくり返す
            //for文でkを使う理由はjで数えた分の石をひっくり返すためそれに収まるような変数kを設定
            for (let k = 0; k < j + 1; k++) {
              newBoard[newY + directions[i][0] * k][newX + directions[i][1] * k] = turnColor;
            }
            setTurnColor(2 / turnColor);
            setBoard(newBoard);

            if (turnColor === 1) {
              setCurrentColor('WHITE');
            } else {
              setCurrentColor('BLACK');
            }

            // for (let l: number = 0; l < board.length; l++) {
            //   const blackArray = board[l].forEach((value) => {
            //     value === 1;
            //   });
            // }
            // console.log(blackArray);

            break; //石を置いたのにまだ続けるわけにはいかないから
          }
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.information}>Next color is {currentColor}</div>
        <div className={styles.displayAmount}>
          <p className={styles.blackAmount}>BLACK: {blackAmount} </p>
          <p className={styles.whiteAmount}>WHITE: {whiteAmount}</p>
        </div>
      </div>
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
