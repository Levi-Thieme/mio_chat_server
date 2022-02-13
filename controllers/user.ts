import { User, UserCredentials } from "../models/user";

export default class UserController {

    createUser() {
        return;
    }

    login(credentials: UserCredentials): User {
        return { 
            id: "1",
            username: "lthieme",
            email: "lthieme@gmail.com"
        }
    }
}