import express from "express";
import path from "path";
import UserController from "../controllers/user";
import { UserCredentials } from "../models/user";

const router = express.Router();
const userController = new UserController();

router.get("/signup", (req, res) => {
    const url = path.join(__dirname, "../public/views/signup.html");
    res.sendFile(url);
});

router.get("/login", (req, res) => {
    const url = path.join(__dirname, "../public/views/login.html");
    res.sendFile(url);
});

router.get("/account", (req, res) => {
    const url = path.join(__dirname, "../private/account.html");
    res.sendFile(url);
});

router.post("/signup", (req, res) => {
    userController.createUser();
    res.redirect("/login");
});

router.post("/login", (req, res) => {
    try {
        const credentials: UserCredentials = req.body;
        const user = userController.login(credentials);
        if (user) {
            res.json(user);
        }
        else {
            const forbidden = 403;
            res.sendStatus(forbidden);
        }
    }
    catch (error) {
        res.sendStatus(500);
    }
})

export default router;