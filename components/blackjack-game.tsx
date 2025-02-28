"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlayingCard } from "@/components/playing-card"
import { DuckDealer } from "@/components/duck-dealer"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

type CardType = {
  suit: "hearts" | "diamonds" | "clubs" | "spades"
  value: string
  numericValue: number
}

export default function BlackjackGame() {
  const [deck, setDeck] = useState<CardType[]>([])
  const [playerHand, setPlayerHand] = useState<CardType[]>([])
  const [dealerHand, setDealerHand] = useState<CardType[]>([])
  const [playerScore, setPlayerScore] = useState(0)
  const [dealerScore, setDealerScore] = useState(0)
  const [gameState, setGameState] = useState<"betting" | "playing" | "dealerTurn" | "gameOver">("betting")
  const [message, setMessage] = useState("")
  const [dealerCardHidden, setDealerCardHidden] = useState(true)
  const [chips, setChips] = useState(100)
  const [currentBet, setCurrentBet] = useState(0)

  // Initialize deck
  useEffect(() => {
    initializeGame()
  }, [])

  // Calculate scores whenever hands change
  useEffect(() => {
    setPlayerScore(calculateScore(playerHand))
    setDealerScore(calculateScore(dealerHand))
  }, [playerHand, dealerHand])

  // Check for blackjack or bust after player score changes
  useEffect(() => {
    if (gameState === "playing") {
      if (playerScore === 21) {
        handleStand()
      } else if (playerScore > 21) {
        setGameState("gameOver")
        setMessage("Bust! You lose!")
        setDealerCardHidden(false)
      }
    }
  }, [playerScore, gameState])

  // Dealer's turn logic
  useEffect(() => {
    if (gameState === "dealerTurn") {
      const dealerPlay = async () => {
        setDealerCardHidden(false)

        // Add a small delay for animation
        await new Promise((resolve) => setTimeout(resolve, 1000))

        let currentDealerHand = [...dealerHand]
        let currentScore = calculateScore(currentDealerHand)

        while (currentScore < 17) {
          const newCard = drawCard()
          if (!newCard) break

          currentDealerHand = [...currentDealerHand, newCard]
          setDealerHand(currentDealerHand)
          currentScore = calculateScore(currentDealerHand)

          // Add delay between dealer draws
          await new Promise((resolve) => setTimeout(resolve, 800))
        }

        determineWinner(calculateScore(playerHand), currentScore)
      }

      dealerPlay()
    }
  }, [gameState, dealerHand, playerHand]) // Added playerHand dependency

  const initializeGame = () => {
    const newDeck = createDeck()
    setDeck(shuffleDeck(newDeck))
    setPlayerHand([])
    setDealerHand([])
    setGameState("betting")
    setMessage("")
    setDealerCardHidden(true)
  }

  const createDeck = () => {
    const suits = ["hearts", "diamonds", "clubs", "spades"] as const
    const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
    const deck: CardType[] = []

    for (const suit of suits) {
      for (const value of values) {
        let numericValue = 0
        if (value === "A") {
          numericValue = 11
        } else if (["J", "Q", "K"].includes(value)) {
          numericValue = 10
        } else {
          numericValue = Number.parseInt(value)
        }

        deck.push({ suit, value, numericValue })
      }
    }

    return deck
  }

  const shuffleDeck = (deck: CardType[]) => {
    const newDeck = [...deck]
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
    }
    return newDeck
  }

  const drawCard = () => {
    if (deck.length === 0) return null
    const newDeck = [...deck]
    const card = newDeck.pop()
    setDeck(newDeck)
    return card
  }

  const calculateScore = (hand: CardType[]) => {
    let score = 0
    let aces = 0

    for (const card of hand) {
      score += card.numericValue
      if (card.value === "A") {
        aces += 1
      }
    }

    // Adjust for aces
    while (score > 21 && aces > 0) {
      score -= 10 // Change ace from 11 to 1
      aces -= 1
    }

    return score
  }

  const handleBet = (amount: number) => {
    if (chips >= amount) {
      setCurrentBet(amount)
      setChips(chips - amount)
      startNewRound()
    }
  }

  const startNewRound = () => {
    const newDeck = deck.length < 10 ? shuffleDeck(createDeck()) : deck
    setDeck(newDeck)

    // Deal initial cards
    const pCard1 = drawCard()
    const dCard1 = drawCard()
    const pCard2 = drawCard()
    const dCard2 = drawCard()

    if (pCard1 && pCard2 && dCard1 && dCard2) {
      setPlayerHand([pCard1, pCard2])
      setDealerHand([dCard1, dCard2])
      setGameState("playing")
    }
  }

  const handleHit = () => {
    const card = drawCard()
    if (card) {
      setPlayerHand([...playerHand, card])
    }
  }

  const handleStand = () => {
    setGameState("dealerTurn")
  }

  const determineWinner = (playerFinalScore: number, dealerFinalScore: number) => {
    setGameState("gameOver")

    if (playerFinalScore > 21) {
      setMessage("Bust! You lose!")
      return
    }

    if (dealerFinalScore > 21) {
      setMessage("Dealer busts! You win!")
      setChips(chips + currentBet * 2)
      triggerWinAnimation()
      return
    }

    if (playerFinalScore === dealerFinalScore) {
      setMessage("Push! It's a tie!")
      setChips(chips + currentBet)
      return
    }

    if (playerFinalScore > dealerFinalScore) {
      setMessage("You win!")
      setChips(chips + currentBet * 2)
      triggerWinAnimation()
    } else {
      setMessage("Dealer wins!")
    }
  }

  const triggerWinAnimation = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  const handleNewGame = () => {
    setCurrentBet(0)
    initializeGame()
  }

  return (
    <Card className="w-full max-w-4xl p-6 bg-green-700 border-4 border-yellow-800 shadow-2xl">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-yellow-300 mb-4">Duck Blackjack</h1>

        {/* Dealer section */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-yellow-200">Dealer</h2>
            {gameState !== "betting" && (
              <div className="bg-black/50 px-3 py-1 rounded-full text-white">
                Score: {dealerCardHidden ? "?" : dealerScore}
              </div>
            )}
          </div>

          <div className="relative h-40 flex justify-center">
            <DuckDealer
              message={
                gameState === "betting"
                  ? "Place your bet!"
                  : gameState === "gameOver" && message.includes("win")
                    ? "Quack! You got lucky!"
                    : gameState === "gameOver"
                      ? "Quack! Better luck next time!"
                      : "Quack! Hit or stand?"
              }
            />

            <div className="absolute bottom-0 flex justify-center w-full">
              {dealerHand.map((card, index) => (
                <motion.div
                  key={`dealer-${index}`}
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                  style={{ right: `${index * 30}px` }}
                >
                  <PlayingCard card={card} hidden={index === 1 && dealerCardHidden} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Game message */}
        {message && (
          <Alert className="mb-4 bg-yellow-100 border-yellow-400">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Game Result</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Player section */}
        <div className="w-full mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-yellow-200">Your Hand</h2>
            {gameState !== "betting" && (
              <div className="bg-black/50 px-3 py-1 rounded-full text-white">Score: {playerScore}</div>
            )}
          </div>

          <div className="flex justify-center mb-4">
            {playerHand.map((card, index) => (
              <motion.div
                key={`player-${index}`}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="relative"
                style={{ right: `${index * 30}px` }}
              >
                <PlayingCard card={card} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Game controls */}
        <div className="flex flex-wrap justify-center gap-3">
          {gameState === "betting" && (
            <>
              <div className="w-full text-center mb-2">
                <div className="text-xl font-bold text-yellow-200">Chips: ${chips}</div>
              </div>
              <Button
                onClick={() => handleBet(5)}
                disabled={chips < 5}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Bet $5
              </Button>
              <Button
                onClick={() => handleBet(10)}
                disabled={chips < 10}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Bet $10
              </Button>
              <Button
                onClick={() => handleBet(25)}
                disabled={chips < 25}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Bet $25
              </Button>
            </>
          )}

          {gameState === "playing" && (
            <>
              <div className="w-full text-center mb-2">
                <div className="text-xl font-bold text-yellow-200">Current Bet: ${currentBet}</div>
              </div>
              <Button onClick={handleHit} className="bg-red-500 hover:bg-red-600">
                Hit
              </Button>
              <Button onClick={handleStand} className="bg-blue-500 hover:bg-blue-600">
                Stand
              </Button>
            </>
          )}

          {gameState === "gameOver" && (
            <>
              <div className="w-full text-center mb-2">
                <div className="text-xl font-bold text-yellow-200">Chips: ${chips}</div>
              </div>
              <Button onClick={handleNewGame} className="bg-green-500 hover:bg-green-600">
                New Game
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}

