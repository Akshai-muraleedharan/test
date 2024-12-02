import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username:{
        type:String
    },
    password:{
        type:String
    }
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    const genSalt = 10
    const salt = bcrypt.genSaltSync(genSalt)

    this.password = await bcrypt.hashSync(this.password,salt)
    next()
})



const userModel = mongoose.model('register',userSchema)

export default userModel