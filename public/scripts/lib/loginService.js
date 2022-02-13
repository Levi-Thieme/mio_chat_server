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

/**
 * 
 * @param {Login} login 
 * @returns {Promise<Response>}
 */
export async function authenticate(login) {
    const response = await fetch("/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(login)
    });
    return response;
}