import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import mongoose from "mongoose"

const QuestionSchema = new mongoose.Schema({}, { strict: false })
const Question = mongoose.models.Question || mongoose.model("Question", QuestionSchema)

export async function GET(req: Request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)

    const domains = searchParams.getAll("domain").map((value) => value.trim()).filter(Boolean)
    const companies = searchParams.getAll("company").map((value) => value.trim()).filter(Boolean)
    const difficulties = searchParams.getAll("difficulty").map((value) => value.trim()).filter(Boolean)
    const subjectParams = searchParams.getAll("subject").map((value) => value.trim()).filter(Boolean)
    const typeParams = [...searchParams.getAll("questionType"), ...searchParams.getAll("type")]
      .map((value) => value.trim())
      .filter(Boolean)

    const andConditions: Record<string, unknown>[] = []

    if (domains.length) {
      andConditions.push({ domain: { $in: domains } })
    }

    if (companies.length) {
      andConditions.push({ companyFocus: { $in: companies } })
    }

    if (difficulties.length) {
      andConditions.push({ difficulty: { $in: difficulties } })
    }

    const orConditions: Record<string, unknown>[] = []

    if (subjectParams.length) {
      orConditions.push({ subject: { $in: subjectParams } })
      orConditions.push({ subjects: { $in: subjectParams } })
      orConditions.push({ domain: { $in: subjectParams } })
      orConditions.push({ topics: { $in: subjectParams } })
    }

    if (typeParams.length) {
      orConditions.push({ questionType: { $in: typeParams } })
      orConditions.push({ type: { $in: typeParams } })
      orConditions.push({ category: { $in: typeParams } })
    }

    if (orConditions.length) {
      andConditions.push({ $or: orConditions })
    }

    const filter = andConditions.length ? { $and: andConditions } : {}

    const results = await Question.find(filter).limit(20).lean()
    return NextResponse.json(results)
  } catch (error: unknown) {
    console.error("API Error:", error)
    const message = error instanceof Error ? error.message : "Unexpected server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
