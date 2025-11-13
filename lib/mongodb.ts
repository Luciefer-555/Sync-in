import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error("⚠️ MONGODB_URI missing from environment variables")
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

type MongooseGlobal = typeof globalThis & { mongoose?: MongooseCache }

const globalWithMongoose = global as MongooseGlobal

const cached: MongooseCache = globalWithMongoose.mongoose ?? {
  conn: null,
  promise: null,
}

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached
}

async function dbConnect() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    const opts = { bufferCommands: false }
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => mongooseInstance)
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
