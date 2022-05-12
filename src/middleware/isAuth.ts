import  jwt  from "jsonwebtoken";
import { Express, Request, Response, NextFunction } from 'express';
import express from 'express';
require("dotenv").config();

interface tokenVerify{
    email:string,
    userId : string
}

const isAuth = (req: Request, res: Response, next: NextFunction)=>{
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1]; 
    let decodedToken:tokenVerify ;

    try {
     decodedToken = jwt.verify(token,process.env.JWT_SECRET as jwt.Secret) as tokenVerify
    } catch (error) {
        req.isAuth = false;
        return next();
    }

    if (!decodedToken) {
        req.isAuth = false;
        const error = new Error('Unauthorized')
        return next();
    }

    req.userId =  decodedToken.userId
    req.isAuth = true;
    next();
}

export{
    isAuth
}