import { NextResponse } from "next/server"
import dbConnect from "../../../lib/mongodb"
import mongoose from "mongoose"

const QuestionSchema = new mongoose.Schema({}, { strict: false })
const Question = mongoose.models.Question || mongoose.model("Question", QuestionSchema)

export async function GET(req: Request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)

    const domains = searchParams.getAll("domain").map(v => v.trim()).filter(Boolean)
    const companies = searchParams.getAll("company").map(v => v.trim()).filter(Boolean)
    const difficulties = searchParams.getAll("difficulty").map(v => v.trim()).filter(Boolean)
    const subjectParams = searchParams.getAll("subject").map(v => v.trim()).filter(Boolean)
    const typeParams = [...searchParams.getAll("questionType"), ...searchParams.getAll("type")]
      .map(v => v.trim())
      .filter(Boolean)

    const andConditions: any[] = []
    const orConditions: any[] = []

    if (domains.length) andConditions.push({ domain: { $in: domains } })
    if (companies.length) andConditions.push({ companyFocus: { $in: companies } })
    if (difficulties.length) andConditions.push({ difficulty: { $in: difficulties } })

    if (subjectParams.length) {
      orConditions.push(
        { subject: { $in: subjectParams } },
        { subjects: { $in: subjectParams } },
        { domain: { $in: subjectParams } },
        { topics: { $in: subjectParams } }
      )
    }

    if (typeParams.length) {
      orConditions.push(
        { questionType: { $in: typeParams } },
        { type: { $in: typeParams } },
        { category: { $in: typeParams } }
      )
    }

    if (orConditions.length) andConditions.push({ $or: orConditions })

    const filter = andConditions.length ? { $and: andConditions } : {}

    const results = await Question.find(filter).limit(20).lean()
    return NextResponse.json(results)
  } catch (error: any) {
    console.error("API Error:", error)
    return NextResponse.json({ error: error.message || "Unexpected server error" }, { status: 500 })
  }
}
