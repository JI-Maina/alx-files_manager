const { createClient } = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.connected = false;
    this.client = createClient();

    this.client.on('error', (err) => {
      console.log(err);
    });

    this.client.on('connected', () => {
      this.isClientConnected = true;
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  async set(key, value, duration) {
    await promisify(this.client.SET).bind(this.client)(key, value, 'EX', duration);
  }

  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
