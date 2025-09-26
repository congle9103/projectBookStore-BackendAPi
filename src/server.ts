import app from './app';
import mongoose from 'mongoose'

// Kết nối đến MongoDB
mongoose
.connect('mongodb+srv://learnit91031_db_user:<db_password>@bookstore-backendapi.9mon2u8.mongodb.net/?retryWrites=true&w=majority&appName=bookStore-backendApi')
.then(() => {
  console.log('Connected to MongoDB successfully');
  // Khởi động server
  app.listen(8080, () => {
    console.log(`Server is running on http://localhost:8080`);
  });
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});