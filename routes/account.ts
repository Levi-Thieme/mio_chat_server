import express from "express";
import path from "path";
import UserController from "../controllers/user";
import { User, UserCredentials, UserRegistration } from "../models/user";

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

router.post("/signup", async (req, res) => {
    try {
        const registration: UserRegistration = req.body;
        const registeredUser: User | null = await userController.createUser(registration);
        if (registeredUser) {
            res.json(registeredUser);
        }
        else {
            const userAlreadyExists: number = 400;
            res.sendStatus(userAlreadyExists);
        }
    }
    catch (error) {
        res.sendStatus(500);
    }
});

router.post("/login", async (req, res) => {
    try {
        const credentials: UserCredentials = req.body;
        const user = await userController.login(credentials);
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