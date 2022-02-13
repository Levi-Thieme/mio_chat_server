/*
Returns true if email is a valid email address.
*/
function validEmail(email) {
    var emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return email.match(emailRegex);
}

/*
Returns true password meets the length requirement.
*/
function validPassword(password) {
    return (password.trim().length) > 7;
}

/*
Returns true if username meets the length requirement.
*/
function validUsername(username) {
    return (username.trim().length) >= 3;
}

/*
Handles client side verification of update email for the myAccount page.
*/
function validateChangeEmail() {
    //Get username and password
    let emailValid = validEmail($("#updateEmailEmailInput").val());
    let passwordValid = validPassword($("#updateEmailPasswordInput").val());
    //Validate email and password
    if (emailValid && passwordValid) {
        return true;
    }
    alert("Invalid email or password.");
    return false;
}

/*
Handles client side verification of update password for the myAccount page.
*/
function validateUpdatePassword() {
    let password = $("#updatePasswordPasswordInput").val();
    let newPassword = $("#newPassword").val();
    let newPasswordConfirm = $("#newPasswordConfirm").val();
    
    if (!validPassword(password)) {
        alert("You must enter a valid password.");
        return false;
    }
    else if (!validPassword(newPassword)) {
        alert("You must enter a new password.");
        return false;
    }
    else if (!validPassword(newPasswordConfirm)) {
        alert("You must enter a confirmation for your new password.");
        return false;
    }
    else if (newPassword != newPasswordConfirm) {
        alert("Your new password does not match its confirmation.");
        return false;
    }
    else if (newPassword == password) {
        alert("Your new password must be different from your old password.");
        return false;
    }
    else {
        return true;
    }
}


/*
Handles client side verification of update password for the myAccount page.
*/
function validateDeleteAccount() {
    let username = $("#deleteUsername").val();
    let password = $("#deletePassword").val();
    let passwordConfirm = $("#deletePasswordConfirm").val();
    if (!validUsername(username)) {
        alert("Invalid username.");
        $("#deletePassword").val("");
        $("#deletePasswordConfirm").val("");
        $("#confirmDeleteCheckbox").prop("checked", false);
        return false;
    }
    else if (!validPassword(password)) {
        alert("Incorrect password.");
        $("#deletePassword").val("");
        $("#deletePasswordConfirm").val("");
        $("#confirmDeleteCheckbox").prop("checked", false);
        return false;
    }
    else if (password != passwordConfirm) {
        alert("Passwords do not match.");
        $("#deletePassword").val("");
        $("#deletePasswordConfirm").val("");
        $("#confirmDeleteCheckbox").prop("checked", false);
        return false;
    }
    else if (!$("#confirmDeleteCheckbox").prop("checked")) {
        alert("You must select the confirmation checkbox.");
        $("#deletePassword").val("");
        $("#deletePasswordConfirm").val("");
        return false;
    }
    else {
        return true;
    }
}



