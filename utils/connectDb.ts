import mongoose, {ConnectOptions} from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

export type Mongo =  typeof mongoose;

declare global {
    var db: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.db

if (!cached) {
  cached = global.db = { conn: null, promise: null }
  
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts);
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect