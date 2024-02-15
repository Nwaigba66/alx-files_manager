import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.isActive = true;
    this.client = createClient();
    this.client.on('error', (error) => console.log(error));
    this.client.on('ready', () => {
      this.isActive = true;
    });

    this.client.on('connect', () => {
      this.isActive = true;
    });

    this.client.on('end', () => {
      this.isActive = false;
    });
  }

  isAlive() {
    // Check if the client is connected
    return this.isActive;
  }

  async get(key) {
    // Use promisify to convert callback-based function to promise-based
    const getAsync = promisify(this.client.get).bind(this.client);
    const data = await getAsync(key);
    return data;
  }

  async set(key, val, duration) {
    // Use promisify to convert callback-based function to promise-based
    const setAsync = promisify(this.client.set).bind(this.client);
    await setAsync(key, val, 'EX', duration); // 'EX' specifies the expiration time in seconds
  }

  async del(key) {
    // Use promisify to convert callback-based function to promise-based
    const delAsync = promisify(this.client.del).bind(this.client);
    await delAsync(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
