import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local')
}

// Cache connection across hot reloads in development
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
}

const cache = global.mongooseCache ?? { conn: null, promise: null }
global.mongooseCache = cache

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  cache.conn = await cache.promise
  return cache.conn
}
