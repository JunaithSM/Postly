const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis(process.env.REDIS_URL,{
    maxRetriesPerRequest: null
});

const postQueue = new Queue("post-queue", { connection });

module.exports = { postQueue, connection };

