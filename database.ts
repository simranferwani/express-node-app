import mongoose from 'mongoose';

async function connectDB(): Promise<void> {
  try {
 // MongoDB connection URL
    const dbUrl = 'mongodb://localhost:27017'; // Replace with your MongoDB connection URL

    // Connect to MongoDB
    await mongoose.connect(dbUrl);
    console.log('Successfully connected to the database');
  } catch (error) {
    console.error('Database connection failed. Exiting now...', error);
    process.exit(1); // Exit with a non-zero code to indicate an error
  }
}

export default connectDB;
