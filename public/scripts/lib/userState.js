export class UserState {
    /**
     * 
     * @param {string} id 
     * @param {string} username 
     * @param {string} email 
     */
    constructor(id, username, email) {
        this.userId = id;
        this.username = username;
        this.email = email;
    }
}

const key = "userState";
const initialState = new UserState("", "", "");

export function setState(newState) {
    const userState = {
        ...getState(),
        ...newState
    };
    sessionStorage.setItem(key, JSON.stringify(userState));
    return userState;
}

export function getState() {
    const userState = sessionStorage.getItem(key);
    return userState ? JSON.parse(userState) : initialState;
}