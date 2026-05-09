import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ArrowRight, 
  RotateCcw, 
  Trophy, 
  Heart, 
  PawPrint, 
  Palette, 
  Type, 
  Apple, 
  User,
  Lightbulb,
  X,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Category = 'Animals' | 'Colors' | 'Numbers' | 'Fruits' | 'Body Parts';

interface Question {
  id: number;
  word: string;
  emoji: string;
  options: string[];
  answer: string;
  hint: string;
}

// --- Data ---
const GAME_DATA: Record<Category, Question[]> = {
  'Animals': [
    { id: 1, word: 'Lion', emoji: '🦁', options: ['Lion', 'Tiger', 'Cat'], answer: 'Lion', hint: 'The king of the jungle!' },
    { id: 2, word: 'Elephant', emoji: '🐘', options: ['Dog', 'Elephant', 'Hippo'], answer: 'Elephant', hint: 'Has a very long trunk!' },
    { id: 3, word: 'Monkey', emoji: '🐒', options: ['Monkey', 'Bird', 'Bear'], answer: 'Monkey', hint: 'Loves eating bananas!' },
    { id: 4, word: 'Rabbit', emoji: '🐰', options: ['Snake', 'Rabbit', 'Mouse'], answer: 'Rabbit', hint: 'Has long ears and hops!' },
    { id: 5, word: 'Cat', emoji: '🐱', options: ['Lion', 'Dog', 'Cat'], answer: 'Cat', hint: 'Says Meow!' },
  ],
  'Colors': [
    { id: 1, word: 'Red', emoji: '🔴', options: ['Red', 'Blue', 'Green'], answer: 'Red', hint: 'Color of an apple!' },
    { id: 2, word: 'Blue', emoji: '🔵', options: ['Yellow', 'Blue', 'Purple'], answer: 'Blue', hint: 'Color of the sky!' },
    { id: 3, word: 'Yellow', emoji: '🟡', options: ['Pink', 'Green', 'Yellow'], answer: 'Yellow', hint: 'Color of the sun!' },
    { id: 4, word: 'Green', emoji: '🟢', options: ['Green', 'Orange', 'Black'], answer: 'Green', hint: 'Color of grass!' },
    { id: 5, word: 'Purple', emoji: '🟣', options: ['White', 'Purple', 'Grey'], answer: 'Purple', hint: 'Color of grapes!' },
  ],
  'Numbers': [
    { id: 1, word: 'One', emoji: '1️⃣', options: ['Five', 'One', 'Three'], answer: 'One', hint: 'The very first number!' },
    { id: 2, word: 'Two', emoji: '2️⃣', options: ['Two', 'Four', 'Six'], answer: 'Two', hint: 'One plus one!' },
    { id: 3, word: 'Three', emoji: '3️⃣', options: ['Seven', 'Nine', 'Three'], answer: 'Three', hint: 'How many sides in a triangle?' },
    { id: 4, word: 'Four', emoji: '4️⃣', options: ['Four', 'Eight', 'Zero'], answer: 'Four', hint: 'Number of legs on a chair!' },
    { id: 5, word: 'Five', emoji: '5️⃣', options: ['One', 'Five', 'Ten'], answer: 'Five', hint: 'Fingers on one hand!' },
  ],
  'Fruits': [
    { id: 1, word: 'Apple', emoji: '🍎', options: ['Banana', 'Apple', 'Pear'], answer: 'Apple', hint: 'A red and crunchy fruit!' },
    { id: 2, word: 'Banana', emoji: '🍌', options: ['Cherry', 'Banana', 'Mango'], answer: 'Banana', hint: 'A long yellow fruit!' },
    { id: 3, word: 'Grapes', emoji: '🍇', options: ['Grapes', 'Melon', 'Lemon'], answer: 'Grapes', hint: 'Small round purple or green fruits!' },
    { id: 4, word: 'Watermelon', emoji: '🍉', options: ['Plum', 'Watermelon', 'Kiwi'], answer: 'Watermelon', hint: 'Big, green outside, red inside!' },
    { id: 5, word: 'Orange', emoji: '🍊', options: ['Orange', 'Berry', 'Fig'], answer: 'Orange', hint: 'A round citrus fruit!' },
  ],
  'Body Parts': [
    { id: 1, word: 'Eye', emoji: '👁️', options: ['Hand', 'Ear', 'Eye'], answer: 'Eye', hint: 'Used for seeing!' },
    { id: 2, word: 'Ear', emoji: '👂', options: ['Nose', 'Ear', 'Foot'], answer: 'Ear', hint: 'Used for listening!' },
    { id: 3, word: 'Nose', emoji: '👃', options: ['Mouth', 'Nose', 'Arm'], answer: 'Nose', hint: 'Used for smelling!' },
    { id: 4, word: 'Mouth', emoji: '👄', options: ['Eyes', 'Mouth', 'Teeth'], answer: 'Mouth', hint: 'Used for eating and talking!' },
    { id: 5, word: 'Hand', emoji: '✋', options: ['Hand', 'Finger', 'Leg'], answer: 'Hand', hint: 'Used for waving hello!' },
  ]
};

