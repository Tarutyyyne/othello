'use client';

import { useState } from 'react';
import styles from './page.module.css';

//白、黒、候補地の数を呼び出す関数
//boardを渡し、それをflat()で一次元にならし、filter()で条件にあう要素だけを並べた新しい配列をつくり、その配列の長さを取得する
//3つの個数をそれぞれamountArrayに挿入、引数amountIndexで要素を指定しreturnで個数を呼び出す
//引数：board: number[][], amountIndex: number
//戻り値：amountArray[amountIndex]
const getColorAmount = (newBoard: number[][], amountIndex: number) => {
  const emptyAmount: number = newBoard.flat().filter((newBoard) => newBoard === 0).length; //#TODO emptyAmountは後で何かしらに使いたい
  const blackAmount: number = newBoard.flat().filter((newBoard) => newBoard === 1).length;
  const whiteAmount: number = newBoard.flat().filter((newBoard) => newBoard === 2).length;
  const redAmount: number = newBoard.flat().filter((newBoard) => newBoard === 3).length;
  const amountArray: number[] = [emptyAmount, blackAmount, whiteAmount, redAmount];
  return amountArray[amountIndex];
};

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
  board: number[][], //#TODOあとでチェックする
  newBoard: number[][],
  directions: number[][],
  x: number,
  y: number,
  turnColor: number,
) => {
  //#TODOこのifとforを減らしたい
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

//============以下home====================================
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
  const [countPass, setCountPass] = useState(0);

  //以下structureClone()というboardの配列を変更する関数
  const newBoard: number[][] = structuredClone(board);

  const clickHandler = (
    x: number,
    y: number,
    board: number[][],
    newBoard: number[][],
    directions: number[][],
    turnColor: number,
    countPass: number,
  ) => {
    //クリックしたところが空白じゃなければreturnする
    if (board[y][x] % 3 !== 0) {
      return; //白と黒の石があるところをクリックして関数を起動させてはいけない(関数を止める)
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

            //パスと強制終了の実装
            //まずdisplayPuttableCellで候補地を検索
            //候補地が0のときならばsetCountPass(1)を実行、「パス」を表示
            //
            displayPuttableCell(board, newBoard, directions, turnColor);
            if (getColorAmount(newBoard, 3) === 0) {
              console.log('a');
              setCountPass(1); //setCountPass(1)で●●のパスと表示できるはず
              displayPuttableCell(board, newBoard, directions, 2 / turnColor);
              if (getColorAmount(newBoard, 3) === 0) {
                console.log('b');
                setCountPass(2);
              }
            } else {
              setTurnColor(2 / turnColor);
              setCountPass(0);
            }
            setBoard(newBoard);

            break; //石を置いたのにまだ続けるわけにはいかないから
          }
        }
      }
    }
    if (getColorAmount(newBoard, 1) + getColorAmount(newBoard, 2) === 64) {
      setCountPass(2);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.gameLogBackground}
        style={{ background: turnColor === 1 ? '#000' : '#f8f8ff' }}
      >
        <div className={styles.gameLogInformation}>
          {countPass === 2 ? (
            <div>
              ゲームセット：{Math.abs(getColorAmount(board, 1) - getColorAmount(board, 2))}枚差で
              {getColorAmount(board, 1) < getColorAmount(board, 2)
                ? '白の勝ち！'
                : getColorAmount(board, 1) > getColorAmount(board, 2)
                  ? '黒の勝ち！'
                  : '引き分け！'}
            </div>
          ) : (
            <div>
              {countPass === 1 && `${2 / turnColor === 1 ? '黒' : '白'} のパス：`}
              次は{turnColor === 1 ? '黒' : '白'}のターン
            </div>
          )}
        </div>
        {/* <div className={styles.displayAmount}>
          <p className={styles.blackAmount}>BLACK: {getColorAmount(board, 1)} </p>
          <p className={styles.whiteAmount}>WHITE: {getColorAmount(board, 2)}</p>
        </div> */}
      </div>
      <div className={styles.gapSpace} />
      {/* 黒の石の情報 */}
      <div className={styles.stoneInformation}>
        <div className={styles.stone} style={{ background: '#000' }} />
        <div className={styles.stoneAmount}>{getColorAmount(board, 1)}枚</div>
      </div>
      <div className={styles.gapSpace} />
      {/* ボードの情報 */}
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div
              className={styles.cell}
              key={`${x}-${y}`}
              onClick={() => clickHandler(x, y, board, newBoard, directions, turnColor, countPass)}
            >
              {color !== 0 && (
                <div
                  className={styles.stone}
                  style={{
                    background:
                      color === 1
                        ? '#000'
                        : color === 2
                          ? '#f8f8ff'
                          : turnColor === 1
                            ? '#000'
                            : '#f8f8ff',
                    width: color === 3 ? '24px' : '56px',
                    height: color === 3 ? '24px' : '56px',
                  }}
                />
              )}
            </div>
          )),
        )}
      </div>
      <div className={styles.gapSpace} />
      {/* 白の石の情報 */}
      <div className={styles.stoneInformation}>
        <div className={styles.stoneAmount}>{getColorAmount(board, 2)}枚</div>
        <div className={styles.stone} style={{ background: '#f8f8ff' }} />
      </div>
    </div>
  );
}

// #TODO何枚優勢なのか表示するのかは任せる
//そのためにはif文回す必要あり
