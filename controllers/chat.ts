import { Chat } from "../models/chat";

const chats = [
    { id: "1", name: "test 1" },
    { id: "2", name: "test 2" },
    { id: "3", name: "test 3" }
];

export function getChatsByUser(userId: string): Chat[] {
    return chats;
}