import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const db = process.env.DB_DATABASE || 'files_manager';

    this.client = new MongoClient(`mongodb://${host}:${port}/${db}`);
    this.client.connect();
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const db = this.client.db();
    const collection = db.collection('users');
    return collection.countDocuments();
  }

  async nbFiles() {
    const db = this.client.db();
    const collection = db.collection('files');
    return collection.countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
