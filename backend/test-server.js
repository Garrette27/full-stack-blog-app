import connectDB from './connect-db.js';
import { app } from './src/app.js';

// Connect to database first
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
