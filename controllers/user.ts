import { User, UserCredentials, UserRegistration } from "../models/user";
import UserRepository from "../dataAccess/userRepository";

export default class UserController {
    private users: UserRepository = new UserRepository();

    async createUser(registration: UserRegistration): Promise<User | null> {
        const user: User | null = await this.users.addUser(registration);
        return user;
    }

    login(credentials: UserCredentials): Promise<User | null> {
        return this.users.findByCredentials(credentials);
    }
}