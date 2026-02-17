import mongoose from 'mongoose';

const DATABASE_URL = 'mongodb+srv://gjencomienda:Lapport2711@garet.96jlm.mongodb.net/blog?retryWrites=true&w=majority&appName=Garet&authSource=admin';

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    await mongoose.connect(DATABASE_URL);
    console.log('✅ MongoDB connected successfully!');
    
    // Test a simple query
    const User = mongoose.connection.db.collection('users');
    const count = await User.countDocuments();
    console.log(`✅ Found ${count} users in database`);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
};

testConnection();
