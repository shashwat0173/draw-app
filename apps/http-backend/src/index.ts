import express from "express";
import { authMiddleware } from "./middleware";

const app = express();

app.post("/signup", (req, res) => {});

app.post("/signin", (req, res) => {});

app.post("/room", authMiddleware, (req,res) => {

})

app.listen(3001);
