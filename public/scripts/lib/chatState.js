export class ChatState {
    constructor(
        chatId,
        chatName,
        message
    ) {
        this.chatId = chatId;
        this.chatName = chatName;
        this.message = message;
    }
}

const key = "chatState";
const initialState = {
    chatId: "",
    chatName: "",
    message: ""
}

/**
 * @param {ChatState} newState 
 * @returns {ChatState} the updated state of the application
 */
export function setState(newState) {
    const chatState = {
        ...getState(),
        ...newState
    };
    sessionStorage.setItem(key, JSON.stringify(chatState));
    return chatState;
}

export function getState() {
    const chatState = sessionStorage.getItem(key);
    return chatState ? JSON.parse(chatState) : initialState;
}