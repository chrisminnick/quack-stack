"use client"

import { motion } from "framer-motion"

type CardType = {
  suit: "hearts" | "diamonds" | "clubs" | "spades"
  value: string
  numericValue: number
}

type PlayingCardProps = {
  card: CardType
  hidden?: boolean
}

export function PlayingCard({ card, hidden = false }: PlayingCardProps) {
  const getSuitSymbol = (suit: CardType["suit"]) => {
    switch (suit) {
      case "hearts":
        return "♥"
      case "diamonds":
        return "♦"
      case "clubs":
        return "♣"
      case "spades":
        return "♠"
      default:
        return ""
    }
  }

  const getSuitColor = (suit: CardType["suit"]) => {
    return suit === "hearts" || suit === "diamonds" ? "text-red-600" : "text-black"
  }

  if (hidden) {
    return (
      <div className="w-24 h-36 rounded-lg bg-blue-800 border-2 border-white shadow-md flex items-center justify-center m-1">
        <div className="w-16 h-24 rounded-md bg-blue-700 flex items-center justify-center">
          <span className="text-yellow-300 text-2xl font-bold">🦆</span>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="w-24 h-36 rounded-lg bg-white border-2 border-gray-300 shadow-md flex flex-col p-2 m-1"
      initial={{ rotateY: 180 }}
      animate={{ rotateY: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-start">
        <div className={`text-lg font-bold ${getSuitColor(card.suit)}`}>{card.value}</div>
        <div className={`text-lg ${getSuitColor(card.suit)}`}>{getSuitSymbol(card.suit)}</div>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className={`text-3xl ${getSuitColor(card.suit)}`}>{getSuitSymbol(card.suit)}</div>
      </div>

      <div className="flex justify-between items-end rotate-180">
        <div className={`text-lg font-bold ${getSuitColor(card.suit)}`}>{card.value}</div>
        <div className={`text-lg ${getSuitColor(card.suit)}`}>{getSuitSymbol(card.suit)}</div>
      </div>
    </motion.div>
  )
}

