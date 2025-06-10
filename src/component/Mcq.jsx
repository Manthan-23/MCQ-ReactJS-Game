import React, { useState, useEffect } from 'react';
import { ChevronRight, RotateCcw, Trophy, Clock, CheckCircle, XCircle } from 'lucide-react';

const Mcq = () => {
  const quizData = [
    {
      id: 1,
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "Home Tool Markup Language", 
        "Hyperlink and Text Markup Language",
        "Hyper Text Machine Language"
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Which CSS property is used to change the text color?",
      options: [
        "font-color",
        "text-color",
        "color",
        "background-color"
      ],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "What is the correct syntax for creating a function in JavaScript?",
      options: [
        "function = myFunction() {}",
        "function myFunction() {}",
        "create myFunction() {}",
        "def myFunction() {}"
      ],
      correctAnswer: 1
    },
    {
      id: 4,
      question: "Which React hook is used for managing state?",
      options: [
        "useEffect",
        "useContext",
        "useState",
        "useReducer"
      ],
      correctAnswer: 2
    },
    {
      id: 5,
      question: "What does API stand for?",
      options: [
        "Application Programming Interface",
        "Advanced Programming Interface",
        "Application Process Interface",
        "Automated Programming Interface"
      ],
      correctAnswer: 0
    }
  ];

  // Game state
  const [gameState, setGameState] = useState('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showAnswer, setShowAnswer] = useState(false);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0 && !showAnswer) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState, showAnswer]);


  // Start game - this function will start the quiz game
  const startGame = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setScore(0);
    setTimeLeft(30);
    setShowAnswer(false);
  };

  // This handles the Answer selection
  const handleAnswerSelect = (answerIndex) => {
    if (showAnswer) return;
    setSelectedAnswer(answerIndex);
  };

  // This Handles time up
  const handleTimeUp = () => {
    setSelectedAnswer(null);
    setShowAnswer(true);
    const newAnswers = [...userAnswers, { questionId: quizData[currentQuestion].id, answer: null, correct: false }];
    setUserAnswers(newAnswers);
  };

  // Submit answer and moves to the next question
  const submitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === quizData[currentQuestion].correctAnswer;
    const newAnswers = [...userAnswers, { 
      questionId: quizData[currentQuestion].id, 
      answer: selectedAnswer, 
      correct: isCorrect 
    }];
    
    setUserAnswers(newAnswers);
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowAnswer(true);
  };

  // Move to the next question
  const nextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
      setShowAnswer(false);
    } else {
      setGameState('finished');
    }
  };

  // Resets the game
  const resetGame = () => {
    setGameState('start');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setScore(0);
    setTimeLeft(30);
    setShowAnswer(false);
  };

  // Following is the Start Screen
  if (gameState === 'start') {
    return (
      <div className="w-screen min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full text-center transform hover:scale-105 transition-transform duration-300">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Trophy className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz Master</h1>
          <p className="text-gray-600 mb-6">Test your programming knowledge with our interactive quiz!</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="font-semibold">{quizData.length}</span>
                <span className="ml-1">Questions</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>30s per question</span>
              </div>
            </div>
          </div>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Following is the Game Screen
  if (gameState === 'playing') {
    const question = quizData[currentQuestion];
    const progress = ((currentQuestion + 1) / quizData.length) * 100;

    return (
      <div className="w-screen min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 p-4">
        <div className="max-w-4xl mx-auto">

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium text-gray-600">
                Question {currentQuestion + 1} of {quizData.length}
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-600">Score: {score}</div>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                  timeLeft <= 10 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold">{timeLeft}s</span>
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
              {question.question}
            </h2>

            <div className="space-y-4 mb-8">
              {question.options.map((option, index) => {
                let buttonClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-102";
                
                if (showAnswer) {
                  if (index === question.correctAnswer) {
                    buttonClass += " bg-green-100 border-green-500 text-green-500";
                  } else if (index === selectedAnswer && index !== question.correctAnswer) {
                    buttonClass += " bg-red-100 border-red-500 text-red-800";
                  } else {
                    buttonClass += " bg-gray-100 border-gray-300 text-gray-600";
                  }
                } else if (selectedAnswer === index) {
                  buttonClass += " bg-blue-100 border-blue-500 text-blue-800 shadow-lg";
                } else {
                  buttonClass += " bg-white border-gray-300 text-gray-400 hover:border-blue-300 hover:bg-blue-50";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={buttonClass}
                    disabled={showAnswer}
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-medium">{option}</span>
                      {showAnswer && index === question.correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                      )}
                      {showAnswer && index === selectedAnswer && index !== question.correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-600 ml-auto" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              {!showAnswer ? (
                <button
                  onClick={submitAnswer}
                  disabled={selectedAnswer === null}
                  className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedAnswer !== null
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Submit Answer
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="flex items-center bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  {currentQuestion < quizData.length - 1 ? 'Next Question' : 'View Results'}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Following is the Results Screen
  if (gameState === 'finished') {
    const percentage = Math.round((score / quizData.length) * 100);
    let performanceMessage = '';
    let performanceColor = '';

    if (percentage >= 80) {
      performanceMessage = 'Excellent! You\'re a quiz master!';
      performanceColor = 'text-green-600';
    } else if (percentage >= 60) {
      performanceMessage = 'Good job! Keep practicing!';
      performanceColor = 'text-blue-600';
    } else {
      performanceMessage = 'Keep learning and try again!';
      performanceColor = 'text-orange-600';
    }

    return (
      <div className="w-screen min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Trophy className="text-white text-4xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
            <p className={`text-xl font-semibold ${performanceColor}`}>{performanceMessage}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-800 mb-2">
                {score}/{quizData.length}
              </div>
              <div className="text-3xl font-semibold text-purple-600 mb-2">
                {percentage}%
              </div>
              <div className="text-gray-600">Final Score</div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Results:</h3>
            {userAnswers.map((answer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Question {index + 1}</span>
                <div className="flex items-center">
                  {answer.correct ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`ml-2 font-semibold ${answer.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {answer.correct ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={resetGame}
              className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg mx-auto"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default Mcq;