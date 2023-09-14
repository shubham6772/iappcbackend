import mongoose from "mongoose";

export const connectDB = async () => {
    try {

        const { connections } = await mongoose.connect(process.env.MONGO_URI,{
            dbName : "iappc",
        })
        console.log(`Server connected to the database`)
        

    } catch (error) {
        console.log(`error occurred while connecting ${error}`);
        process.exit(1);
    }
}