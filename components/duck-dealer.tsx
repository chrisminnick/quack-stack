"use client"

import { motion } from "framer-motion"

type DuckDealerProps = {
  message: string
}

export function DuckDealer({ message }: DuckDealerProps) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Speech bubble */}
      <motion.div
        className="absolute -top-16 bg-white rounded-xl p-3 shadow-lg z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-black font-medium">{message}</div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
      </motion.div>

      {/* Duck dealer */}
      <motion.div
        className="w-32 h-32 bg-yellow-400 rounded-full flex flex-col items-center justify-center border-4 border-yellow-600"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          duration: 1.5,
        }}
      >
        {/* Duck face */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Eyes */}
          <div className="absolute top-8 left-8 w-4 h-4 bg-black rounded-full"></div>
          <div className="absolute top-8 right-8 w-4 h-4 bg-black rounded-full"></div>

          {/* Beak */}
          <div className="absolute bottom-8 w-16 h-10 bg-orange-500 rounded-lg"></div>
          <div className="absolute bottom-6 w-14 h-4 bg-orange-600 rounded-lg"></div>

          {/* Dealer hat */}
          <div className="absolute -top-8 w-24 h-6 bg-black rounded-sm"></div>
          <div className="absolute -top-16 w-16 h-10 bg-black rounded-sm"></div>
          <div className="absolute -top-14 w-16 h-2 bg-red-600"></div>
        </div>
      </motion.div>

      {/* Dealer bow tie */}
      <div className="absolute bottom-0 w-12 h-6 bg-red-600 rotate-45 rounded-sm"></div>
      <div className="absolute bottom-0 w-12 h-6 bg-red-600 -rotate-45 rounded-sm"></div>
      <div className="absolute bottom-0 w-4 h-4 bg-red-800 rounded-full z-10"></div>
    </div>
  )
}

