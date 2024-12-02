import express from 'express'
import jwt from 'jsonwebtoken'
import userModel from '../model/user.js'
import bcrypt from 'bcrypt'

const router = express.Router();


router.post("/register", async (req,res) => {

    try {
      
        const {username,password} = req.body
       
        const user = await new userModel({
            username,
            password
        })

        await user.save()

        res.status(201).json({success:false, message:"User created successfully"})
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
})
 

router.post('/login', async (req,res) => {
   try {
    const {username,password} = req.body

    if(!username || !password)return res.status(400).json({success:false,message:"all fields required"})

    const userFind = await userModel.findOne({username:username})


   if(!userFind) return res.status(400).json({success:false,message:"user not found"})

 
    const checkPassword =await bcrypt.compare(password,userFind.password)

   
    if(!checkPassword) return res.status(400).json({success:false,message:"invalid credentials"})

        const token = jwt.sign({userid:userFind._id},process.env.JWT_SECRET,{
            expiresIn:"1h"
        })

        res.cookie('token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            maxAge:3600000,
            sameSite:'Strict'
        })

        res.status(200).json({success:true,message:"login successfully"})

   } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
   }
})


function verifyToken(req,res,next) {
    try {
        const {token} = req.cookies

        if(!token) return res.status(403).json({success:false,message:"Access denied, no token provided"})

       const decodedToken = jwt.verify(token,process.env.JWT_SECRET)

       if(!decodedToken) return res.status(403).json({success:false,message:" invalid token"})
        req.user = decodedToken.userid
    next()
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
} 


router.get('/secure-route',verifyToken, async(req,res)=>{
    try {
        const id = req.user;

        const findUser = await userModel.findById(id).select('-password')

        res.status(200).json({success:true,message:"user fetch",data:findUser})
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
})

router.post('/logout',verifyToken,async (req,res)=> {
    try {
        res.clearCookie("token",{httpOnly: true, secure: process.env.NODE_ENV === 'production' })

        res.status(200).json({success:true,message:"logout successfully"})
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
})

router.get('/check',verifyToken,async(req,res)=>{
    try {
        const userAuth = req.user


        if(!userAuth) res.status(400).json({success:false,message:"user not authenticated"})

            res.json({ success: true, message: "user authenticatd" });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
})



export default  router