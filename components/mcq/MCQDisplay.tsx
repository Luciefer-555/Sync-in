"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, RotateCw } from "lucide-react"

interface MCQ {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
}

interface MCQDisplayProps {
  questions: MCQ[]
  onComplete?: (score: number, total: number) => void
}

export function MCQDisplay({ questions, onComplete }: MCQDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [answered, setAnswered] = useState<Record<number, number | null>>({})

  const currentQuestion = questions[currentIndex]
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100)
  const isLastQuestion = currentIndex === questions.length - 1

  const handleOptionSelect = (optionIndex: number) => {
    if (answered[currentIndex] !== undefined) return // Prevent changing answer after submission
    
    setSelectedOption(optionIndex)
    const isCorrect = optionIndex === currentQuestion.correctAnswer
    
    setAnswered(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }))

    if (isCorrect) {
      setScore(prev => prev + 1)
    }
    
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (isLastQuestion) {
      setQuizCompleted(true)
      if (onComplete) {
        onComplete(score, questions.length)
      }
    } else {
      setCurrentIndex(prev => prev + 1)
      setSelectedOption(null)
      setShowExplanation(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setSelectedOption(answered[currentIndex - 1])
      setShowExplanation(answered[currentIndex - 1] !== undefined)
    }
  }

  const resetQuiz = () => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setShowExplanation(false)
    setScore(0)
    setQuizCompleted(false)
    setAnswered({})
  }

  if (quizCompleted) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Quiz Completed! 🎉</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="text-4xl font-bold">
            {score} / {questions.length}
          </div>
          <div className="text-xl">
            {Math.round((score / questions.length) * 100)}% Correct
          </div>
          <div className="text-muted-foreground">
            {score === questions.length 
              ? "Perfect! You're a genius! 🤩" 
              : score > questions.length / 2 
                ? "Great job! You're doing well! 😊" 
                : "Keep practicing! You'll get better! 💪"}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={resetQuiz} className="gap-2">
            <RotateCw className="w-4 h-4" />
            Restart Quiz
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="text-center p-8">
        <p>No questions available. Please try another category or difficulty.</p>
      </div>
    )
  }

  const isAnswered = answered[currentIndex] !== undefined
  const isCorrect = selectedOption === currentQuestion.correctAnswer

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline" className="capitalize">
            {currentQuestion.difficulty}
          </Badge>
          <div className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index
              const isActuallyCorrect = index === currentQuestion.correctAnswer
              let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
              
              if (isAnswered) {
                if (isSelected && isCorrect) variant = "default"
                else if (isSelected) variant = "destructive"
                else if (isActuallyCorrect) variant = "default"
              } else if (isSelected) {
                variant = "secondary"
              }

              return (
                <Button
                  key={index}
                  variant={variant}
                  className={`w-full justify-start text-left h-auto py-3 px-4 whitespace-normal ${
                    isAnswered ? 'cursor-default' : 'hover:bg-secondary/50'
                  }`}
                  onClick={() => handleOptionSelect(index)}
                  disabled={isAnswered}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                  <span className="text-left">{option}</span>
                  {isAnswered && (
                    <span className="ml-auto">
                      {isSelected && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                      {!isSelected && isActuallyCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    </span>
                  )}
                </Button>
              )
            })}
          </div>
        </div>

        {showExplanation && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2">Explanation:</h3>
            <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        <div className="text-sm text-muted-foreground">
          {score} correct so far
        </div>
        <Button 
          onClick={handleNext}
          disabled={!isAnswered}
        >
          {isLastQuestion ? 'Finish' : 'Next'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  )
}
