"use client"
import { useState, useEffect } from "react"

type SquareType = (string | null)[]

const Square = ({ value, onSquareClick }: { value: string | null, onSquareClick: () => void }) => {
  const buttonClasses = "bg-white border border-gray-300 items-center justify-center text-4xl font-bold text-center h-16 w-16"
  return <button className={buttonClasses} onClick={onSquareClick}>{value}</button>
}


const calculateWinner = (squares: SquareType): string | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

const Board = ({ xIsNext, squares, onPlay }:
  { xIsNext: boolean; squares: SquareType; onPlay: (nextSquares: SquareType) => void }
) => {
  const [status, setStatus] = useState("")

  const handleClick = (i: number) => {
    if (squares[i] || calculateWinner(squares)) return
    const nextSquares = squares.slice()
    nextSquares[i] = xIsNext ? "X" : "O"
    onPlay(nextSquares)
  }

  useEffect(() => {
    const winner = calculateWinner(squares)
    if (winner) {
      setStatus("Winner: " + winner)
    } else {
      setStatus("Next player: " + (xIsNext ? "X" : "O"))
    }
  }, [xIsNext, squares])

  return (
    <div className="overflow-x-auto">
      {status && <div className={"text-center text-xl"}>{status}</div>}
      <div className="grid grid-cols-3 justify-items-center">
        {squares.map((value, i) => (
          <Square key={i} value={value} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
    </div>
  )
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]


  function handlePlay(nextSquares: SquareType) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove)
  }

  const moves = history.map((squares, move) => {
    let description
    if (move > 0) {
      description = "Go to move #" + move
    } else {
      description = "Go to game start"
    }
    return (
      <li key={move} className="mb-1">
        <button className="bg-blue-400 hover:bg-blue-600 text-white font-bold p-1 rounded" onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    )
  })

  return (
    <div className={"flex flex-col justify-start items-center h-screen min-w-[200px]"}>
      <h1 className="text-3xl text-center mb-3">Tic Tac Toe</h1>
      <div className="flex flex-wrap justify-center">
        <div className="m-4">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="m-4">
          <ol className="border border-gray-400 p-2">{moves}</ol>
        </div>
      </div >
    </div>
  )
}

