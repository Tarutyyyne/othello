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

  //二次元配列のboardをflat()で一次元にならし、filter()で条件にあう要素だけを並べた新しい配列をつくり、その配列の長さを取得する
  const blackAmount: number = board.flat().filter((board) => board === 1).length;
  const whiteAmount: number = board.flat().filter((board) => board === 2).length;

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
                  style={{ background: color === 1 ? '#000' : '#fff' }} //←これcurretColorの動的な変更に利用できませんか？
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
