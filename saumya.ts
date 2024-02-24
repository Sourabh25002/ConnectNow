import { Router,Request,Response } from "express";
import Customer from "../models/Customer";
import query from "../db/database";
import bcrypt from 'bcrypt'
//import { upload } from '../middlewares/multer_middleware';
const router=Router();
//signup route
router.post('/signup',async (req:Request,res:Response)=>{
   try{ let {name, email, password}:Customer=req.body;

    if(!name || !email || !password){
        return res.status(400).json({message:"Please provide name, email, and password"})
    }

    // Trim leading and trailing whitespaces
     email = email.trim();
     password = password.trim();

    //if user already exist
     const emailExist= await query<Customer>('SELECT * FROM customer WHERE email=$1',[email])

     if (emailExist.rows.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
    }

     const hashedPassword = await bcrypt.hash(password, 10);

     //INSERT NEW ENTRY 
    const result=await query<Customer>('INSERT INTO customer(name, email, password) VALUES($1,$2,$3) RETURNING user_id',[name, email, hashedPassword])

    res.status(201).json({ message: "User created successfully", userId: result.rows[0].user_id });
}
catch(error:any){
    // Handle errors during sign-up
    console.error('Error during sign-up:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
}
})

export default router;