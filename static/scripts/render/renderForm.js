import { createButton, createSelect, createInput } from './renderInputs.js';
import { readImage } from './renderTools.js';

export function preloadFormData(formID, data) {

    //TODO: In the future this function will instead received the formID, and entry ID.
    //The purpose of this that the entry ID will be from a less data heavy list
    //and so, it will be used to look up the full data from the data heavy list.

    //Consider making the light list only contain the full name, email, and
    //a smaller version of the user image. This will require research if there is no
    //open source moduel.

    let form = document.getElementById(formID);
    let inputs = form.getElementsByTagName('input');
    let image = form.getElementsByTagName('img')[0];

    if (data.first_name) {

        inputs[0].value = data.first_name;
        inputs[1].value = data.last_name;
        inputs[2].value = data.email;

        let select = form.getElementsByTagName('select');
        select[0].value = data.sex;
        image.src = data.image;
    }
    else {

        inputs[0].value = data.task;
    }
}

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
    let image = document.createElement('img');
    let previewArea = document.createElement('div');

    previewArea.className = "form-image-preview";
    image.width = "200";
    image.src = "";
    imageInput.addEventListener("change", () => {

        let file = imageInput.files[0];
        image.src = URL.createObjectURL(file);
    })

    previewArea.appendChild(image);

    form.append(
        labelFname, fnameInput, labelLname,
        lnameInput, labelEmail, emailInput,
        labelSex, sexSelect, labelImage,
        previewArea, imageInput, submitButton);
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
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    })
    container.append(customHeader, form);

    document.getElementById(elementIdentifier).appendChild(container);
}