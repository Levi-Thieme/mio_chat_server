import { connect } from "./connectionProvider";
import { DbUser, User, UserCredentials, UserRegistration } from "../models/user";
import { hashPassword, passwordMatchesHash } from "../services/passwordService";
import { MongoClient, ObjectId } from "mongodb";

export default class UserRepository {
    private readonly USERS = "users";

    public async addUser(userRegistration: UserRegistration): Promise<User | null> {
        const client = await connect();
        const userToInsert: DbUser = await this.createDbUser(client, userRegistration);
        await client.db().collection(this.USERS).insertOne(userToInsert);
        client.close();
        return this.toUser(userToInsert);
    }

    private async createDbUser(client: MongoClient, userRegistration: UserRegistration): Promise<DbUser> {
        const passwordHash: string = await hashPassword(userRegistration.password);
        const user: DbUser = {
            _id: new ObjectId(),
            username: userRegistration.username,
            email: userRegistration.email,
            password: passwordHash
        };
        return user;
    }

    public async findByUsername(username: string): Promise<User | null> {
        const client = await connect();
        const user = await this.findDbUserByUsername(client, username);
        client.close();
        return user ? this.toUser(user) : null;
    }

    public async findByCredentials(credentials: UserCredentials): Promise<User | null> {
        let user: User | null = null;
        const client = await connect();
        const dbUser = await this.findDbUserByUsername(client, credentials.username);
        if (dbUser != null && await passwordMatchesHash(credentials.password, dbUser.password)) {
            return this.toUser(dbUser);
        }
        client.close();
        return user;
    }

    private async findDbUserByUsername(client: MongoClient, username: string): Promise<DbUser | null> {
        const user = await client.db().collection(this.USERS).findOne<DbUser>({ 
            username: username
        });
        return user;
    }

    private toUser(dbUser: DbUser): User {
        return new User(dbUser._id.toString(), dbUser.username, dbUser.email);
    }
}