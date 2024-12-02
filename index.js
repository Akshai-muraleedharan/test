import express from 'express'
import { db } from './config/db.js';
import userRouter from "./routes/authRoutes.js"
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
const app = express();
const port = process.env.PORT || 5001;


app.use(bodyParser.json())
app.use(cookieParser())

db()

app.use(express.static('public'))
app.get('/',(req,res)=>{
    res.send("hello user")
})

app.use('/api/v1/user',userRouter)

app.listen(port,()=>{
    console.log(`server connected on port ${port}`)
})



