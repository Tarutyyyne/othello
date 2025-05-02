'use client';

import { useState } from 'react';
import styles from './page.module.css';

//方向を示すための配列、上から時計回り
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

//そのx,y座標に次のターンの色の石を置けるかを判定する関数
const puttableSearch = (
  board: number[][],
  newBoard: number[][],
  directions: number[][],
  x: number,
  y: number,
  turnColor: number,
) => {
  //このx,yはそのマスのx,y座標
  //そこに候補地が表示されていたら一度クリーンする
  if (newBoard[y][x] === 3) {
    newBoard[y][x] = 0;
  }
  //そこに白黒があったらreturnして終了
  if (newBoard[y][x] === 1 || newBoard[y][x] === 2) {
    return;
  }
  //そこが空白なら置けるかどうかの探索を開始する
  for (const [dy, dx] of directions) {
    const nextY: number = y + dy;
    const nextX: number = x + dx;
    //隣の石が次のターンの色と異なる色（現在の色）をしているときに石をおける
    if (newBoard[nextY] !== undefined && newBoard[nextY][nextX] === turnColor) {
      //初期値+1に方向のベクトルをj倍かけてそこに空白がないか検索
      for (let j = 1; j < newBoard.length; j++) {
        const extendSearchY: number = dy * j;
        const extendSearchX: number = dx * j;
        if (
          newBoard[nextY + extendSearchY] !== undefined &&
          newBoard[nextY + extendSearchY][nextX + extendSearchX] % 3 === 0
        ) {
          break; //そこに空白と候補地があれば石を置けないのでfor文を終わらせる
        }
        if (
          //行きついた先に次のターンの色の石があったら
          newBoard[nextY + extendSearchY] !== undefined &&
          newBoard[nextY + extendSearchY][nextX + extendSearchX] === 2 / turnColor
        ) {
          newBoard[y][x] = 3; //候補地をおく
        }
      }
    }
  }
};

//64マス一つ一つにputtableSearchを実行させる
//for文でiを64まで回しそのマスのｘ、ｙ座標（coordinateX, coordinateY）を求めそれをputtableSearchに渡す
//引数：board, newBoard, directions, turnColor
//戻り値：なし
const displayPuttableCell = (
  board: number[][],
  newBoard: number[][],
  directions: number[][],
  turnColor: number,
) => {
  for (let p = 0; p < board.flat().length; p++) {
    const coordinateX = p % 8;
    const coordinateY = Math.floor(p / 8);
    puttableSearch(board, newBoard, directions, coordinateX, coordinateY, turnColor);
  }
};

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 3, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 0, 0],
    [0, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const newBoard = structuredClone(board); //以下structureClone()というboardの配列を変更する関数

  //二次元配列のboardをflat()で一次元にならし、filter()で条件にあう要素だけを並べた新しい配列をつくり、その配列の長さを取得する
  const blackAmount: number = board.flat().filter((board) => board === 1).length;
  const whiteAmount: number = board.flat().filter((board) => board === 2).length;
  const redAmount: number = board.flat().filter((board) => board === 3).length;
  //countPassをここで定義;
  const [countPass, setCountPass] = useState(0);

  const clickHandler = (x: number, y: number) => {
    //クリックして変化する動作はすべてこの関数の中に記述する
    //以下clickHandlerについての関数
    //クリックしたところが空白じゃなければreturnする

    if (board[y][x] % 3 !== 0) {
      return; //白と黒の石があるところをクリックして関数を起動させてはいけない(関数を止める)
    }
    //候補地の表示がなくなったときにパスを実行
    if (redAmount === 0) {
      if (countPass === 0) {
        setTurnColor(2 / turnColor);
        displayPuttableCell(board, newBoard, directions, turnColor);
        setCountPass(1);
        console.log('Pass Your Turn');
      }
      if (countPass === 1) {
        if (redAmount === 0) {
          console.log('Game Over');
        }
      }
    }
    //クリックしたところは空白ではないので関数を実行
    //クリックしたら八方向にむける
    for (let i = 0; i < 8; i++) {
      const nextY: number = y + directions[i][0];
      const nextX: number = x + directions[i][1];
      //隣の石が異なる色をしているときに石をおける
      if (newBoard[nextY] !== undefined && newBoard[nextY][nextX] === 2 / turnColor) {
        for (let j = 1; j < 8; j++) {
          //初期値+1に方向のベクトルをj倍かけてそこに空白がないか検索
          const extendSearchY: number = directions[i][0] * j;
          const extendSearchX: number = directions[i][1] * j;
          if (
            newBoard[nextY + extendSearchY] !== undefined &&
            newBoard[nextY + extendSearchY][nextX + extendSearchX] === 0
          ) {
            break; //そこに空白があれば石を置けないのでfor文を終わらせる
          }
          //初期値+1に方向のベクトルをj倍かけてそこに同じ色がないか検索
          if (
            newBoard[nextY + extendSearchY] !== undefined &&
            newBoard[nextY + extendSearchY][nextX + extendSearchX] === turnColor
          ) {
            newBoard[y][x] = turnColor;
            //ここで石をひっくり返す
            //for文でkを使う理由はjで数えた分の石をひっくり返すためそれに収まるような変数kを設定
            for (let k = 0; k < j + 1; k++) {
              newBoard[nextY + directions[i][0] * k][nextX + directions[i][1] * k] = turnColor;
            }
            displayPuttableCell(board, newBoard, directions, turnColor);
            setTurnColor(2 / turnColor);
            setBoard(newBoard);
            setCountPass(0);

            break; //石を置いたのにまだ続けるわけにはいかないから
          }
        }
      }
    }
  };

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
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              {color !== 0 && (
                <div
                  className={styles.stone}
                  style={{ background: color === 1 ? '#000' : color === 2 ? '#fff' : '#f00' }} //←これcurretColorの動的な変更に利用できませんか？
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
