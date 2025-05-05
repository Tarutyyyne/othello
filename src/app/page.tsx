'use client';

import { useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import styles from './page.module.css';

//白、黒、候補地の数を呼び出す関数
//boardを渡し、それをflat()で一次元にならし、filter()で条件にあう要素だけを並べた新しい配列をつくり、その配列の長さを取得する
//3つの個数をそれぞれamountArrayに挿入、引数amountIndexで要素を指定しreturnで個数を呼び出す
//引数：board: number[][], amountIndex: number
//戻り値：amountArray[amountIndex]
const getColorAmount = (newBoard: number[][], amountIndex: number) => {
  const emptyAmount: number = newBoard.flat().filter((newBoard) => newBoard === 0).length;
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
  // board: number[][], //#TODOあとでチェックする
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
    puttableSearch(newBoard, directions, coordinateX, coordinateY, turnColor);
  }
};

// const restBlackStone: number[] = [
//   0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
//   27, 28, 29,
// ];
//上のやり方はスマートじゃないので以下のやり方を使う
//もっとも推奨されるのはこのやり方
//{ length: 30 }からArray.fromに渡すことで「長さ30の空配列」ができる
//その各要素に対して、マッピング関数(-, i) => i + 1 を適用させることで[1, 2, 3, ...30]の配列が作成
//別のやり方として下記のスプレッド構文があるがこれは型注釈の警告が出るので使わないことにした
//const restWhiteStone: number[] = ([...Array(30)] as number[]).map((_, i) => i + 1);
const restBlackStone: number[] = Array.from({ length: 30 }, (_, i) => i + 1);
const restWhiteStone: number[] = Array.from({ length: 30 }, (_, i) => i + 1);

