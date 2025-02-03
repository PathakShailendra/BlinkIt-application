const mongoose = require('mongoose');

const connectDB = () => {
  const uri = process.env.MONGO_URI;
  if (!uri || !uri.startsWith('mongodb')) {
    console.error('Invalid MongoDB URI');
    process.exit(1);
  }

  mongoose.connect(uri)
    .then(() => {
      console.log('MongoDB connected successfully');
    })
    .catch((error) => {
      console.error('MongoDB connection failed:', error.message);
      process.exit(1);
    });
};

module.exports = connectDB;
