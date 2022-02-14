import { isRegistrationValid, signup, Registration } from "./registrationService.js";

    $(document).ready(function() {
        $('#signup').on('submit', async (e) => {
            e.preventDefault();
            const registration = getRegistrationInfo();
            try {
                const registrationValidationResult = isRegistrationValid(registration);
                if (registrationValidationResult.success) {
                    const response = await signup(registration);
                    if (response.success) {
                        window.location.href = "/login";
                    }
                    else if (response.invalidCredentials) {
                        throw new Error("A user already exists with that username");
                    }
                    else if (response.serverError) {
                        throw new Error("An error occurred. Please try again.");
                    }
                }
                else {
                    throw Error(registrationValidationResult.error)
                }
            }
            catch (e) {
                displayError(e);
            }
        });
    });

    /**
     * 
     * @returns {Registration}
     */
    function getRegistrationInfo() {
        return new Registration(
            $("#username").val(),
            $("#email").val(),
            $("#password").val(),
            $("#password").val()
        );
    }

    function displayError(errorMessage) {
        $("#password").val("");
        $("#confirmPassword").val("");
        $("#errorMessage").text(errorMessage);
    }