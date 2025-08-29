import express from "express";
import { authMiddleware } from "./middleware";
import { prismaClient } from "@repo/db/client";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.post("/signup", (req, res) => {
  const data = CreateUserSchema.safeParse(req.body);
  if (!data.success) {
    return res.json({
      message: "Incorrect inputs",
    });
  }
});

app.post("/signin", (req, res) => {
  const data = SigninSchema.safeParse(req.body);
  if (!data.success) {
    return res.json({
      message: "Incorrect inputs",
    });
  }
});

app.post("/room", authMiddleware, (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data.success) {
    return res.json({
      message: "Incorrect inputs",
    });
  }
});

app.listen(3001);
