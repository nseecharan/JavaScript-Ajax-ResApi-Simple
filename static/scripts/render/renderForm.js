import { confirmDeleteEmp, confirmDeleteTask } from '../menuEvents.js';
import { createButton, createSelect, createInput, createField } from './renderInputs.js';
import { advancedSearch, createEmployee, createTask, updateEmployee, updateTask } from '../routes.js';
import { validateAdvSearch } from '../form-validation/validateAdvSearchForm.js';
import { validateEmployeeForm } from '../form-validation/validateEmployeeForm.js';
import { validateTaskForm } from '../form-validation/validateTaskForm.js';
import { clearElement } from '../render/renderTools.js';
import * as s from '../elementAttributes.js';//import styles or 's'

const taskInput = createInput("task-id", "", "text", "Task Name", 2, 128, "enter task name", "taskNameField", s.textInputTitle, true);
const fnameInput = createInput("fname-id", "", "text", "First Name", 2, 64, "enter employee's first name", "firstNameField", s.textInputTitle, true);
const lnameInput = createInput("lname-id", "", "text", "Last Name", 2, 64, "enter employee's last name", "lastNameField", s.textInputTitle, true);
const emailInput = createInput("email-id", "", "text", "Email", 8, 128, "enter employee's email", "emailField", s.emailInputTitle);
const imageInput = createInput("img-upload", "", "file", "");
const imageUploadBtn = createButton("", s.buttonClass, "Upload Image", "button", "add an optional employee image", "imageUploadBtn");

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

//Create fields that include the inputs above, with a label, and status message element.
const taskField = createField("Task Name", taskInput, s.taskMsgID, s.noDisplayClass);
const fnameField = createField("First Name", fnameInput, s.fnameMsgID, s.noDisplayClass);
const lnameField = createField("Last Name", lnameInput, s.lnameMsgID, s.noDisplayClass);
const emailField = createField("Email", emailInput, s.emailMsgID, s.noDisplayClass);
const sexField = createField("Sex", sexSelect, s.sexMsgID, s.noDisplayClass);

//Inputs used for the advanced search feature.
//Seperate validation methods will be attached ot these.
const searchTaskInput = createInput("adv-search-task-id", "", "text", "Task Name", 2, 128, "Enter a task name.", "Task name advanced search field.", s.textInputTitle, false);
const searchNameInput = createInput("adv-search-fname-id", "", "text", "Employee Name", 2, 128, "Enter an employee name.", "Employee name advanced search field.", s.textInputTitle, false);
const searchTaskField = createField("Task Name", searchTaskInput, s.taskMsgID, s.noDisplayClass);
const searchNameField = createField("First Name", searchNameInput, s.fnameMsgID, s.noDisplayClass);


['keyup', 'blur', 'focus'].forEach((action) => {

    fnameInput.addEventListener(action, () => {

        validateEmployeeForm(s.empFormID, 2);
    });

    lnameInput.addEventListener(action, () => {

        validateEmployeeForm(s.empFormID, 3);
    });

    emailInput.addEventListener(action, () => {

        validateEmployeeForm(s.empFormID, 4);
    });

    taskInput.addEventListener(action, () => {

        validateTaskForm(s.taskFormID);
    })
    searchTaskInput.addEventListener(action, () => {

        validateAdvSearch(false, "adv-search");
    });
    searchNameInput.addEventListener(action, () => {

        validateAdvSearch(true, "adv-search");
    });

})

sexSelect.addEventListener('change', () => {

    validateEmployeeForm(s.empFormID, 5);
})

imageUploadBtn.addEventListener("click", () => {

    document.getElementById("img-upload").click();
});


/***************************************************************
                         FORM METHODS                          
***************************************************************/

//This function will allow you to change an already generated form to either the update, or
//create configuration. The first two arguments work just like the "createForm," function,
//but all the other arguments are used to locate the title, and button elements, so that 
//their attributes can be changed.
export const changeForm = (isEmpForm, isUpdate, titleID, titleChange, formID, btnName, updateDataID = "") => {

    const title = document.getElementById(titleID);

    if (title.textContent !== titleChange) {

        title.textContent = titleChange;
        const newButton = createButton(s.submitBtnID, s.buttonClass, btnName, "submit");
        const form = document.getElementById(formID);
        const dangerZone = document.querySelector('.' + formID + s.dangerZoneClass);

        setSubmitType(isEmpForm, isUpdate, newButton, formID, updateDataID);

        if (dangerZone) {

            dangerZone.remove();
        }

        const last = form.elements.length - 1;
        const oldButton = form.elements[last];

        oldButton.replaceWith(newButton);
    }
}

