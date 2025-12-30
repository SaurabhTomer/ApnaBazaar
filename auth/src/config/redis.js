import Redis from 'ioredis'



const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
});


redis.on("connect", () => {
    console.log("Redis Connected");
      console.log("Host:", redis.options.host);
      console.log("Port:", redis.options.port);
});

export default redis;