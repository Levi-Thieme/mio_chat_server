import { MongoClient } from "mongodb";

export async function connect(): Promise<MongoClient> {
    const databaseUrl: string = process.env["db_connection"] as string;
    const client = new MongoClient(databaseUrl);
    await client.connect();
    return client;
}