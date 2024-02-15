import express from "express";
import cors from 'cors'
import jwt from 'jsonwebtoken'

import dotenv from 'dotenv'
import { genHash } from "./utils/bcrypt.js";
import { DB } from "./config/db.config.js";

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())


// const db = mysql.createConnection({
//     host:process.env.DB_HOST_NAME,
//     user:process.env.DB_USER,
//     password:process.env.DB_PASSWORD,
//     database:process.env.DATABASE_NAME
// })

app.post('/register',(req,res) => {
    
    try {
        const hashPass = genHash(req.body.password)      
        const sql = "INSERT INTO users (`name`,`email`,`password`) VALUES(?,?,?)";
        const result = DB.query(sql,[req.body.name,req.body.email,hashPass])
        res.send({
            status:201,
            message:'User Created Successfully',
            data:result.values
        })
        
       
   
    } catch (error) {
        console.log('server error',error)
        return 
    }
    
})


app.post('/login', async (req,res) => {
   try {
    const email = req.body.email;
    const password = req.body.password;
    const sql = 'SELECT * FROM users WHERE email = ?';
    const user = await DB.query(sql,[email])   
   } catch (error) {
    
   }
})
 // db.query(sql,[req.body.email], (err,data) => {
    //     if (err) return res.json({Error:"Login error in server"});
    //     if (data.length > 0) {
    //         bcrypt.compare(req.body.password.toString(), data[0].password,(err,response) => {
    //             if (err) return res.json({Error:"Password compare error"});
    //             if (response) {
    //                 return res.json({Status:"Success"});
    //             }
    //             else{
    //                 return res.json({Error:"Password not matched"})
    //             }
    //         })
    //     } else {
    //         return res.json({Error:"No email existed"})
    //     }
    // })

app.listen(8081,() => {
    console.log('My sql Running')
})