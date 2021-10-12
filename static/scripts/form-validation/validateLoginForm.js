import { validatePassword, validateUsername } from './validation.js';
import { highlightField } from '../render/renderTools.js';

export const validateLoginForm = (form, isUsername, messageID) => {

    const userName = form.elements[0];
    const password = form.elements[1];
    const unameValid = validateUsername(
        userName.value,
        userName.attributes.minlength.value,
        userName.attributes.maxlength.value,
        "User Name",
        messageID);
    const passValid = validatePassword(
        password.value,
        password.attributes.minlength.value,
        password.attributes.maxlength.value,
        "Password",
        messageID);

    if (unameValid.status == "success" && passValid.status == "success") {

        form["loginButton"].disabled = false;
    }
    else {

        form["loginButton"].disabled = true;
    }

    if (isUsername) {

        highlightField(userName, unameValid);
    }
    else {

        highlightField(password, passValid);
    }
}