'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [countPass, setCountPass] = useState(0);

  const newBoard = structuredClone(board); //structureClone()というboardの配列を変更する関数
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

  //======現在の枚数を表示するための定数の定義======
  //二次元配列のboardをflat()で一次元にならし、filter()で条件にあう要素だけを並べた新しい配列をつくり、その配列の長さを取得する
  const blackAmount: number = newBoard.flat().filter((board) => board === 1).length;
  const whiteAmount: number = newBoard.flat().filter((board) => board === 2).length;
  const redAmount: number = newBoard.flat().filter((board) => board === 3).length;

  //そのx,y座標に次のターンの色の石を置けるかを判定する関数
  const puttableSearch = (x: number, y: number) => {
    //このx,yはそのマスのx,y座標
    //そこに候補地が表示されていたら一度クリーンする
    if (board[y][x] === 3) {
      board[y][x] = 0;
    }
    //そこに白黒があったらreturnして終了
    if (board[y][x] === 1 || board[y][x] === 2) {
      return;
    }
    //そこが空白なら置けるかどうかの探索を開始する
    for (const [dy, dx] of directions) {
      const nextY: number = y + dy;
      const nextX: number = x + dx;
      //隣の石が次のターンの色と異なる色（現在の色）をしているときに石をおける
      if (board[nextY] !== undefined && board[nextY][nextX] === turnColor) {
        //初期値+1に方向のベクトルをj倍かけてそこに空白がないか検索
        for (let j = 1; j < board.length; j++) {
          const extendSearchY: number = dy * j;
          const extendSearchX: number = dx * j;
          if (
            board[nextY + extendSearchY] !== undefined &&
            board[nextY + extendSearchY][nextX + extendSearchX] % 3 === 0
          ) {
            break; //そこに空白と候補地があれば石を置けないのでfor文を終わらせる
          }
          if (
            //行きついた先に次のターンの色の石があったら
            board[nextY + extendSearchY] !== undefined &&
            board[nextY + extendSearchY][nextX + extendSearchX] === 2 / turnColor
          ) {
            newBoard[y][x] = 3; //候補地をおく
          }
        }
      }
    }
  };
  //for文で64マスそれぞれにputtableSearch()を実行して候補地を表示する関数
  const displayPuttableCell = () => {
    //要修正丸パクリいや
    for (let p = 0; p < flatBoard.length; p++) {
      const cordinateX = p % 8;
      const cordinateY = Math.floor(p / 8);
      puttableSearch(cordinateX, cordinateY);
    }
  };

  //クリックして変化する動作はすべてこの関数の中に記述する
  //以下clickHandlerについての関数
  const clickHandler = (clickX: number, clickY: number) => {
    //石があるところをクリックして関数を起動させてはいけない(関数を止めるのでreturn)
    if (board[clickY][clickX] % 3 !== 0) {
      return;
    }

    // console.log(countPass);
    // if (redAmount === 0) {
    //   if (countPass === 0) {
    //     console.log('Pass Your Turn');
    //     setTurnColor(2 / turnColor);
    //     displayPuttableCell();
    //     setBoard(newBoard);
    //     setCountPass(1);
    //     console.log('a');
    //   } else if (countPass === 1 && redAmount === 0) {
    //     console.log('Game Over');
    //   }
    // } else {
    //   setCountPass(0);
    //   console.log('b');
    // }

    //この関数は現在の石を置けるかどうかを調べる関数
    //ここからが置けるかどうかの判定をする一連の処理
    //クリックしたところは空白ではないので関数を実行
    //クリックしたら八方向にむける
    //x, yはクリックしたところ
    for (let i = 0; i < 8; i++) {
      const nextY: number = clickY + directions[i][0];
      const nextX: number = clickX + directions[i][1];
      //隣の石が異なる色をしているときに石をおける
      if (board[nextY] !== undefined && board[nextY][nextX] === 2 / turnColor) {
        for (let j = 1; j < 8; j++) {
          //初期値+1に方向のベクトルをj倍かけてそこに空白がないか検索
          const extendSearchY: number = directions[i][0] * j;
          const extendSearchX: number = directions[i][1] * j;
          if (
            board[nextY + extendSearchY] !== undefined &&
            board[nextY + extendSearchY][nextX + extendSearchX] === 0
          ) {
            break; //そこに空白があれば石を置けないのでfor文を終わらせる
          }
          //初期値+1に方向のベクトルをj倍かけてそこに同じ色がないか検索
          if (
            board[nextY + extendSearchY] !== undefined &&
            board[nextY + extendSearchY][nextX + extendSearchX] === turnColor
          ) {
            newBoard[clickY][clickX] = turnColor;

            //ここで石をひっくり返す
            //for文でkを使う理由はjで数えた分の石をひっくり返すためそれに収まるような変数kを設定
            for (let k = 0; k < j + 1; k++) {
              board[nextY + directions[i][0] * k][nextX + directions[i][1] * k] = turnColor;
            }
            setTurnColor(2 / turnColor);
            displayPuttableCell();
            setBoard(newBoard);

            //パスの判定をここから
            //とりあえず強制終了はあとで
            //とりあえずif文とか組み合わせて汚くてもいいから書き上げる
            if (redAmount === 0) {
              if (countPass === 0) {
                setTurnColor(2 / turnColor);
                displayPuttableCell();
                setCountPass(1);
                console.log('Pass Your Turn');
              } else if (countPass === 1 && redAmount === 0) {
                console.log('Game Over');
              }
              setBoard(newBoard);
              break; //石を置いたのにまだ続けるわけにはいかないから
            }
          }
        }
      }
    }

    return (
      <div className={styles.container}>
        <div className={styles.background}>
          <div className={styles.information}>
            Next color is {turnColor === 1 ? 'BLACK' : 'WHITE'}
          </div>
          <div className={styles.displayAmount}>
            <p className={styles.blackAmount}>BLACK: {blackAmount} </p>
            <p className={styles.whiteAmount}>WHITE: {whiteAmount}</p>
          </div>
        </div>
        <div className={styles.board}>
          {board.map((row, clickY) =>
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
  };
}
