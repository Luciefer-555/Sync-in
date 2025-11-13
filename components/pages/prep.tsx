"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { usePrepProgress } from "@/components/providers/prep-progress-provider"
import { MCQDisplay } from "@/components/mcq/MCQDisplay"

// Constants
const SUBJECT_OPTIONS = [
  "Data Structures",
  "Algorithms",
  "Operating Systems",
  "Database Management",
  "Computer Networks",
  "Software Engineering",
  "Aptitude",
  "HR & Behavioural",
  "Domain Specific",
]

const QUESTION_TYPES = ["HR", "DSA", "ADA", "Aptitude", "Domain Specific", "System Design"]
const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"]
const MCQ_CATEGORIES = ["DSA", "HTML", "Python", "JavaScript", "React.js", "Java", "SQL", "MongoDB", "CSS", "System Design", "Computer Science"]

// Interfaces
interface PreparationProfile {
  interests: string
  favoriteSubjects: string[]
  goal: string
  companies: string
  focusArea: string
  cgpa: string
  notes: string
}

interface QuestionDoc {
  _id?: string
  id?: string
  title?: string
  question?: string
  prompt?: string
  description?: string
  body?: string
  difficulty?: string
  companyFocus?: string[] | string
  domain?: string | string[]
  subject?: string
  subjects?: string[]
  questionType?: string
  type?: string
  category?: string
  topics?: string[]
  explanation?: string
  answer?: string
}

// Helper functions
function normalizeCompany(companyFocus?: QuestionDoc["companyFocus"]): string[] {
  if (!companyFocus) return []
  if (Array.isArray(companyFocus)) return companyFocus.filter(Boolean)
  return companyFocus.split(",").map((value) => value.trim()).filter(Boolean)
}

function getQuestionTitle(question: QuestionDoc) {
  return question.title || question.question || question.prompt || question.description || "Untitled Question"
}

function getQuestionBody(question: QuestionDoc) {
  return question.description || question.body || question.prompt || ""
}

function getQuestionType(question: QuestionDoc) {
  return question.questionType || question.type || question.category || "General"
}

