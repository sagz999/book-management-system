import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

import { addUser, getUser } from "../dbContext/users.js";
import HttpError from '../utils/HttpError.js'

const jwtSecretKey =  process.env.JWT_SECRET ?? 'fabc4842baa614703de304efff8c9db3c2ba8a97cc8f8f1ae745c25304459178'
// console.log("jwt",jwtSecretKey);


export const createUser =async(credentials)=>{

    const{username,password} = credentials

    const user = await getUser({username})
    if(user) throw new HttpError(400, { message: "User already exist" })
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword }
    const {insertedId:userId} = await addUser(newUser)
    return jwt.sign({user_id:userId?.toString(),username },jwtSecretKey );

}

export const logInUser = async(credentials)=>{
    const{username,password} = credentials

    const user = await getUser({username})
    if (!user)  throw new HttpError (404,{message:'User not found'})
    if(!await bcrypt.compare(password, user.password)) throw new HttpError (401,{message:'Wrong credentials'})

       return jwt.sign({user_id:user?._id?.toString(),username: user.username }, jwtSecretKey);
        
}

export default {}