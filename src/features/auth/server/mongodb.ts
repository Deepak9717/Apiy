import mongoose from 'mongoose'

const rawUri = process.env.MONGODB_URI ?? ''
const MONGODB_URI = rawUri.trim().replace(/^['"]|['"]$/g, '')

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your environment variables')
}

if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
  throw new Error(
    `MONGODB_URI is set but doesn't look like a valid connection string (starts with "${MONGODB_URI.slice(0, 12)}..."). ` +
      'Check for wrapping quotes, a stray "MONGODB_URI=" prefix, or extra whitespace in your host\'s env var settings.'
  )
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
