import { ObjectId } from "mongodb";

export class User {
    readonly id: string;
    readonly username: string;
    readonly email: string;

    constructor(id: string, username: string, email: string) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
}

export type DbUser = UserRegistration & UserCredentials & { _id: ObjectId };

export type UserRegistration = {
    username: string,
    email: string,
    password: string
}

export type UserCredentials = {
    username: string,
    password: string
}