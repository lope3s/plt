import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URL || '');

const db = client.db('PLT');

export default db;
