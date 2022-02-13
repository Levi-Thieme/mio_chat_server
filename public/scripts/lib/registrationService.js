
    export class Registration {
        /**
         * 
         * @param {string} username 
         * @param {string} email 
         * @param {string} password 
         * @param {string} passwordConfirmation 
         */
        constructor(username, email, password, passwordConfirmation) {
            this.username = username;
            this.email = email;
            this.password = password;
            this.passwordConfirmation = passwordConfirmation;
        }

    }

    export class RegistrationValidationResult {
        /**
         * 
         * @param {string} success 
         * @param {string} error 
         */
        constructor(success, error) {
            this.success = success;
            this.error = error;
        }
    }
    
    /**
     * 
     * @param {Registration} registration 
     * @returns {Promise<Response>}
     */
    export async function signup(registration) {
        const response = await fetch("/signup", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registration)
        });
        return response;
    }
    
    /**
     * 
     * @param {Registration} registration 
     * @returns {RegistrationValidationResult}
     */
    export function isRegistrationValid(registration) {
        if(!validUsername(registration.username)) { //invalid username
            return new RegistrationValidationResult(false, "Invalid username. Your username must be at least 2 characters long.");
        }
        else if(!validEmail(registration.email)) { //invalid email
            return new RegistrationValidationResult(false, "Invalid email address.");
        }
        else if (!validPassword(registration.password)) { //invalid password
            return new RegistrationValidationResult(false, "Invalid password. Your password must be at least 7 characters long.");
        }
        else if (registration.password !== registration.passwordConfirmation) {
            return new RegistrationValidationResult(false, "Invalid passwords. Your passwords must match.");
        }

        return new RegistrationValidationResult(true, ""); 
    }
    
    /**
     * 
     * @param {string} email 
     * @returns {boolean}
     */
    function validEmail(email) {
        var emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return email.match(emailRegex);
    }
    
    /**
     * 
     * @param {string} password 
     * @returns {boolean}
     */
    function validPassword(password) {
        return password.trim().length > 6;
    }
    
    /**
     * 
     * @param {string} username 
     * @returns {boolean}
     */
    function validUsername(username) {
        return username.trim().length > 2;
    }