export default function Prep() {
  // State
  const [profile, setProfile] = useState<PreparationProfile>({
    interests: "",
    favoriteSubjects: ["Data Structures", "Algorithms"],
    goal: "",
    companies: "",
    focusArea: "",
    cgpa: "",
    notes: "",
  })
  
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  const [questions, setQuestions] = useState<QuestionDoc[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [mcqCategory, setMcqCategory] = useState<string>("DSA")
  const [mcqDifficulty, setMcqDifficulty] = useState<string>("")
  const [mcqQuestions, setMcqQuestions] = useState<any[]>([])
  const [isLoadingMcqs, setIsLoadingMcqs] = useState(false)
  const [mcqError, setMcqError] = useState<string | null>(null)
  const [quizStarted, setQuizStarted] = useState(false)
  const [questionsPerQuiz, setQuestionsPerQuiz] = useState(10)

  const {
    recordSolvedQuestion,
    isQuestionSolved,
    solvedCount,
    countsByDifficulty,
    countsByType,
  } = usePrepProgress()

  const favoriteSubjects = profile.favoriteSubjects
  const companyList = useMemo(() => {
    return profile.companies
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  }, [profile.companies])

  // Load MCQ questions
  const loadMcqQuestions = async () => {
    try {
      setIsLoadingMcqs(true)
      setMcqError(null)
      
      console.log(`Loading ${questionsPerQuiz} ${mcqCategory} questions (${mcqDifficulty} difficulty)`);
      
      const response = await fetch(`/api/mcqs/${mcqCategory.toLowerCase()}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(
          errorData.error || 
          `Failed to load ${mcqCategory} questions (${response.status} ${response.statusText})`
        );
      }
      
      const data = await response.json();
      
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid data format: questions array is missing or invalid');
      }
      
      console.log(`Loaded ${data.questions.length} total questions for ${mcqCategory}`);
      
      // Filter by difficulty if not 'all'
      let filteredQuestions = data.questions;
      if (mcqDifficulty !== 'all') {
        filteredQuestions = data.questions.filter(
          (q: any) => q.difficulty?.toLowerCase() === mcqDifficulty.toLowerCase()
        );
        console.log(`Filtered to ${filteredQuestions.length} questions with difficulty: ${mcqDifficulty}`);
      }
      
      if (filteredQuestions.length === 0) {
        throw new Error(
          `No questions found for ${mcqCategory} ` + 
          `${mcqDifficulty !== 'all' ? `with difficulty: ${mcqDifficulty}` : ''}`
        );
      }
      
      // Shuffle and take the requested number of questions
      const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, Math.min(questionsPerQuiz, shuffled.length));
      
      console.log(`Selected ${selectedQuestions.length} random questions`);
      
      setMcqQuestions(selectedQuestions);
      setQuizStarted(true);
    } catch (err) {
      console.error('Error loading MCQs:', err);
      setMcqError(err instanceof Error ? err.message : "Failed to load questions")
    } finally {
      setIsLoadingMcqs(false)
    }
  }

  const handleMcqComplete = (score: number, total: number) => {
    console.log(`Quiz completed! Score: ${score}/${total}`)
  }

  // Rest of your component code...
  // [Previous implementation of useEffect, handlers, and render functions]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Interview Preparation</h1>
          <p className="text-muted-foreground">
            Track your preparation progress and practice questions
          </p>
        </div>
        
        <Tabs defaultValue="mcq" className="space-y-4">
          <TabsList className="bg-gray-900/50 border border-gray-700">
            <TabsTrigger value="mcq" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
              MCQ Practice
            </TabsTrigger>
            <TabsTrigger value="prep" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
              Preparation Tracker
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="mcq" className="space-y-4">
            <Card className="bg-gray-900/80 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">MCQ Practice</CardTitle>
                <CardDescription className="text-gray-400">
                  Test your knowledge with multiple choice questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!quizStarted ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mcq-category" className="text-gray-300">Category</Label>
                        <Select 
                          value={mcqCategory} 
                          onValueChange={setMcqCategory}
                          disabled={isLoadingMcqs}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {MCQ_CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category} className="hover:bg-gray-700">
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mcq-difficulty" className="text-gray-300">
                          Difficulty (Optional)
                        </Label>
                        <Select 
                          value={mcqDifficulty} 
                          onValueChange={setMcqDifficulty}
                          disabled={isLoadingMcqs}
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="All difficulties" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="all" className="hover:bg-gray-700">All Difficulties</SelectItem>
                            <SelectItem value="Easy" className="hover:bg-gray-700">Easy</SelectItem>
                            <SelectItem value="Medium" className="hover:bg-gray-700">Medium</SelectItem>
                            <SelectItem value="Hard" className="hover:bg-gray-700">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="questions-count" className="text-gray-300">
                        Number of Questions
                      </Label>
                      <Select 
                        value={questionsPerQuiz.toString()} 
                        onValueChange={(value) => setQuestionsPerQuiz(parseInt(value))}
                        disabled={isLoadingMcqs}
                      >
                        <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Number of questions" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="5" className="hover:bg-gray-700">5 Questions</SelectItem>
                          <SelectItem value="10" className="hover:bg-gray-700">10 Questions</SelectItem>
                          <SelectItem value="20" className="hover:bg-gray-700">20 Questions</SelectItem>
                          <SelectItem value="50" className="hover:bg-gray-700">50 Questions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={loadMcqQuestions} 
                      disabled={isLoadingMcqs}
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoadingMcqs ? 'Loading...' : 'Start Quiz'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-white">{mcqCategory} Quiz</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setQuizStarted(false)
                          setMcqQuestions([])
                        }}
                        className="text-gray-300 border-gray-600 hover:bg-gray-800 hover:text-white"
                      >
                        Change Settings
                      </Button>
                    </div>
                    
                    {mcqError ? (
                      <div className="text-red-400 p-4 bg-red-900/20 rounded-lg">
                        {mcqError}
                      </div>
                    ) : (
                      <MCQDisplay 
                        questions={mcqQuestions} 
                        onComplete={handleMcqComplete} 
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="prep" className="space-y-4">
            {/* Your existing preparation tracker content */}
            <Card className="bg-gray-900/80 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">Preparation Tracker</CardTitle>
                <CardDescription className="text-gray-400">
                  Coming soon...
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
