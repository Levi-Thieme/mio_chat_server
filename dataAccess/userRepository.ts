import { connect } from "./connectionProvider";
import { DbUser, User, UserCredentials, UserRegistration } from "../models/user";
import { hashPassword, Password, passwordMatchesHash } from "../services/passwordService";
import { ObjectId } from "mongodb";

export default class UserRepository {
    private readonly USERS = "users";

    public async addUser(userRegistration: UserRegistration): Promise<User | null> {
        const client = await connect();
        const password: Password = await hashPassword(userRegistration.password);
        const userToInsert: DbUser = {
            ...userRegistration,
            _id: new ObjectId(),
            password: password.hash,
            salt: password.salt
        };
        const result = await client.db().collection(this.USERS).insertOne(userToInsert);
        client.close();
        return new User(userToInsert._id.toString(), userToInsert.username, userToInsert.email);
    }

    public async findByCredentials(credentials: UserCredentials): Promise<User | null> {
        const client = await connect();
        const usersWithUsername = await client.db().collection(this.USERS).find<DbUser>({ 
            username: credentials.username
        });
        while (await usersWithUsername.hasNext()) {
            const user = await usersWithUsername.next();
            if (user && await passwordMatchesHash(credentials.password, user.password)) {
                client.close();
                return new User(user._id.toString(), user.username, user.email);
            }
        }
        client.close();
        return null;
    }
}