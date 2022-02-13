import express from "express";
import path from "path";

const router = express.Router();

router.get("/home", (req, res) => {
    const url = path.join(__dirname, "../private/home.html");
    res.sendFile(url);
});

export default router;