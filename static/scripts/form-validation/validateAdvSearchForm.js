import { validateText, validateTextAndNumbers } from './validation.js';
import { highlightField } from '../render/renderTools.js';

export const validateAdvSearch = (isEmp, formID) => {

    const form = document.getElementById(formID);
    const messageElements = form.getElementsByTagName('p');
    const field = form.elements[0];
    const submitBtn = form.elements[1];
    const fieldMessage = messageElements[0].id;

    if (isEmp) {

        const fieldValid = validateText(field.value, field.attributes.minlength.value, field.attributes.maxlength.value, "Task Name", fieldMessage);
        highlightField(field, fieldValid);

        if (fieldValid.status === "success") {

            submitBtn.disabled = false;
        }
        else {

            submitBtn.disabled = true;
        }
    }
    else {

        const fieldValid = validateTextAndNumbers(field.value, field.attributes.minlength.value, field.attributes.maxlength.value, "Task Name", fieldMessage);
        highlightField(field, fieldValid);

        if (fieldValid.status === "success") {

            submitBtn.disabled = false;
        }
        else {

            submitBtn.disabled = true;
        }
    }
}