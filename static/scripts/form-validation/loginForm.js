import { login } from "../dataManager.js";
import { validatePassword, validateUsername } from './validation.js';
import { renderMessage } from '../render/renderTools.js';

export function resetLoginForm(disable) {

    const form = document.forms["loginForm"];
    form.reset();

    if (disable) {

        for (let i = 0; i < form.elements.length; i++) {

            form.elements[i].disabled = disable;
        }
    }
}

export function validateLoginForm(isUsername, messageID) {

    const form = document.forms["loginForm"];
    const userName = form.elements[0];
    const password = form.elements[1];

    const unameValid = validateUsername(userName.value, userName.attributes.minlength.value, userName.attributes.maxlength.value, "User Name", messageID);
    const passValid = validatePassword(password.value, password.attributes.minlength.value, password.attributes.maxlength.value, "Password", messageID);

    if (unameValid.status == "success" && passValid.status == "success") {

        form["loginButton"].disabled = false;
    }
    else {

        form["loginButton"].disabled = true;
    }

    renderMessage("", messageID, "no-display", "error-background");

    if (isUsername) {

        userName.style.border = "none";

        if (unameValid.status === "error") {

            renderMessage(unameValid.message, messageID, "no-display", "error-background");

            if (userName.value !== "") {

                userName.style.border = "2px solid red";
                userName.style.outline = "none";
            }
        }
    }
    else {

        password.style.border = "none";

        if (passValid.status === "error") {

            renderMessage(passValid.message, messageID, "no-display", "error-background");

            if (password.value !== "") {

                password.style.border = "2px solid red";
                password.style.outline = "none";
            }
        }
    }
}