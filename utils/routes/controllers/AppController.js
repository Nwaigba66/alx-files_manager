import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const getStatus = (req, res) => {
  res.status(200);
  res.send({
    redis: redisClient.isAlive(),
    db: dbClient.isAlive(),
  });
};

const getStats = async (req, res) => {
  Promise.all([dbClient.nbUsers(), dbClient.nbFiles()])
    .then((data) => {
      res.status(200);
      res.send({ users: data[0], files: data[1] });
    })
    .catch((error) => {
      throw new Error(error);
    });
};

const AppController = { getStatus, getStats };
module.exports = AppController;
