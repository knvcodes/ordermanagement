import express from "express";
import { menusListing } from "./menu.controller.js";

const menuRouter = express.Router();

menuRouter.get("/list", menusListing);

export default menuRouter;
