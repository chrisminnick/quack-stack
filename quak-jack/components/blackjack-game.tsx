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
  const [wins, setWins] = useState(0)
  const [losses, setLosses] = useState(0)
  const [pushes, setPushes] = useState(0)

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
    // Fisher-Yates shuffle algorithm
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
    }
    return newDeck
  }

  const drawCard = () => {
    if (deck.length === 0) {
      const newDeck = shuffleDeck(createDeck())
      setDeck(newDeck)
      return newDeck.pop()
    }
    const newDeck = [...deck]

    // Rigging for dealer during dealer's turn
    if (gameState === "dealerTurn") {
      // Peek at the next card
      const nextCard = newDeck[newDeck.length - 1]
      const currentDealerScore = calculateScore(dealerHand)

      // If dealer needs a good card (is under 17 but close)
      if (currentDealerScore < 17 && currentDealerScore > 11) {
        // Look through next few cards for a better one
        for (let i = newDeck.length - 1; i >= Math.max(0, newDeck.length - 5); i--) {
          const potentialCard = newDeck[i]
          if (
            currentDealerScore + potentialCard.numericValue <= 21 &&
            currentDealerScore + potentialCard.numericValue >= 17
          ) {
            // Swap this card to the top
            ;[newDeck[newDeck.length - 1], newDeck[i]] = [newDeck[i], newDeck[newDeck.length - 1]]
            setMessage("*adjusts bow tie suspiciously*")
            setTimeout(() => setMessage(""), 1500)
            break
          }
        }
      }
    }

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
    const currentDeck = deck.length < 10 ? shuffleDeck(createDeck()) : [...deck]
    setDeck(currentDeck)

    // Deal cards one at a time with potential rigging
    const cards = []
    for (let i = 0; i < 4; i++) {
      if (i === 1 || i === 3) {
        // Dealer's cards
        // Look for a 10 or face card for dealer
        const goodCardIndex = currentDeck.findIndex((card) => card.numericValue === 10)
        if (goodCardIndex !== -1 && Math.random() < 0.3) {
          // 30% chance of rigging
          const goodCard = currentDeck.splice(goodCardIndex, 1)[0]
          cards.push(goodCard)
          setMessage("*adjusts feathers innocently*")
          continue
        }
      }
      const card = currentDeck.pop()
      if (card) cards.push(card)
    }

    setDeck(currentDeck)

    if (cards.length === 4) {
      setPlayerHand([cards[0], cards[2]]) // First and third cards to player
      setDealerHand([cards[1], cards[3]]) // Second and fourth cards to dealer
      setGameState("playing")

      // Clear dealing messages after a short delay
      setTimeout(() => setMessage(""), 1500)
    }
  }

  const handleHit = () => {
    const card = drawCard()
    if (card) {
      setPlayerHand([...playerHand, card])
      // Add taunts based on current score
      const newScore = calculateScore([...playerHand, card])
      if (newScore > 16) {
        setMessage("Living dangerously, eh?")
        setTimeout(() => setMessage(""), 1500)
      }
    }
  }

  const handleStand = () => {
    setGameState("dealerTurn")
  }

  const determineWinner = (playerFinalScore: number, dealerFinalScore: number) => {
    setGameState("gameOver")

    if (playerFinalScore > 21) {
      setMessage("Bust! *snickers* Should've quit while you were ahead!")
      setLosses((prev) => prev + 1)
      return
    }

    if (dealerFinalScore > 21) {
      setMessage("*grumbles* Even a blind duck finds corn sometimes...")
      setChips(chips + currentBet * 2)
      setWins((prev) => prev + 1)
      triggerWinAnimation()
      return
    }

    if (playerFinalScore === dealerFinalScore) {
      setMessage("Push! *straightens bow tie* Lucky you...")
      setChips(chips + currentBet)
      setPushes((prev) => prev + 1)
      return
    }

    if (playerFinalScore > dealerFinalScore) {
      setMessage("*mutters under breath* Don't get used to it...")
      setChips(chips + currentBet * 2)
      setWins((prev) => prev + 1)
      triggerWinAnimation()
    } else {
      setMessage("Dealer wins! *winks at the deck* Skills!")
      setLosses((prev) => prev + 1)
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
    // Only reset scores if player is broke
    if (chips === 0) {
      setWins(0)
      setLosses(0)
      setPushes(0)
      setChips(100)
    }
    initializeGame()
  }

  return (
    <Card className="w-full max-w-4xl p-6 bg-green-700 border-4 border-yellow-800 shadow-2xl">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-yellow-300 mb-4">QuackJack</h1>
        <div className="w-full flex justify-around mb-6 bg-black/30 p-4 rounded-lg">
          <div className="text-center">
            <span className="text-green-400 font-bold text-xl">{wins}</span>
            <p className="text-yellow-200">Wins</p>
          </div>
          <div className="text-center">
            <span className="text-red-400 font-bold text-xl">{losses}</span>
            <p className="text-yellow-200">Losses</p>
          </div>
          <div className="text-center">
            <span className="text-blue-400 font-bold text-xl">{pushes}</span>
            <p className="text-yellow-200">Pushes</p>
          </div>
        </div>

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
                  ? "Ready to lose- I mean, play?"
                  : gameState === "gameOver" && message.includes("win") && !message.includes("Dealer")
                    ? "Pure luck! *shuffles cards with a smirk*"
                    : gameState === "gameOver" && message.includes("Dealer")
                      ? "*adjusts dealer visor* All skill, no luck here!"
                      : gameState === "playing" && playerScore > 15
                        ? "Feeling lucky, duckling?"
                        : gameState === "playing" && playerHand.length > 2
                          ? "*whistles innocently*"
                          : "The house always wins- er, deals first!"
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

