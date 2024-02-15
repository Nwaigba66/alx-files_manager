import { MongoClient } from 'mongodb';
import { promisify } from 'util';

class DBClient {
  constructor() {
    this.conAlive = false;
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const db = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/${db}`;
    this.client = new MongoClient(url);
    const conn = promisify(this.client.connect).bind(this.client);
    conn()
      .then(() => {
        this.conAlive = true;
      })
      .catch(() => {
        this.conAlive = false;
      });
  }

  isAlive() {
    return this.conAlive;
  }

  async nbUsers() {
    const db = this.client.db();
    try {
      const users = await db.collection('users');
      const numUser = await users.countDocuments();
      return numUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async nbFiles() {
    const db = this.client.db();
    try {
      const files = await db.collection('files');
      const numFiles = await files.countDocuments();
      return numFiles;
    } catch (error) {
      throw new Error(error);
    }
  }
}
const dbClient = new DBClient();
module.exports = dbClient;
