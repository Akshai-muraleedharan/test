import mongoose from 'mongoose'



export const db = async () => {
     try {
         mongoose.connect(process.env.MONGO_URL)
         console.log("mongodb connected successfully")
     } catch (error) {
        console.log(error)
     } 
} 