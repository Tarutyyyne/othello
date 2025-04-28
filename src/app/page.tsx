'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 0, 0],
    [0, 0, 3, 2, 1, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const newBoard = structuredClone(board);

  const flatBoard = newBoard.flat();

  //上から時計回り
  const directions: [number, number][] = [
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
  ];
  //現在の色を表示
  const [currentColor, setCurrentColor] = useState('BLACK');

  //現在の枚数を表示するための定数の定義
  //二次元配列のboardをflat()で一次元にならし、filter()で条件にあう要素だけを並べた新しい配列をつくり、その配列の長さを取得する
  const blackAmount: number = newBoard.flat().filter((board) => board === 1).length;
  const whiteAmount: number = newBoard.flat().filter((board) => board === 2).length;

  const puttableSearch = (x: number, y: number) => {
    if (newBoard[y][x] === 3) {
      newBoard[y][x] = 0;
    }
    if (newBoard[y][x] === 1 || newBoard[y][x] === 2) {
      return;
    }
    for (const [dy, dx] of directions) {
      const nextY: number = y + dy;
      const nextX: number = x + dx;
      //隣の石が敵の色と異なる色をしているときに石をおける
      if (newBoard[nextY] !== undefined && newBoard[nextY][nextX] === turnColor) {
        //初期値+1に方向のベクトルをj倍かけてそこに空白がないか検索
        for (let j = 1; j < newBoard.length; j++) {
          const extendSearchY: number = dy * j;
          const extendSearchX: number = dx * j;
          if (
            newBoard[nextY + extendSearchY] !== undefined &&
            newBoard[nextY + extendSearchY][nextX + extendSearchX] % 3 === 0
          ) {
            break; //そこに空白があれば石を置けないのでfor文を終わらせる
          }
          if (
            newBoard[nextY + extendSearchY] !== undefined &&
            newBoard[nextY + extendSearchY][nextX + extendSearchX] === 2 / turnColor
          ) {
            newBoard[y][x] = 3; //候補地
          }
        }
      }
    }
  };
  //for文で64マスをそれぞれputtableSearch()を実行して候補地を表示
  const displayPuttableCell = () => {
    //console.log('sex');
    //要修正丸パクリいや
    for (let p = 0; p < flatBoard.length; p++) {
      console.log(p % 8);
      console.log(Math.floor(p / 8));
      const cordinateX = p % 8;
      const cordinateY = Math.floor(p / 8);
      puttableSearch(cordinateX, cordinateY);
    }
  };

  const clickHandler = (clickX: number, clickY: number) => {
    //クリックして変化する動作はすべてこの関数の中に記述する
    //以下clickHandlerについての関数
    //以下structureClone()というboardの配列を変更する関数
    //石があるところをクリックして関数を起動させてはいけない(関数を止めるのでreturn)
    if (newBoard[clickY][clickX] % 3 !== 0) {
      return;
    }

    //この関数を全てのマスで実行して候補地表示したい
    //型注釈は要検討,置けるか否かのboolean型の値を返したい
    //この関数は現在の石を置けるかどうかを調べる関数
    //ここからが置けるかどうかの判定をする一連の処理
    //クリックしたところは空白ではないので関数を実行
    //クリックしたら八方向にむける
    //x, yはクリックしたところ
    for (let i = 0; i < 8; i++) {
      const newY: number = clickY + directions[i][0];
      const newX: number = clickX + directions[i][1];
      //隣の石が異なる色をしているときに石をおける
      if (newBoard[newY] !== undefined && newBoard[newY][newX] === 2 / turnColor) {
        for (let j = 1; j < 8; j++) {
          //初期値+1に方向のベクトルをj倍かけてそこに空白がないか検索
          const extendSearchY: number = directions[i][0] * j;
          const extendSearchX: number = directions[i][1] * j;
          if (
            newBoard[newY + extendSearchY] !== undefined &&
            newBoard[newY + extendSearchY][newX + extendSearchX] === 0
          ) {
            break; //そこに空白があれば石を置けないのでfor文を終わらせる
          }
          //初期値+1に方向のベクトルをj倍かけてそこに同じ色がないか検索
          if (
            newBoard[newY + extendSearchY] !== undefined &&
            newBoard[newY + extendSearchY][newX + extendSearchX] === turnColor
          ) {
            newBoard[clickY][clickX] = turnColor;

            //ここで石をひっくり返す
            //for文でkを使う理由はjで数えた分の石をひっくり返すためそれに収まるような変数kを設定
            for (let k = 0; k < j + 1; k++) {
              newBoard[newY + directions[i][0] * k][newX + directions[i][1] * k] = turnColor;
            }
            setTurnColor(2 / turnColor);
            displayPuttableCell();
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
        {newBoard.map((row, clickY) =>
          row.map((color, clickX) => (
            <div
              className={styles.cell}
              key={`${clickX}-${clickY}`}
              onClick={() => clickHandler(clickX, clickY)}
            >
              {color !== 0 && (
                <div
                  className={styles.stone}
                  //style={{ background: color === 1 ? '#000' : '#fff' }} //←これcurretColorの動的な変更に利用できませんか？
                  style={{ background: color === 1 ? '#000' : color === 2 ? '#fff' : '#f00' }}
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
