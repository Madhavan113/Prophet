// config/db.js
import mongoose from 'mongoose';

export const connect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected: ' + conn.connection.host);
    } catch (error) {
        console.log('Error connecting to database: ', error);
        process.exit(1);
    }
};