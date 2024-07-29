import pool from "../pg";
import { Req } from "../types/types";
import {genSalt, compare, hash} from "bcryptjs";
import { verify, sign } from "jsonwebtoken"

export const registerUser=async(req:Req,res:any)=>{
    try {
        const {username,phone_number,password,lastLogin,userPlatform}=req.body.data;
        if (username&&phone_number&&password) {
            const salt=await genSalt(10);
            const hashedPassword=await hash(password,salt);
            pool.query('INSERT INTO users (username, phone_number, password, lastLogin, userPlatform) VALUES ($1, $2, $3, $4, $5) RETURNING *', [username, phone_number, hashedPassword, lastLogin, userPlatform], async(error:any, results) => {
                if (error) {
                    res.status(408).send({error:`Account already exist!`})
                }else{
                    res.status(201).send({
                        msg:`Welcome ${results.rows[0].username}`,
                        data:{
                            username:results.rows[0].username,
                            phone_number:results.rows[0].email,
                            access_token:generateUserToken(results.rows[0].id)
                        }
                    })
                }
            })
            
        } else {
            res.status(403).send({error:"Fill all the required fields!!"})
        }
    } catch (error:any) {
        res.status(500).send({error:error.message})
    }
}

export const loginUser=async(req:Req,res:any)=>{
    try {
        const {phone_number,password,lastLogin,userPlatform}=req.body.data;
        if(phone_number&&password&&lastLogin&&userPlatform){
            pool.query('SELECT * FROM users WHERE phone_number = $1',[phone_number],async (error,results)=>{
                if(error){
                    console.log(error)
                    res.status(400).send({error:'Failed to sign in, try again!'})
                }else{
                    if(results.rows[0]){
                        if (results.rows[0].email&&await compare(password,results.rows[0].password)) {
                            pool.query('UPDATE users SET lastLogin = $1, userPlatform = $2 WHERE phone_number = $3 RETURNING *',[lastLogin,userPlatform,results.rows[0].phone_number],(error,results)=>{
                                if(error){
                                    console.log(error)
                                }else{
                                    res.status(201).send({
                                        msg:`Welcome ${results.rows[0].username}`,
                                        data:{
                                            username:results.rows[0].username,
                                            phone_number:results.rows[0].email,
                                            access_token:results.rows[0].access_token,
                                        }
                                    })
                                }
                            })
                        }else if(await compare(password,results.rows[0].password)===false){
                            res.status(401).send({error:'You have enter the wrong password'})
                        }
                    }else{
                        res.status(404).send({error:`Account does not exist!`})
                    }
                }
            })
        }else{
            res.status(403).send({error:"Fill all the required fields!!"})
        }
    } catch (error:any) {
        res.status(500).send({error:error.message})
    }
}

export const getUsers=async(req:Req,res:any)=>{
    try {
        pool.query('SELECT * FROM users', (error, results) => {
            if (error) {
                console.log(error)
                res.status(404).send({error:`Failed to get users.`})
            }else{
                res.status(200).json(results.rows)
            }
        })
    } catch (error:any) {
        res.status(500).send({error:error.message})
    }
}

export const getUser=async(req:Req,res:any)=>{
    try {
        const { phone_number } =req.params
        pool.query('SELECT * FROM users WHERE phone_number=$1',[phone_number], (error, results) => {
            if (error) {
                console.log(error)
                res.status(404).send({error:`User not Found.`})
            }else{
                res.status(200).json({
                    data:{
                        username:results.rows[0].username,
                        phone_number:results.rows[0].phone_number,
                    }
                })
            }
        })
    } catch (error:any) {
        res.status(500).send({error:error.message})
    }
}


export const updateUser=async(req:any,res:any)=>{
    try {
        const { phone_number } = req.params
        const { username, old_password,password } = req.body
         if(!username&&password&&!phone_number){
            //update password only
            pool.query('SELECT * FROM users WHERE phone_number = $1',[phone_number],async (error,results)=>{
                if(error){
                    console.log(error)
                    res.status(404).send({error:'User not found!'})
                }else{
                    if (results.rows[0].phone_number&&await compare(old_password,results.rows[0].password)) {
                        const salt=await genSalt(10);
                        const hashedPassword=await hash(password,salt);
                        pool.query(
                            'UPDATE users SET password = $1 WHERE phone_number = $2',
                            [hashedPassword, phone_number],
                            (error, results) => {
                                if (error) {
                                    console.log(error)
                                    res.status(501).send({error:`Failed to update password`})
                                }else{
                                    res.status(200).send({msg:`Password updated`})
                                }
                            }
                        )
                    }else{
                        res.status(401).send({error:"you've entered false credential!"})
                    }
                }
            })
        }else if(username&&!password&&!phone_number){
            //update username only
            pool.query(
                'UPDATE users SET username = $1 WHERE phone_number = $2 RETURNING *',
                [username, phone_number],
                async(error, results) => {
                    if (error) {
                        console.log(error)
                        res.status(501).send({error:`Failed to update this account}`})
                    }else{
                        res.status(200).send({msg:`Account details updated successful`})
                    }
            })
        }      
    } catch (error:any) {
        res.status(500).send({error:error.message})
    }
}

export const getUserDetails=async(req:Req,res:any)=>{
    try {
        const phone_number = req.params.phone_number
        pool.query('SELECT * FROM users WHERE phone_number = $1', [phone_number], (error, results) => {
            if (error) {
                console.log(error)
                res.status(404).send({error:`Account does not exist!`})
            }else{
                if(results.rows[0]){
                    res.status(200).json({
                        data:{
                            username:results.rows[0].username,
                            phone_number:results.rows[0].phone_number,
                        }
                    })
                }else{
                    res.status(404).send({error:`Account does not exist!`})
                }
            }
        })
    } catch (error:any) {
        res.status(500).send({error:error.message})
    }
}

export const protectUser=async(req:any,res:any,next:any)=>{
    let token
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
        try{
            token=req.headers.authorization.split(' ')[1]
            verify(token,`${process.env.JWT_SECRET}`);
            next()
        }catch (error:any){
            res.status(401).send({error:'Not Authorised☠'})
        }
    }
    if(!token){
      res.status(401).send({error:'No Token Available☠'})
    }
};

export const deleteUser=async(req:Req,res:any)=>{
    try {
        const {phone_number} = req.params
        pool.query(`
        DELETE FROM users WHERE phone_number=$1 RETURNING *
        `, [phone_number], async(error, results) => {
            if (error) {
                res.status(408).send({error:`Failed to delete this account`})
                console.log(error)
            }else{
                if (results.rows) {
                    res.status(404).send({error:`Account deleted`})
                }
            }
        })
    } catch (error:any) {
        res.status(500).send({error:error.message})
    }
}

const generateUserToken=(id:string)=>{
    return sign({id},`${process.env.JWT_SECRET}`,{
        expiresIn:'10d'
    })
};

