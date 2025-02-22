import mongoose from 'mongoose';

export const connect = async () => { // export allows use in other files, const is a variable that cannot be reassigned
  try {
    await mongoose.connect(process.env.MONGO_URI, { // await waits for the promise to resolve
    });
    console.log('Connected to database');
  } catch (error) {
    console.error('Error connecting to database: ', error);
  }
}