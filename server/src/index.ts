import express from "express";
import dotenv from "dotenv";
import db from "./config/db";

dotenv.config();

const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando em http://localhost${process.env.PORT}`)
})