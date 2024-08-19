import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('Define the MONGO_URI environment variable inside .env.local');
}

let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const db = await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedDb = db;
  return db;
}



