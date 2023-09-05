const RedisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  /**
   * should return if Redis is alive and if the DB is alive too
   * by using 2 utils created prev:
   * { "redis": true, "db": true } with status code 200
   */
  static getStatus(req, res) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    response.status(200).send(status);
  }
