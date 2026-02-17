import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment from database.env file
dotenv.config({ path: './database.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Atlas Connected!');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
