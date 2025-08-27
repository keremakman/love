import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Puzzle, Sparkles } from 'lucide-react';

interface JigsawPuzzleProps {
  imageUrl: string;
  completionMessage: string;
}

interface PuzzlePiece {
  id: number;
  correctPosition: number;
  currentPosition: number;
  x: number;
  y: number;
}

export function JigsawPuzzle({ imageUrl, completionMessage }: JigsawPuzzleProps) {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const GRID_SIZE = 3; // 3x3 puzzle

  useEffect(() => {
    initializePuzzle();
  }, [imageUrl]);

  const initializePuzzle = () => {
    const initialPieces: PuzzlePiece[] = [];
    
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const row = Math.floor(i / GRID_SIZE);
      const col = i % GRID_SIZE;
      
      initialPieces.push({
        id: i,
        correctPosition: i,
        currentPosition: i,
        x: col * 100,
        y: row * 100,
      });
    }
    
    // Shuffle pieces
    const shuffled = [...initialPieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i].currentPosition;
      shuffled[i].currentPosition = shuffled[j].currentPosition;
      shuffled[j].currentPosition = temp;
    }
    
    setPieces(shuffled);
  };

  const handlePieceClick = (pieceId: number) => {
    if (isCompleted) return;
    
    setPieces(prevPieces => {
      const newPieces = [...prevPieces];
      const clickedIndex = newPieces.findIndex(p => p.id === pieceId);
      const emptyIndex = newPieces.findIndex(p => p.currentPosition === GRID_SIZE * GRID_SIZE - 1);
      
      // Check if pieces are adjacent
      const clickedPos = newPieces[clickedIndex].currentPosition;
      const emptyPos = newPieces[emptyIndex].currentPosition;
      
      const clickedRow = Math.floor(clickedPos / GRID_SIZE);
      const clickedCol = clickedPos % GRID_SIZE;
      const emptyRow = Math.floor(emptyPos / GRID_SIZE);
      const emptyCol = emptyPos % GRID_SIZE;
      
      const isAdjacent = 
        (Math.abs(clickedRow - emptyRow) === 1 && clickedCol === emptyCol) ||
        (Math.abs(clickedCol - emptyCol) === 1 && clickedRow === emptyRow);
      
      if (isAdjacent) {
        // Swap positions
        const temp = newPieces[clickedIndex].currentPosition;
        newPieces[clickedIndex].currentPosition = newPieces[emptyIndex].currentPosition;
        newPieces[emptyIndex].currentPosition = temp;
        
        // Check if puzzle is completed
        const completed = newPieces.every(piece => piece.id === piece.currentPosition);
        if (completed) {
          setIsCompleted(true);
        }
      }
      
      return newPieces;
    });
  };

  const resetPuzzle = () => {
    setIsCompleted(false);
    initializePuzzle();
  };

  if (!imageUrl) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-pink-200"
      >
        <div className="text-center mb-6">
          <Puzzle className="w-8 h-8 text-pink-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Memory Puzzle</h3>
          <p className="text-gray-600">Put the pieces together to reveal a special message</p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="relative bg-gray-100 rounded-xl overflow-hidden" style={{ aspectRatio: '1' }}>
            <div className="grid grid-cols-3 gap-1 p-2 h-full">
              {pieces.map((piece) => {
                const row = Math.floor(piece.currentPosition / GRID_SIZE);
                const col = piece.currentPosition % GRID_SIZE;
                const isLastPiece = piece.id === GRID_SIZE * GRID_SIZE - 1;
                
                return (
                  <motion.div
                    key={piece.id}
                    whileHover={!isCompleted && !isLastPiece ? { scale: 1.05 } : {}}
                    whileTap={!isCompleted && !isLastPiece ? { scale: 0.95 } : {}}
                    onClick={() => handlePieceClick(piece.id)}
                    className={`
                      relative rounded-lg overflow-hidden cursor-pointer
                      ${isLastPiece && !isCompleted ? 'bg-gray-200' : ''}
                      ${isCompleted ? 'cursor-default' : 'hover:shadow-lg'}
                    `}
                    style={{
                      backgroundImage: !isLastPiece || isCompleted ? `url(${imageUrl})` : 'none',
                      backgroundSize: '300%',
                      backgroundPosition: `${-piece.id % GRID_SIZE * 100}% ${-Math.floor(piece.id / GRID_SIZE) * 100}%`,
                    }}
                  >
                    {isLastPiece && !isCompleted && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {!isCompleted && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetPuzzle}
              className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Shuffle Again
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Completion Modal */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-pink-200"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="mb-6"
              >
                <Sparkles className="w-16 h-16 text-pink-500 mx-auto" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Congratulations!</h3>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-700 text-lg mb-6 font-serif"
              >
                {completionMessage}
              </motion.p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetPuzzle}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                Play Again
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}