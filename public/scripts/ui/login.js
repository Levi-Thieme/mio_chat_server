import { Login, authenticate } from "./loginService.js";

$(document).ready(function() {
    $('#loginform').on('submit', async (e) => {
        e.preventDefault();
        const login = getLogin();
        if (isValidLogin(login)) {
            try {
                const response = await authenticate(login);
                if (response.status !== 200) {
                    throw Error("Your username or password were invalid.");
                }
                if (response.redirected) {
                    window.location = response.url;
                }
            }
            catch (error) {
                showErrorMessage(error);
            }
        } else {
            showErrorMessage("You must fill out the username and password fields.");
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
function isValidLogin(login) {
    return login.username && login.username.length > 0 && login.password && login.password.length > 0;
}

function showErrorMessage(error) {
    $("#errorMessage").text(error);
}