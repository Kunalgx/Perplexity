import mongoose from "mongoose";

const connectDb = async ()=>{
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDb connected Sucessfully`)
}
export default connectDb