// --- Components ---

const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            top: -20, 
            left: `${Math.random() * 100}%`,
            scale: Math.random() * 0.5 + 0.5,
            rotate: 0,
            opacity: 1
          }}
          animate={{ 
            top: '110%', 
            left: `${(Math.random() * 20 - 10) + (parseFloat(`${Math.random() * 100}`))}%`,
            rotate: 360,
            opacity: 0
          }}
          transition={{ 
            duration: Math.random() * 2 + 1, 
            ease: "easeOut",
            repeat: 0
          }}
          className="absolute"
          style={{ 
            backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F43', '#A29BFE'][Math.floor(Math.random() * 5)],
            width: '15px',
            height: '15px',
            borderRadius: Math.random() > 0.5 ? '50%' : '2px'
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState<'home' | 'game' | 'result'>('home');
  const [category, setCategory] = useState<Category | null>(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQuestions = category ? GAME_DATA[category] : [];
  const currentQuestion = currentQuestions[index];

  const handleStart = (cat: Category) => {
    setCategory(cat);
    setIndex(0);
    setScore(0);
    setScreen('game');
    setFeedback(null);
    setShowHint(false);
    setSelectedOption(null);
  };

  const handleAnswer = (option: string) => {
    if (feedback) return;
    setSelectedOption(option);
    if (option === currentQuestion.answer) {
      setFeedback('correct');
      setScore(prev => prev + 1);
    } else {
      setFeedback('wrong');
    }
  };

  const handleNext = () => {
    if (index < currentQuestions.length - 1) {
      setIndex(prev => prev + 1);
      setFeedback(null);
      setShowHint(false);
      setSelectedOption(null);
    } else {
      setScreen('result');
    }
  };

  const handleRepeat = () => {
    setFeedback(null);
    setShowHint(false);
    setSelectedOption(null);
  };

  const restart = () => {
    setScreen('home');
    setCategory(null);
  };

  return (
    <div className="min-h-screen bg-yellow-50 font-sans text-gray-800 selection:bg-yellow-200">
      {/* Header */}
      <header className="bg-white border-b-4 border-yellow-200 p-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }} 
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl"
            >
              🎉
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-500 tracking-tight">
              Kids<span className="text-pink-500">English</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border-2 border-yellow-300">
            <Star size={24} className="text-yellow-500 fill-yellow-500" />
            <span className="text-xl font-bold text-yellow-700">{score}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {/* Home Screen */}
          {screen === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black text-gray-800">
                  Ready to Learn? 🚀
                </h2>
                <p className="text-xl text-gray-600 font-medium">
                  Choose a category to start your adventure!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { name: 'Animals', icon: <PawPrint size={40} />, color: 'bg-orange-400 border-orange-600' },
                  { name: 'Colors', icon: <Palette size={40} />, color: 'bg-pink-400 border-pink-600' },
                  { name: 'Numbers', icon: <Type size={40} />, color: 'bg-green-400 border-green-600' },
                  { name: 'Fruits', icon: <Apple size={40} />, color: 'bg-red-400 border-red-600' },
                  { name: 'Body Parts', icon: <User size={40} />, color: 'bg-blue-400 border-blue-600' },
                ].map((cat) => (
                  <motion.button
                    key={cat.name}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStart(cat.name as Category)}
                    className={`${cat.color} border-b-8 p-8 rounded-3xl text-white flex flex-col items-center gap-4 shadow-lg transition-all active:border-b-0 active:translate-y-2`}
                    id={`btn-category-${cat.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <div className="bg-white/20 p-4 rounded-2xl">
                      {cat.icon}
                    </div>
                    <span className="text-2xl font-black">{cat.name}</span>
                  </motion.button>
                ))}
              </div>

              <div className="pt-12">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-block p-6 bg-white rounded-3xl border-4 border-yellow-300 shadow-sm"
                >
                  <p className="text-2xl font-bold text-yellow-600">
                    "English is Fun! Let's play together! 🎈"
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Game Screen */}
          {screen === 'game' && currentQuestion && (
            <motion.div
              key="game"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8"
            >
              {/* Progress Bar */}
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((index + 1) / currentQuestions.length) * 100}%` }}
                  className="h-full bg-blue-500"
                />
              </div>

              <div className="bg-white rounded-[40px] border-4 border-blue-200 p-8 shadow-xl text-center relative overflow-hidden">
                <div className="mb-2 text-blue-500 font-black text-xl uppercase tracking-widest">
                  Question {index + 1} of {currentQuestions.length}
                </div>

                <motion.div
                  key={currentQuestion.id}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-[120px] md:text-[180px] leading-tight mb-4"
                >
                  {currentQuestion.emoji}
                </motion.div>

                <h3 className="text-3xl md:text-4xl font-black mb-8 text-gray-700">
                  What is this?
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {currentQuestion.options.map((option) => (
                    <motion.button
                      key={option}
                      disabled={!!feedback}
                      onClick={() => handleAnswer(option)}
                      whileHover={{ scale: feedback ? 1 : 1.05 }}
                      whileTap={{ scale: feedback ? 1 : 0.95 }}
                      className={`
                        p-6 rounded-2xl text-2xl font-black border-b-4 transition-all
                        ${feedback === 'correct' && option === currentQuestion.answer 
                          ? 'bg-green-500 border-green-700 text-white' 
                          : feedback === 'wrong' && option === selectedOption
                            ? 'bg-red-400 border-red-600 text-white'
                            : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }
                        ${feedback && option !== selectedOption && option !== currentQuestion.answer ? 'opacity-50' : ''}
                      `}
                      id={`option-${option.toLowerCase()}`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-6 py-4 rounded-2xl font-bold text-xl border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all"
                  id="btn-hint"
                >
                  {showHint ? <X size={24} /> : <Lightbulb size={24} />}
                  {showHint ? 'Close Hint' : 'Hint'}
                </button>

                <button
                  onClick={handleRepeat}
                  className="flex items-center gap-2 bg-blue-100 text-blue-600 px-6 py-4 rounded-2xl font-bold text-xl border-b-4 border-blue-300 active:border-b-0 active:translate-y-1 transition-all"
                  id="btn-repeat"
                >
                  <RotateCcw size={24} />
                  Repeat
                </button>

                {feedback && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-2xl font-bold text-xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all"
                    id="btn-next"
                  >
                    Next Question
                    <ArrowRight size={24} />
                  </motion.button>
                )}
              </div>

              {/* Hint Box */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-yellow-100 border-2 border-yellow-300 p-6 rounded-3xl text-center"
                  >
                    <p className="text-2xl font-bold text-yellow-700 italic">
                      "Psst! {currentQuestion.hint} 🤫"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Feedback Dialog */}
              <AnimatePresence>
                {feedback === 'correct' && (
                  <>
                    <Confetti />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20"
                    >
                      <div className="bg-white p-8 rounded-[40px] border-8 border-green-400 text-center shadow-2xl">
                        <div className="text-6xl mb-4">🌟 Great Job! 🌟</div>
                        <p className="text-2xl font-bold text-gray-600 mb-6">
                          You found the <span className="text-green-500 underline">{currentQuestion.answer}</span>!
                        </p>
                        <button
                          onClick={handleNext}
                          className="bg-green-500 text-white px-10 py-4 rounded-2xl font-black text-2xl border-b-4 border-green-700"
                        >
                          AWESOME!
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
                {feedback === 'wrong' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20"
                  >
                    <div className="bg-white p-8 rounded-[40px] border-8 border-orange-400 text-center shadow-2xl">
                      <div className="text-6xl mb-4">🌈 Almost! 🌈</div>
                      <p className="text-2xl font-bold text-gray-600 mb-6">
                        Don't give up! Try one more time?
                      </p>
                      <button
                        onClick={handleRepeat}
                        className="bg-orange-400 text-white px-10 py-4 rounded-2xl font-black text-2xl border-b-4 border-orange-600"
                      >
                        TRY AGAIN
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Result Screen */}
          {screen === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-white p-12 rounded-[50px] border-8 border-blue-400 shadow-2xl space-y-8"
            >
              <div className="space-y-2">
                <Trophy size={100} className="mx-auto text-yellow-500" />
                <h2 className="text-5xl font-black text-blue-600">Epic Victory!</h2>
              </div>
              
              <div className="p-8 bg-blue-50 rounded-3xl border-4 border-blue-100">
                <p className="text-2xl font-bold text-gray-500 mb-2 uppercase tracking-widest">Your Score</p>
                <div className="text-8xl font-black text-gray-800 flex items-center justify-center gap-4">
                  {score} <Star size={60} className="text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-2xl font-bold text-gray-600 mt-4">
                  Out of {currentQuestions.length} words!
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-3xl font-black text-pink-500">
                  {score === currentQuestions.length ? "PERFECT SCORE! 🏆" : "You are a SUPERSTAR! ⭐"}
                </p>
                <p className="text-xl text-gray-500 max-w-md mx-auto">
                  You did such a wonderful job learning {category} today! Let's keep exploring more words!
                </p>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={restart}
                  className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-10 py-5 rounded-3xl font-black text-2xl border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all shadow-lg"
                  id="btn-play-again"
                >
                  <RotateCcw size={32} />
                  Play Again
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto p-12 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-400 font-bold italic">
          <Heart size={20} className="text-pink-400 fill-pink-400" />
          Made for amazing kids to keep learning!
        </div>
      </footer>
    </div>
  );
}
