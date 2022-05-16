import { Request, Response} from 'express'
export interface SessionCtx{
    req:Request,
    res:Response
}