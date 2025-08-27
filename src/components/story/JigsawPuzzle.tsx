import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Puzzle, Sparkles, RotateCcw } from 'lucide-react';

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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
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
        x: col * 120,
        y: row * 120,
      });
    }
    
    // Shuffle pieces properly
    const shuffled = [...initialPieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Swap current positions
      const tempPos = shuffled[i].currentPosition;
      shuffled[i].currentPosition = shuffled[j].currentPosition;
      shuffled[j].currentPosition = tempPos;
      
      // Update x, y coordinates based on new positions
      const iRow = Math.floor(shuffled[i].currentPosition / GRID_SIZE);
      const iCol = shuffled[i].currentPosition % GRID_SIZE;
      shuffled[i].x = iCol * 120;
      shuffled[i].y = iRow * 120;
      
      const jRow = Math.floor(shuffled[j].currentPosition / GRID_SIZE);
      const jCol = shuffled[j].currentPosition % GRID_SIZE;
      shuffled[j].x = jCol * 120;
      shuffled[j].y = jRow * 120;
    }
    
    setPieces(shuffled);
    setIsCompleted(false);
  };

  const handleMouseDown = (e: React.MouseEvent, pieceId: number) => {
    if (isCompleted) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const piece = pieces.find(p => p.id === pieceId);
    if (!piece) return;
    
    setDraggedPiece(pieceId);
    setDragOffset({
      x: e.clientX - rect.left - piece.x,
      y: e.clientY - rect.top - piece.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedPiece === null || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;
    
    setPieces(prevPieces => 
      prevPieces.map(piece => 
        piece.id === draggedPiece 
          ? { ...piece, x: Math.max(0, Math.min(240, newX)), y: Math.max(0, Math.min(240, newY)) }
          : piece
      )
    );
  };

  const handleMouseUp = () => {
    if (draggedPiece === null) return;
    
    setPieces(prevPieces => {
      const newPieces = [...prevPieces];
      const draggedIndex = newPieces.findIndex(p => p.id === draggedPiece);
      const draggedPieceData = newPieces[draggedIndex];
      
      // Snap to grid
      const snapX = Math.round(draggedPieceData.x / 120) * 120;
      const snapY = Math.round(draggedPieceData.y / 120) * 120;
      const newPosition = Math.floor(snapY / 120) * GRID_SIZE + Math.floor(snapX / 120);
      
      // Check if position is valid and not occupied by another piece
      if (newPosition >= 0 && newPosition < GRID_SIZE * GRID_SIZE) {
        const occupyingPiece = newPieces.find(p => p.currentPosition === newPosition && p.id !== draggedPiece);
        
        if (occupyingPiece) {
          // Swap positions
          const tempPos = draggedPieceData.currentPosition;
          const tempX = draggedPieceData.x;
          const tempY = draggedPieceData.y;
          
          draggedPieceData.currentPosition = occupyingPiece.currentPosition;
          draggedPieceData.x = occupyingPiece.x;
          draggedPieceData.y = occupyingPiece.y;
          
          occupyingPiece.currentPosition = tempPos;
          occupyingPiece.x = tempX;
          occupyingPiece.y = tempY;
        } else {
          // Move to empty position
          draggedPieceData.currentPosition = newPosition;
          draggedPieceData.x = snapX;
          draggedPieceData.y = snapY;
        }
      } else {
        // Snap back to current position
        const currentRow = Math.floor(draggedPieceData.currentPosition / GRID_SIZE);
        const currentCol = draggedPieceData.currentPosition % GRID_SIZE;
        draggedPieceData.x = currentCol * 120;
        draggedPieceData.y = currentRow * 120;
      }
      
      // Check if puzzle is completed
      const completed = newPieces.every(piece => piece.id === piece.currentPosition);
      if (completed) {
        setIsCompleted(true);
      }
      
      return newPieces;
    });
    
    setDraggedPiece(null);
  };

  if (!imageUrl) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-rose-200"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Puzzle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Anı Yapbozu
          </h3>
          <p className="text-gray-600 text-lg">Parçaları birleştirerek özel mesajı ortaya çıkarın</p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div 
            ref={containerRef}
            className="relative bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl overflow-hidden border-4 border-rose-200 shadow-inner"
            style={{ width: '360px', height: '360px' }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {pieces.map((piece) => (
              <motion.div
                key={piece.id}
                style={{
                  position: 'absolute',
                  left: piece.x,
                  top: piece.y,
                  width: '120px',
                  height: '120px',
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: '360px 360px',
                  backgroundPosition: `${-piece.id % GRID_SIZE * 120}px ${-Math.floor(piece.id / GRID_SIZE) * 120}px`,
                  cursor: draggedPiece === piece.id ? 'grabbing' : 'grab',
                  zIndex: draggedPiece === piece.id ? 10 : 1,
                }}
                className="rounded-lg border-2 border-white shadow-lg hover:shadow-xl transition-all duration-200"
                whileHover={!isCompleted ? { scale: 1.05 } : {}}
                whileTap={!isCompleted ? { scale: 0.95 } : {}}
                onMouseDown={(e) => handleMouseDown(e, piece.id)}
                animate={draggedPiece === piece.id ? {} : {
                  x: 0,
                  y: 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            ))}
          </div>
          
          <div className="flex gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={initializePuzzle}
              className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-6 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-medium flex items-center justify-center shadow-lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Yeniden Karıştır
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Completion Modal */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl border-2 border-rose-200"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="mb-8"
              >
                <Sparkles className="w-20 h-20 text-rose-500 mx-auto" />
              </motion.div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Tebrikler!
              </h3>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-700 text-xl mb-8 font-serif leading-relaxed"
              >
                {completionMessage}
              </motion.p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={initializePuzzle}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 px-8 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-lg"
              >
                Tekrar Oyna
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}