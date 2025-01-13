import { userService } from "../../services";
import { errorHandlerWrapper } from "../../utils";
import { generateToken } from "../../utils/generate";
import { comparePassword } from "../../utils/password";
import httpStatus from "http-status";
import { UnauthorizedError } from "../../errors/unauthorized.error";

const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  const findUser = await userService.getOneUser({ email });
  
  if (!findUser) {
    throw new UnauthorizedError("Invalid email or password");
  }
  
  if (findUser.deletedAt) {
    throw new UnauthorizedError("Account has been deleted");
  }
  
  const compare = await comparePassword(password, findUser.password);
  if (!compare) {
    throw new UnauthorizedError("Invalid email or password");
  }
  
  const token = generateToken(findUser.uuid);
  res.status(200).json({ token });
};

export const loginController = errorHandlerWrapper(loginHandler);
