import { validateText, validateEmail } from './validation.js';
import { highlightField } from '../render/renderTools.js';

/*
0: input#img-upload
1: button.btn-sizing
2: input#fname-id
3: input#lname-id
4: input#email-id
5: select#sex-id
6: button#submit-btn.btn-sizing
7: button#delete-btn.btn-sizing.btn-red
*/

export const validateEmployeeForm = (formID, field) => {

    const form = document.getElementById(formID);
    const messageElements = form.getElementsByTagName('p');
    const fname = form.elements[2];
    const lname = form.elements[3];
    const email = form.elements[4];
    const sex = form.elements[5];
    const fnameMessage = messageElements[0].id;
    const lnameMessage = messageElements[1].id;
    const emailMessage = messageElements[2].id;
    const sexMessage = messageElements[3].id;
    const fnameValid = validateText(fname.value, fname.attributes.minlength.value, fname.attributes.maxlength.value, "First Name", fnameMessage);
    const lnameValid = validateText(lname.value, lname.attributes.minlength.value, lname.attributes.maxlength.value, "Last Name", lnameMessage);
    const emailValid = validateEmail(email.value, email.attributes.minlength.value, email.attributes.maxlength.value, "Email", emailMessage);
    const sexValid = {
        message: (!sex.value) ? "A sex must be selected" : "",
        status: (!sex.value) ? "error" : "success",
        elementId: sexMessage
    }

    if (fnameValid.status === "success" && lnameValid.status === "success" &&
        emailValid.status === "success" && sexValid.status === "success") {

        form.elements[6].disabled = false;
    }
    else {

        form.elements[6].disabled = true;
    }

    switch (field) {

        case 2:
            highlightField(fname, fnameValid);
            break;
        case 3:
            highlightField(lname, lnameValid);
            break;
        case 4:
            highlightField(email, emailValid);
            break;
        case 5:
            highlightField(sex, sexValid);
            break;
        default:
            return;
    }
}