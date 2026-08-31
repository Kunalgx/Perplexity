import mongoose from "mongoose";

const connectDb = async () => {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MongoDB connection string is missing. Set MONGODB_URI in your environment.");
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDb connected successfully to ${conn.connection.host}`);
};

export default connectDb;