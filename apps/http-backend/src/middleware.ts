import { NextFunction, Request, Response } from "express";
import jwt, { decode, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"] ?? "";
  const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;

  if (decoded.userId) {
    req.userId = decoded.userId;
    next();
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
}