const reduceRestStone = (turnColor: number, restBlackStone: number[], restWhiteStone: number[]) => {
  //お互いに石がまだ手元にあるとき
  //そのターンの石が置かれたら、そのターンの色の人の手元の石の減らす
  if (restBlackStone.length !== 0 && restWhiteStone.length !== 0) {
    if (turnColor === 1) {
      restBlackStone.pop();
      return restBlackStone.length;
    } else if (turnColor === 2) {
      restWhiteStone.pop();
      return restWhiteStone.length;
    } else {
      return;
    }
    //どちらかの石が手元からなくなったら相手の手元にある石を拝借して減らす
  } else {
    if (restBlackStone.length === 0) {
      restWhiteStone.pop();
      return;
    } else {
      restBlackStone.pop();
      return;
    }
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
  const stonePutRef = useRef(false);

  //以下structureClone()というboardの配列を変更する関数
  const newBoard: number[][] = structuredClone(board);

  const clickHandler = (
    x: number,
    y: number,
    board: number[][],
    newBoard: number[][],
    directions: number[][],
    turnColor: number,
  ) => {
    //クリックしたところが
    // 空白じゃなければreturnする
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
            newBoard[nextY + extendSearchY][nextX + extendSearchX] % 3 === 0
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
            displayPuttableCell(board, newBoard, directions, turnColor);
            if (getColorAmount(newBoard, 3) === 0) {
              setCountPass(1); //setCountPass(1)で●●のパスと表示できるはず
              displayPuttableCell(board, newBoard, directions, 2 / turnColor);
              if (getColorAmount(newBoard, 3) === 0) {
                setCountPass(2);
              }
            } else {
              setTurnColor(2 / turnColor);
              setCountPass(0);
            }
            setBoard(newBoard);
            //ここでstonePutRefをtrueにして残りの石の表示を一度だけ変更できるようにしたい
            if (!stonePutRef.current) {
              stonePutRef.current = true;
            }
            break; //石を置いたのにまだ続けるわけにはいかないから
          }
        }
      }
    }
    //全て置けたら終了にする
    if (getColorAmount(newBoard, 1) + getColorAmount(newBoard, 2) === 64) {
      setCountPass(2);
    }
    //ここで一度だけ手元の残りの石の表示を変更する
    if (stonePutRef.current === true) {
      reduceRestStone(turnColor, restBlackStone, restWhiteStone);
      stonePutRef.current = false;
    }
  };

  //リスタートボタンの中身
  const resetHandler = () => {
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <div className={styles.turnAndResetButton}>
        <div className={styles.displayTurn}>
          {64 - restBlackStone.length - restWhiteStone.length - 4}
          手目
        </div>
        <button className={styles.resetButton} onClick={() => resetHandler()}>
          リスタート
        </button>
      </div>
      <div className={styles.gapSpace} />

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
      </div>
      <div className={styles.gapSpace} />
      <div className={styles.gapSpace} />
      <div className={styles.gapSpace} />
      {/* ↓↓↓スマホで表示したときに変更させる↓↓↓ */}
      <div>
        {isMobile ? (
          <div className={styles.stoneInformation}>
            <div
              className={styles.stone}
              style={{
                fontSize: '200%',
                background: '#000',
                height: '100%',
                aspectRatio: '1 / 1',
                color: '#f8f8ff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {getColorAmount(board, 1)}
            </div>
            <div className={styles.stoneHolder}>
              {Array.from({ length: restBlackStone.length }, (_, i) => (
                <div className={styles.restStone} key={i}>
                  <div className={styles.restBlackStone} />
                  <div className={styles.restWhiteStone} />
                </div>
              ))}
            </div>
            <div className={styles.adjustDesign} />
          </div>
        ) : (
          <div className={styles.stoneInformation}>
            <div className={styles.stone} style={{ background: '#000' }} />
            <div className={styles.stoneAmount}>{getColorAmount(board, 1)}枚</div>
            <div className={styles.stoneHolder}>
              {Array.from({ length: restBlackStone.length }, (_, i) => (
                <div className={styles.restStone} key={i}>
                  <div className={styles.restBlackStone} />
                  <div className={styles.restWhiteStone} />
                </div>
              ))}
            </div>
            <div className={styles.adjustDesign} />
          </div>
        )}
      </div>
      <div className={styles.gapSpace} />
      {/* ボードの情報 */}
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div
              className={styles.cell}
              key={`${x}-${y}`}
              onClick={() => clickHandler(x, y, board, newBoard, directions, turnColor)}
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
                    width: color === 3 ? '30%' : '70%',
                    height: color === 3 ? '30%' : '70%',
                  }}
                />
              )}
            </div>
          )),
        )}
      </div>
      <div className={styles.gapSpace} />
      {/* 白の石の情報 */}
      <div>
        {isMobile ? (
          <div className={styles.stoneInformation}>
            <div className={styles.adjustDesign} />
            <div className={styles.stoneHolder}>
              {Array.from({ length: restBlackStone.length }, (_, i) => (
                <div className={styles.restStone} key={i}>
                  <div className={styles.restBlackStone} />
                  <div className={styles.restWhiteStone} />
                </div>
              ))}
            </div>
            <div
              className={styles.stone}
              style={{
                fontSize: '200%',
                background: '#f8f8ff',
                height: '100%',
                aspectRatio: '1 / 1',
                color: '#000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {getColorAmount(board, 2)}
            </div>
          </div>
        ) : (
          <div className={styles.stoneInformation}>
            <div className={styles.adjustDesign} />
            <div className={styles.stoneHolder}>
              {Array.from({ length: restBlackStone.length }, (_, i) => (
                <div className={styles.restStone} key={i}>
                  <div className={styles.restBlackStone} />
                  <div className={styles.restWhiteStone} />
                </div>
              ))}
            </div>
            <div className={styles.stoneAmount}>{getColorAmount(board, 2)}枚</div>
            <div className={styles.stone} style={{ background: '#f8f8ff' }} />
          </div>
        )}
      </div>
    </div>
  );
}
