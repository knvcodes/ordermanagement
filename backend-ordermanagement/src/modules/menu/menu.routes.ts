import express from "express";
import { menusListing } from "./menu.controller.js";
import { validate } from "../../middlewares/validation.js";
import { menuListingSchema } from "./menu.validate.js";

const menuRouter = express.Router();

menuRouter.get("/list", validate(menuListingSchema), menusListing);

export default menuRouter;
