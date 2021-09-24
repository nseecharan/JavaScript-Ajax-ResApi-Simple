import { createButton, createSelect, createInput } from './renderInputs.js';

export function renderTaskForm(formTitle, formId, cancelBtnID, submintBtnName, elementIdentifier) {

    renderFormStructure(formTitle, formId, cancelBtnID, elementIdentifier);

    let form = document.getElementById(formId);

    let labelTask = document.createElement('label');
    let taskInput = createInput("", "", "text", "Task Name");
    let submitButton = createButton("submit-btn", "", submintBtnName, "submit");

    labelTask.innerHTML = "Task Name";

    form.append(labelTask, taskInput, submitButton);
}

export function renderEmployeeForm(formTitle, formId, cancelBtnID, submintBtnName, elementIdentifier) {

    renderFormStructure(formTitle, formId, cancelBtnID, elementIdentifier);

    let form = document.getElementById(formId);

    let labelFname = document.createElement('label');
    let labelLname = document.createElement('label');
    let labelEmail = document.createElement('label');
    let labelSex = document.createElement('label');
    let labelImage = document.createElement('label');
    let submitButton = createButton("submit-btn", "", submintBtnName, "submit");

    labelFname.innerHTML = "First Name";
    labelLname.innerHTML = "Last Name";
    labelEmail.innerHTML = "Email";
    labelSex.innerHTML = "Sex";
    labelImage.innerHTML = "Image"

    let fnameInput = createInput("", "", "text", "First Name");
    let lnameInput = createInput("", "", "text", "Last Name");
    let emailInput = createInput("", "", "text", "Email");
    let imageInput = createInput("", "", "file", "");

    let optionsArray = [
        { value: "", text: "Add Sex" },
        { value: "Male", text: "Male" },
        { value: "Female", text: "Female" },
    ]
    let sexSelect = createSelect("", "", optionsArray);

    form.append(
        labelFname, fnameInput, labelLname,
        lnameInput, labelEmail, emailInput,
        labelSex, sexSelect, labelImage,
        imageInput, submitButton);
}

function renderFormStructure(formTitle, formId, cancelBtnID, elementIdentifier) {

    let container = document.createElement('div');
    let customHeader = document.createElement('div');
    let title = document.createElement('span');
    let cancelButton = createButton(cancelBtnID, "btn-red float-right", "X", "button");
    let form = document.createElement('form');

    customHeader.className = "form-heading";
    title.innerHTML = formTitle;
    title.id = formId + "-title";

    customHeader.append(title, cancelButton);

    container.className = "option-border options";
    form.id = formId;
    form.className = "create-form";
    form.onsubmit = "event.preventDefault()";
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    })
    container.append(customHeader, form);

    document.getElementById(elementIdentifier).appendChild(container);
}