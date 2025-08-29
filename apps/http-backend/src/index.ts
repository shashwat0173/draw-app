import express from "express";
import { authMiddleware } from "./middleware";
import { hashPassword, comparePassword } from "./utils";
import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";

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

app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
    },
  });

  if (!user) {
    res.status(403).json({
      message: "Sign up first",
    });
    return;
  }
  const isPasswordCorrect = comparePassword(
    user?.password as string,
    parsedData.data.password
  );

  if (!isPasswordCorrect) {
    res.status(403).json({
      message: "Incorrect password",
    });
    return;
  }

  const token = jwt.sign(
    {
      userId: user?.id,
    },
    process.env.JWT_SECRET as string
  );

  res.json({
    token,
  });
});
