import { NotFoundError, UnauthorizedError } from "../../utils/errors.js";
import { message } from "../../utils/messages.js";
import { toUserProfile } from "./users.dto.js";
import Users from "./users.model.js";
import { Request } from "express";

export const getUserProfile = async (req: Request) => {
  try {
    if (req.user) {
      const user = await Users.findOne({
        _id: req.user.id,
      });

      if (!user) {
        throw new NotFoundError(message.failed.user.userNotFound);
      } else {
        return toUserProfile({
          ...user.toObject(),
        });
      }
    } else {
      throw new UnauthorizedError();
    }
  } catch (error: unknown) {
    throw error;
  }
};
