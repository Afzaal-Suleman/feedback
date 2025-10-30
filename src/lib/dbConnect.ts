import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

const connectDB = async (): Promise<void> => {
    if (connection.isConnected) {
        console.log("Already connected to DB");
        return;
    }
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        const db = await mongoose.connect(process.env.MONGO_URI);
        console.log(db);

        connection.isConnected = db.connections[0].readyState;
        console.log(`MongoDB connected: ${db.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
