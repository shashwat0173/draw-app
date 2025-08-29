import express from "express";
import { authMiddleware } from "./middleware";
import { hashPassword } from "./utils";
import { prismaClient } from "@repo/db/client";

import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log(parsedData.error);
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  try {
    const hashedPassword = await hashPassword(parsedData.data.password);
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.username,
        password: hashedPassword,
        name: parsedData.data.name,
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (e) {
    res.status(411).json({
      message: "User already exists with this username",
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
