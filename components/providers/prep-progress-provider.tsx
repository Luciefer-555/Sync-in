"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

type SolvedQuestionMeta = {
  id: string
  title: string
  subject?: string
  difficulty?: string
  questionType?: string
  companies?: string[]
  domain?: string | string[]
  timestamp: number
}

type PrepProgressContextValue = {
  solvedQuestions: SolvedQuestionMeta[]
  solvedCount: number
  countsByDifficulty: Record<string, number>
  countsBySubject: Record<string, number>
  countsByType: Record<string, number>
  recordSolvedQuestion: (meta: Omit<SolvedQuestionMeta, "timestamp">) => void
  isQuestionSolved: (id: string) => boolean
}

const STORAGE_KEY = "syncin_prep_progress"

const PrepProgressContext = createContext<PrepProgressContextValue | undefined>(undefined)

function loadInitialState(): Record<string, SolvedQuestionMeta> {
  if (typeof window === "undefined") return {}
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return {}
    const parsed = JSON.parse(stored) as Record<string, SolvedQuestionMeta>
    return parsed ?? {}
  } catch (error) {
    console.error("Failed to parse stored prep progress", error)
    return {}
  }
}

export function PrepProgressProvider({ children }: { children: ReactNode }) {
  const [solvedMap, setSolvedMap] = useState<Record<string, SolvedQuestionMeta>>(loadInitialState)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(solvedMap))
    } catch (error) {
      console.error("Failed to persist prep progress", error)
    }
  }, [solvedMap])

  const solvedQuestions = useMemo(() => Object.values(solvedMap), [solvedMap])

  const solvedCount = solvedQuestions.length

  const countsByDifficulty = useMemo(() => {
    return solvedQuestions.reduce<Record<string, number>>((acc, question) => {
      const key = question.difficulty || "Unspecified"
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    }, {})
  }, [solvedQuestions])

  const countsBySubject = useMemo(() => {
    return solvedQuestions.reduce<Record<string, number>>((acc, question) => {
      const key = question.subject || "General"
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    }, {})
  }, [solvedQuestions])

  const countsByType = useMemo(() => {
    return solvedQuestions.reduce<Record<string, number>>((acc, question) => {
      const key = question.questionType || "General"
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    }, {})
  }, [solvedQuestions])

  const recordSolvedQuestion: PrepProgressContextValue["recordSolvedQuestion"] = (meta) => {
    setSolvedMap((prev) => {
      if (prev[meta.id]) {
        return prev
      }

      return {
        ...prev,
        [meta.id]: {
          ...meta,
          timestamp: Date.now(),
        },
      }
    })
  }

  const isQuestionSolved = (id: string) => Boolean(solvedMap[id])

  const value: PrepProgressContextValue = {
    solvedQuestions,
    solvedCount,
    countsByDifficulty,
    countsBySubject,
    countsByType,
    recordSolvedQuestion,
    isQuestionSolved,
  }

  return <PrepProgressContext.Provider value={value}>{children}</PrepProgressContext.Provider>
}

export function usePrepProgress() {
  const context = useContext(PrepProgressContext)
  if (!context) {
    throw new Error("usePrepProgress must be used within PrepProgressProvider")
  }
  return context
}
