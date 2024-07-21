const Redis= require('ioredis');

const client= new Redis();
// const client= new Redis('host.docker.internal',6379 );


module.exports=client;