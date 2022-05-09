import express  from "express";
require('dotenv').config()


const app = express();

app.listen(process.env.APPLICATION_PORT,()=>{
    console.log(`Litening on port  ${process.env.APPLICATION_PORT}`);
});

