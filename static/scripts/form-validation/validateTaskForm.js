import { validateTextAndNumbers } from './validation.js';
import { highlightField } from '../render/renderTools.js';

export function validateTaskForm(formID) {

    const form = document.getElementById(formID);
    const messageElements = form.getElementsByTagName('p');
    const taskName = form.elements[0];
    const taskNameMessage = messageElements[0].id;
    const taskNameValid = validateTextAndNumbers(
        taskName.value,
        taskName.attributes.minlength.value,
        taskName.attributes.maxlength.value,
        "Task Name",
        taskNameMessage);

    if (taskNameValid.status === "success") {

        form.elements[1].disabled = false;
    }
    else {

        form.elements[1].disabled = true;
    }

    highlightField(taskName, taskNameValid);
}