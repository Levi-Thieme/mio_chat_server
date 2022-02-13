import express from "express";
import UserController from "../controllers/user";

const router = express.Router();

router.post("/signup", (req, res) => {
    const userController = new UserController();
    userController.createUser();
    res.redirect("/index.html");
});

export default router;