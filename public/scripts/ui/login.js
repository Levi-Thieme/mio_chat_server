import { Login, authenticate } from "./loginService.js";
import { setState as setUserState } from "./userState.js";

$(document).ready(function() {
    $('#loginform').on('submit', async (e) => {
        try {
            showErrorMessage("");
            e.preventDefault();
            const login = getLogin();
            validateLogin(login);
            const response = await authenticate(login);
            if (response.invalidCredentials) {
                throw new Error("Incorrect username or password");
            }
            else if (response.serverError) {
                throw new Error("An error occurred. Please try again.");
            }
            else {
                setUserState(response.user);
                //TODO: extract to a client-side routing service
                window.location.href = "/home";
            }
        }
        catch (error) {
            showErrorMessage(error.message);
        }
        
    })
});

function getLogin() {
    return new Login($("#username").val(), $("#password").val());
}

/**
 * 
 * @param {Login} login 
 */
function validateLogin(login) {
    if (login.username.length === 0) {
        throw new Error("Enter your username");
    }
    else if (login.password.length === 0) {
        throw new Error("Enter your password");
    }
}

function showErrorMessage(error) {
    $("#errorMessage").text(error);
}