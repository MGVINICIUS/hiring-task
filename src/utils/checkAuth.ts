import { NextFunction } from "express";
import { Env } from "../env";
import jwt from "jsonwebtoken";
import { PayloadType } from "../types";
import { userService } from "../services";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const checkAuth = async (req, _res, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const { secretKey } = Env;
    const { uuid } = jwt.verify(token, secretKey) as { uuid: string };
    
    const user = await userService.getOneUser({ uuid });
    
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedError("Authentication failed"));
  }
};
