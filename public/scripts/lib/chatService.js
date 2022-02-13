export class Chat {
    /**
     * 
     * @param {string} id 
     * @param {string} name 
     */
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

/**
 * 
 * @param {string} userId 
 * @returns {Promise<Chat[]>} 
 */
export async function getChatsByUser(userId) {
    const response = await fetch(`/chats/${userId}`);
    return response.json();
}