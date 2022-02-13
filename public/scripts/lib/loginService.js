import { UserState } from "./userState.js";

export class Login {
    /**
     * @param {string} username 
     * @param {string} password 
     */
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

export class LoginResponse {
    /**
     * 
     * @param {boolean} invalidCredentials 
     * @param {boolean} serverError 
     * @param {UserState} user 
     */
    constructor(invalidCredentials, serverError = false, user = null) {
        this.invalidCredentials = invalidCredentials;
        this.serverError = serverError;
        this.user = user;
    }
}

/**
 * 
 * @param {Login} login 
 * @returns {Promise<LoginResponse>}
 */
export async function authenticate(login) {
    const response = await fetch("/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(login)
    });
    if (response.ok) {
        const userInfo = await response.json();
        const user = new UserState(userInfo.id, userInfo.username, userInfo.email);
        return new LoginResponse(false, false, user);
    }
    else if (response.status === 403) {
        return new LoginResponse(true, false);
    }
    else {
        return new LoginResponse(false, true);
    }
    
}