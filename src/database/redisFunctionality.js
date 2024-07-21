const client=require('./redisdb');

exports.setRedis=async(key, value)=>{
    try{
        await client.set(key, value);
    } catch(error){
        console.error("Error setting data to Redis:", error);
    }
}

exports.setExRedis=async(key, value, ttl)=>{
    try{
        // await redis.set("foo", "bar", "EX", 20);
        await client.set(key, value, "EX", ttl);
    } catch(error){
        console.error("Error setting data to Redis:", error);
    }
}

exports.getRedis=async(key)=>{
    try {
        const result = await client.get(key);
        console.log("Result->", result);
        return result;
      } catch (error) {
        console.error("Error fetching data from Redis:", error);
      }
}

