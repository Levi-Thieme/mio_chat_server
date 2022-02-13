import { isRegistrationValid, signup, Registration } from "./registrationService.js";

    $(document).ready(function() {
        $('#signup').on('submit', async (e) => {
            e.preventDefault();
            const registration = getRegistrationInfo();
            try {
                const registrationValidationResult = isRegistrationValid(registration);
                if (registrationValidationResult.success) {
                    const response = await signup(e);
                    if (response.redirected) {
                        window.location = response.url;
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