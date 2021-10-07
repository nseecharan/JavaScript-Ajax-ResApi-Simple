import { confirmDeleteEmp, confirmDeleteTask } from '../menuEvents.js';
import { createButton, createSelect, createInput, createField } from './renderInputs.js';
import { createEmployee, createTask, updateEmployee, updateTask } from '../dataManager.js';
import { validateEmployeeForm } from '../form-validation/validateEmployeeForm.js';
import { validateTaskForm } from '../form-validation/validateTaskForm.js';

const taskFormID = "task-form";
const empFormID = "emp-form";
const buttonClass = "btn-sizing";
const deleteBtnClass = buttonClass + " btn-red";
const cancelBtnClass = "btn-red float-right";
const taskCancelBtnID = "task-cancel-btn";
const empCancelBtnID = "emp-cancel-btn";
const deleteBtnID = "delete-btn";
const dangerZoneClass = "-danger-zone";//this class is used in conbination with the element ID that is passed by the functions
const submitBtnID = "submit-btn";
const formContainerClass = "option-border options";//class for the div container that the form resids in
const formHeading = "form-heading";
const formClass = "option-form";
const formInfoAreaClass = "form-info-div";
const imageAreaClass = "form-image-div";
const imagePreviewClass = "form-image-preview";
const textInputTitle = "2 to 64 characters, must begin with a letter, and may also contain single quotes, as well as spaces";
const emailInputTitle = "8 to 128 characters, and must begin with a letter, and may also contain numbers, as well as periods";

const taskInput = createInput("task-id", "", "text", "Task Name", 2, 128, "enter task name", "taskNameField", textInputTitle, true);
const fnameInput = createInput("fname-id", "", "text", "First Name", 2, 64, "enter employee's first name", "firstNameField", textInputTitle, true);
const lnameInput = createInput("lname-id", "", "text", "Last Name", 2, 64, "enter employee's last name", "lastNameField", textInputTitle, true);
const emailInput = createInput("email-id", "", "text", "Email", 8, 128, "enter employee's email", "emailField", emailInputTitle);
const imageInput = createInput("img-upload", "", "file", "");
const imageUploadBtn = createButton("", buttonClass, "Upload Image", "button", "add an optional employee image", "imageUploadBtn");

const optionsArray = [
    { value: "", text: "No Selection" },
    { value: "Male", text: "Male" },
    { value: "Female", text: "Female" },
]

const sexSelect = createSelect("sex-id", "", optionsArray, "select employee's sex");

fnameInput.required = true;
lnameInput.required = true;
emailInput.required = true;
sexSelect.required = true;

//id names for the form error/success message elements for each field
const taskMsg = "task-message";
const fnameMsg = "fname-message";
const lnameMsg = "lname-message";
const emailMsg = "email-message";
const sexMsg = "sex-message";
const msgClass = "no-display";

//create fields that include the inputs above, with a label, and status message element
const taskField = createField("Task Name", taskInput, taskMsg, msgClass)
const fnameField = createField("First Name", fnameInput, fnameMsg, msgClass);
const lnameField = createField("Last Name", lnameInput, lnameMsg, msgClass);
const emailField = createField("Email", emailInput, emailMsg, msgClass);
const sexField = createField("Sex", sexSelect, sexMsg, msgClass);


['keyup', 'blur', 'focus'].forEach((action) => {

    fnameInput.addEventListener(action, () => {

        validateEmployeeForm(empFormID, 2);
    });

    lnameInput.addEventListener(action, () => {

        validateEmployeeForm(empFormID, 3);
    });

    emailInput.addEventListener(action, () => {

        validateEmployeeForm(empFormID, 4);
    });

    taskInput.addEventListener(action, () => {

        validateTaskForm(taskFormID);
    })
})

sexSelect.addEventListener('change', () => {

    validateEmployeeForm(empFormID, 5);
})

//This function manages which form to generate between tasks and employees, and allows
//you to indicate if the generated form should be configured to update or create data.
//The first argument dictates if the form sould be for tasks or employees, and the 
//second argument dictates if the configuration should be set to update or create.
export function createForm(isEmpForm, isUpdate, title, formID, btnName, parentID, updateDataID = "") {

    if (isEmpForm) {

        renderEmployeeForm(title, formID, empCancelBtnID, btnName, parentID);
    }
    else {

        renderTaskForm(title, formID, taskCancelBtnID, btnName, parentID);
    }

    let form = document.getElementById(formID);
    let last = form.elements.length - 1;
    let button = form.elements[last];

    setSubmitType(isEmpForm, isUpdate, button, formID, updateDataID);
}

//This function will allow you to change an already generated form to either the update, or
//create configuration. The first two arguments work just like the "createForm," function,
//but all the other arguments are used to locate the title, and button elements, so that 
//their attributes can be changed.
export function changeForm(isEmpForm, isUpdate, titleID, titleChange, formID, btnName, updateDataID = "") {

    let title = document.getElementById(titleID);

    if (title.textContent !== titleChange) {

        title.textContent = titleChange;
        let newButton = createButton(submitBtnID, buttonClass, btnName, "submit");
        newButton.disabled = true;
        let form = document.getElementById(formID);
        let dangerZone = document.querySelector('.' + formID + dangerZoneClass);

        setSubmitType(isEmpForm, isUpdate, newButton, formID, updateDataID);

        if (dangerZone) {

            dangerZone.remove();
        }

        let last = form.elements.length - 1;
        let oldButton = form.elements[last];

        oldButton.replaceWith(newButton);
    }
}

