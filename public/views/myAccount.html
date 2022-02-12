<?php
    $root = dirname(__FILE__);
    require_once($root . DIRECTORY_SEPARATOR .  "../database_interface/db.php");
    require_once($root . DIRECTORY_SEPARATOR .  "../router/redirect.php");
    require_once($root . DIRECTORY_SEPARATOR .  "Renderer.php");
    
    session_start();
    $conn;
    //Connect to DB if not already connected
    if (!isset($_SERVER["connection"])) {
        $conn = connect();
    }
    
    $_SESSION["email"] = getUserEmail($conn, $_SESSION["username"])->fetch_assoc()["email"];
    $username = $_SESSION["username"];

    //Email change form submitted
    if (isset($_POST["updateEmailSubmit"])) {
        error_log("update email form submitted\n", 3, $root . DIRECTORY_SEPARATOR . "error_log.txt");
        $newEmail = $_POST["emailInput"];
        $password = $_POST["updateEmailPasswordInput"];
        
        //if correct password then update email address
        if (isPassword($conn, $username, $password)) {
            $_SESSION["credentialsError"] = "";
            updateUserEmail($conn, $newEmail, $_SESSION["username"]);
            $_SESSION["email"] = $newEmail;
        }
        else {
            $_SESSION["credentialsError"] = "passError";
        }
    }//Password change form submitted
    else if (isset($_POST["updatePasswordSubmit"])) {
        $currPass = $_POST["updatePasswordPasswordInput"];
        $newPass = $_POST["newPassword"];
        $newPassConfirm = $_POST["newPasswordConfirm"];
        if (!empty($currPass) && !empty($newPass) && !empty($newPassConfirm)) {
            if (isPassword($conn, $username, $currPass)) {
                if ($newPass === $newPassConfirm) {
                    updateUserPassword($conn, $username, $currPass, $newPass);
                    $_SESSION["credentialsError"] = "";
                }
                else {
                    $_SESSION["credentialsError"] = "passConfirmError";
                }
            }
            else {
                $_SESSION["credentialsError"] = "passError";
            }
        }
        else {
            $_SESSION["credentialsError"] = "";
        }
        
    }//Delete account form submitted
    else if (isset($_POST["deleteAccountSubmit"])) {
        $inputUsername = $_POST["deleteUsername"];
        $dPassword = $_POST["deletePassword"];
        $passwordConfirm = $_POST["deletePasswordConfirm"];
        $confirmChecked = $_POST["confirmDeleteCheckbox"];
        if ($inputUsername === $username) {
            if ($confirmChecked) {
                if ($dPassword === $passwordConfirm) {
                    if (isPassword($conn, $username, $dPassword)) {
                        $_SESSION["credentialsError"] = "";
                        if (!deleteUser($conn, $username, $dPassword)) {
                            error_log("Error:  \n" . $conn->error, 3, $root . DIRECTORY_SEPARATOR . "error_log.txt");
                        }
                        else {
                            error_log("Successfully deleted user. $username\n", 3, $root . DIRECTORY_SEPARATOR . "error_log.txt");
                            session_destroy();
                            redirect("index.php");
                            exit;
                        }
                    }
                    else {
                        $_SESSION["credentialsError"] = "passError";
                    }
                } 
                else {
                    $_SESSION["credentialsError"] = "passConfirmError";
                }
            }
            else {
                $_SESSION["credentialsError"] = "confirmNotChecked";
            }
        }
        else {
            $_SESSION["credentialsError"] = "userError";
        }
    }
    else {
        $_SESSION["credentialsError"] = "";
    }
?>
<!DOCTYPE html>
<head>
    <title>My Account</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <!-- jQuery library -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <!-- Latest compiled JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <!-- client side form validation for the myAccount page-->
    <script type="text/javascript" src="../../scripts/myAccount.js"></script>
     <!-- Custom styling -->
    <link rel="stylesheet" href="../../styles/common.css">
    <!-- Custom styling -->
    <link rel="stylesheet" href="../../styles/myAccount.css">
    
    
