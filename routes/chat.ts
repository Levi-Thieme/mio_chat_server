import express from "express";
import { getChatsByUser } from "../controllers/chat";

const router = express.Router();

router.get("/chats/:userId", (req, res) => {
    res.json(getChatsByUser(req.params.userId))
})

export default router;