//This function loads object data into a form that has been set to the update configuration,
//and also adds a delete button exclusive to the form.
export function preloadFormData(formID, data) {

    let form = document.getElementById(formID);
    let inputs = form.getElementsByTagName('input');
    let image = form.getElementsByTagName('img')[0];
    let deleteBtn = createButton(deleteBtnID, deleteBtnClass, "Delete", "button");

    let dangerZone = document.createElement('div');
    dangerZone.className = formID + dangerZoneClass;
    let warning = document.createElement('span');
    warning.textContent = "Danger Zone";

    if (data.first_name) {

        inputs[1].value = data.first_name;
        inputs[2].value = data.last_name;
        inputs[3].value = data.email;

        let select = form.getElementsByTagName('select');
        select[0].value = data.sex;
        image.src = data.image;

        deleteBtn.ariaLabel = "delete employee button";

        deleteBtn.addEventListener('click', () => {

            confirmDeleteEmp(data);
        })
    }
    else {

        inputs[0].value = data.task;

        deleteBtn.ariaLabel = "delete task button";

        deleteBtn.addEventListener('click', () => {

            confirmDeleteTask(data);
        })
    }

    dangerZone.append(warning, deleteBtn);

    //append delete button if it does not exist
    //else relpace the button with a new one that has the updated function
    if (form.lastChild.className !== formID + dangerZoneClass) {

        form.append(dangerZone);
    }
    else {
        form.replaceChild(dangerZone, form.lastChild)
    }
}

//This function manages the what what the submit button will do depending on the 
//configuration of the form.
function setSubmitType(isEmpForm, isUpdate, button, formID, updateDataID = "") {

    if (isEmpForm) {

        if (isUpdate) {

            button.addEventListener('click', () => {

                updateEmployee(updateDataID, formID);
            })
        }
        else {

            button.addEventListener('click', () => {

                createEmployee(formID);
            })
        }
    }
    else {

        if (isUpdate) {

            button.addEventListener('click', () => {

                updateTask(updateDataID, formID);
            })
        }
        else {

            button.addEventListener('click', () => {

                createTask(formID);
            })
        }
    }
}

//Generates the form for a task.
function renderTaskForm(formTitle, formId, cancelBtnID, submintBtnName, elementIdentifier) {

    renderFormStructure(formTitle, formId, cancelBtnID, elementIdentifier);

    let form = document.getElementById(formId);
    let submitButton = createButton(submitBtnID, buttonClass, submintBtnName, "submit", submintBtnName + " button");
    submitButton.disabled = true;

    form.append(taskField, submitButton);
    form.reset();
}

//Generates the form for an employee.
function renderEmployeeForm(formTitle, formId, cancelBtnID, submintBtnName, elementIdentifier) {

    renderFormStructure(formTitle, formId, cancelBtnID, elementIdentifier);

    let form = document.getElementById(formId);
    let submitButton = createButton(submitBtnID, buttonClass, submintBtnName, "submit", submintBtnName + " button");
    submitButton.disabled = true;
    let imageDiv = renderImageUpload();
    let infoDiv = document.createElement('div');
    infoDiv.className = formInfoAreaClass;
    infoDiv.append(fnameField, lnameField, emailField, sexField, submitButton);

    form.append(imageDiv, infoDiv);
    form.reset();
}

//Creates the image preview, and uplaod section for for the employee form.
function renderImageUpload() {

    let labelImage = document.createElement('label');
    let image = document.createElement('img');
    let previewArea = document.createElement('div');
    labelImage.textContent = "Image";

    imageUploadBtn.addEventListener("click", () => {

        document.getElementById("img-upload").click();
    })

    previewArea.className = imagePreviewClass;
    image.width = "200";
    image.src = "";
    image.ariaLabel = "current emloyee image";

    imageInput.addEventListener("change", () => {

        let file = imageInput.files[0];
        image.src = URL.createObjectURL(file);
    })

    imageInput.style.display = "none";
    previewArea.appendChild(image);

    let imageDiv = document.createElement('div');
    imageDiv.className = imageAreaClass;
    imageDiv.append(labelImage, previewArea, imageInput, imageUploadBtn);

    return imageDiv;
}

//Generates the basic form elements that are shared between task and employee forms.
function renderFormStructure(formTitle, formId, cancelBtnID, elementIdentifier) {

    let container = document.createElement('div');
    let customHeader = document.createElement('div');
    let title = document.createElement('span');
    let cancelButton = createButton(cancelBtnID, cancelBtnClass, "X", "button", "cancel button");
    let form = document.createElement('form');

    customHeader.className = formHeading;
    title.textContent = formTitle;
    title.id = formId + "-title";

    customHeader.append(title, cancelButton);

    container.className = formContainerClass;
    form.id = formId;
    form.className = formClass;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    })
    container.append(customHeader, form);

    document.getElementById(elementIdentifier).appendChild(container);
}