</head>
<html lang="en">
    <body style="background-color: #222;">
        
        <div id="profileContainer" class="fluid-container">
            <div class="well well-sm" style="background-color: #333; color: white; border: none;">
                <div class="row" id="profileRowDiv">
                    <img class="img-fluid" alt="The user's profile image" src="../../imgs/user.png">
                    <a href="main.php" id="backBtn" class="btn btn-primary" value="Back to My Chats">Back to My Chats</a>
                    <a href="logout.php" id = "logoutButton" name = "logout" class = "btn btn-primary" type="submit">Log out</a>
                    <div>
                        <?php echo $_SESSION['username'] . " <br> " . $_SESSION['email']; ?>
                    </div>
                    <div>
                </div>
            </div>
        </div>
        <form onsubmit="return validateChangeEmail()" action='<?php echo $_SERVER['PHP_SELF']; ?>' method="post" id="changeEmailForm" name="changeEmailForm" class="change-form col-md-4 col-md-offset-4">
            <div class="well well-lg" style="background-color: #333; color: white; border: none;">
                <div class="form-group">
                    <?php if (isset($_POST["updateEmailSubmit"])) { Renderer::myAccountErrorHandler($_SESSION["credentialsError"]); } ?>
                    <label for="updateEmailEmailInput">Update Email address</label>
                    <input type="email" class="form-control" id="updateEmailEmailInput" name="emailInput" aria-describedby="emailHelp" placeholder="Enter new email">
                    <label for="updateEmailPasswordInput">Password</label>
                    <input type="password" class="form-control" id="updateEmailPasswordInput" name="updateEmailPasswordInput" placeholder="Password">
                    <button type="submit" id="updateEmailButtton" name="updateEmailSubmit" class="btn btn-primary">Update Email</button>
                </div>
            </div>
        </form>
        <form onsubmit="return validateUpdatePassword()" action='<?php echo($_SERVER['PHP_SELF']);?>' method="post" id="changePasswordForm" name="changePasswordForm" class="change-form col-md-4 col-md-offset-4">
            <div class="well well-lg" style="background-color: #333; color: white; border: none;">
                <div class="form-group">
                    <?php if (isset($_POST["updatePasswordSubmit"])) { Renderer::myAccountErrorHandler($_SESSION["credentialsError"]); } ?>
                    <label for="updatePasswordPasswordInput">Update Password</label>
                    <input type="password" class="form-control" id="updatePasswordPasswordInput" name="updatePasswordPasswordInput" placeholder="Enter old password">
                </div>
                <div class="form-group">
                    <label for="newPassword newPasswordConfirm">Password</label>
                    <input type="password" class="form-control" id="newPassword" name="newPassword" placeholder="New password">
                    <input type="password" class="form-control" id="newPasswordConfirm" name="newPasswordConfirm" placeholder="Confirm new password">
                    <button id="updatePasswordBtn" name="updatePasswordSubmit" type="submit" class="btn btn-primary">Update Password</button>
                </div>
            </div>
        </form>
        <form onsubmit="return validateDeleteAccount()" action='<?php echo($_SERVER['PHP_SELF']);?>' method="post" id="deleteAccountForm" name="deleteAccountForm" class="change-form col-md-4 col-md-offset-4">
            <div class="well" style="background-color: #333; color: white; border: none;">
                <div class="form-group">
                    <strong>Delete My Account</strong>
                    <?php if (isset($_POST["deleteAccountSubmit"])) { Renderer::myAccountErrorHandler($_SESSION["credentialsError"]); } ?>
                    <input type="username" class="form-control" id="deleteUsername" name="deleteUsername" placeholder="Username">
                    <input type="password" class="form-control" id="deletePassword" name="deletePassword" placeholder="Password">
                    <input type="password" class="form-control" id="deletePasswordConfirm" name="deletePasswordConfirm" placeholder="Confirm Password">
                    <label>Confirm Deletion <input type="checkbox" id="confirmDeleteCheckbox" name="confirmDeleteCheckbox"></label><br>
                    <button id="deleteAccountBtn" name="deleteAccountSubmit" type="submit" class="btn btn-primary" role="button">Delete Account</button>
                </div>
            </div>
        </form>
    </body>
</html>
</html>
