import { MongoClient, type Db } from "mongodb"

const uri = process.env.BETTER_AUTH_DB_URI as string

/**
 * Reuse the client across hot reloads in development so we don't open a new
 * connection pool on every request.
 */
const globalForMongo = globalThis as unknown as {
  mongoClientPromise?: Promise<MongoClient>
}

function getClientPromise() {
  if (!globalForMongo.mongoClientPromise) {
    globalForMongo.mongoClientPromise = new MongoClient(uri).connect()
  }

  return globalForMongo.mongoClientPromise
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise()
  return client.db("hireloopdb")
}
