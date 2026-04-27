const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

let memoryServer = null;

async function connectDB() {
  let uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/coldtech';

  if (process.env.USE_IN_MEMORY_DB === 'true') {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const base = memoryServer.getUri();
    // e.g. mongodb://127.0.0.1:12345/ → append database name
    const clean = base.endsWith('/') ? base.slice(0, -1) : base.replace(/\/$/, '');
    uri = `${clean}/coldtech`;
    console.log('Using in-memory MongoDB (USE_IN_MEMORY_DB=true) — no MongoDB install needed');
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

module.exports = { connectDB, getMemoryServer: () => memoryServer };