//This function loads object data into a form that has been set to the update configuration,
//and also adds a delete button exclusive to the form.
export const preloadFormData = (formID, data) => {

    const form = document.getElementById(formID);
    const inputs = form.getElementsByTagName('input');
    const image = form.getElementsByTagName('img')[0];
    const deleteBtn = createButton(s.deleteBtnID, s.deleteBtnClass, "Delete", "button");

    const dangerZone = document.createElement('div');
    dangerZone.className = formID + s.dangerZoneClass;
    const warning = document.createElement('span');
    warning.textContent = "Danger Zone";

    if (data.first_name) {

        inputs[1].value = data.first_name;
        inputs[2].value = data.last_name;
        inputs[3].value = data.email;

        const select = form.getElementsByTagName('select');
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
    if (form.lastChild.className !== formID + s.dangerZoneClass) {

        form.append(dangerZone);
    }
    else {
        form.replaceChild(dangerZone, form.lastChild)
    }
}

/***************************************************************
                    FORM CONFIGURATIONS                          
***************************************************************/

//Data entry form configuration.
export const createDataEntryForm = (isEmpForm, formTitle, formID, cancelBtnID, submintBtnName, elementIdentifier, isUpdate = false, updateDataID = "") => {

    renderFormStructure(formTitle, formID, cancelBtnID, elementIdentifier);

    const form = document.getElementById(formID);
    const submitButton = createButton(s.submitBtnID, s.buttonClass, submintBtnName, "submit", submintBtnName + " button");
    setSubmitType(isEmpForm, isUpdate, submitButton, formID, updateDataID);

    if (isEmpForm) {

        const infoDiv = document.createElement('div');
        infoDiv.className = s.formInfoAreaClass;
        infoDiv.append(fnameField, lnameField, emailField, sexField, submitButton);
        const imageDiv = renderImageUpload();
        form.append(imageDiv, infoDiv);
    }
    else {

        form.append(taskField, submitButton);
    }

    form.reset();
}

//Advanced Search configuration.
export const createAdvancedSearchForm = (isEmpForm, formTitle, formID, cancelBtnID, submintBtnName, elementIdentifier) => {

    renderFormStructure(formTitle, formID, cancelBtnID, elementIdentifier);

    const form = document.getElementById(formID);
    const submitButton = createButton(s.submitBtnID, s.buttonClass, submintBtnName, "submit", submintBtnName + " button");

    submitButton.addEventListener('click', () => {

        advancedSearch(isEmpForm, formID);
    })

    if (isEmpForm) {

        form.append(searchNameField, submitButton);
    }
    else {

        form.append(searchTaskField, submitButton);
    }

    form.reset();
}

/***************************************************************
                        FORM HELPERS                          
***************************************************************/

//Generates the basic form elements that are shared between task and employee forms.
const renderFormStructure = (formTitle, formID, cancelBtnID, elementIdentifier) => {

    const overlay = document.createElement('div');
    const container = document.createElement('div');
    const customHeader = document.createElement('div');
    const title = document.createElement('span');
    const cancelButton = createButton(cancelBtnID, s.cancelBtnClass, "X", "button", "cancel button");
    const form = document.createElement('form');

    cancelButton.addEventListener('click', () => {

        clearElement("#" + s.modal_containerID);
    })

    overlay.className = s.modal_overlayClass;
    container.className = s.modal_containerClass;
    customHeader.className = s.modal_headingClass;
    title.textContent = formTitle;
    title.id = formID + "-title";
    customHeader.append(title, cancelButton);
    form.id = formID;
    form.className = s.formClass;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    })
    container.append(customHeader, form);
    overlay.append(container);
    document.getElementById(elementIdentifier).appendChild(overlay);
}

//Creates the image preview, and uplaod section for for the employee form.
const renderImageUpload = () => {

    const labelImage = document.createElement('label');
    const image = document.createElement('img');
    const previewArea = document.createElement('div');
    labelImage.textContent = "Image";

    previewArea.className = s.imagePreviewClass;
    image.width = "200";
    image.src = "";
    image.ariaLabel = "current emloyee image";

    imageInput.addEventListener("change", () => {

        const file = imageInput.files[0];
        image.src = URL.createObjectURL(file);
    })

    imageInput.style.display = "none";
    previewArea.appendChild(image);

    const imageDiv = document.createElement('div');
    imageDiv.className = s.imageAreaClass;
    imageDiv.append(labelImage, previewArea, imageInput, imageUploadBtn);

    return imageDiv;
}

//This function manages the what what the submit button will do depending on the 
//configuration of the form.
const setSubmitType = (isEmpForm, isUpdate, button, formID, updateDataID = "") => {

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