import { confirmDeleteEmp, confirmDeleteTask } from '../menuEvents.js';
import { createButton, createSelect, createInput, createField } from './renderInputs.js';
import { advancedSearch, createEmployee, createTask, updateEmployee, updateTask } from '../routes.js';
import { validateAdvSearch } from '../form-validation/validateAdvSearchForm.js';
import { validateEmployeeForm } from '../form-validation/validateEmployeeForm.js';
import { validateTaskForm } from '../form-validation/validateTaskForm.js';
import { clearElement, clearMessages, unhighlightField } from '../render/renderTools.js';
import * as attr from '../elementAttributes.js';

const taskName = "Task Name";
const fname = "First Name";
const lname = "Last Name";
const email = "Email";
const sex = "Sex";
const empName = "Employee Name";
const fClass_content = "form-content";
const fClass_InfoArea = "form-info-div";
const fClass_imageArea = "form-image-div";
const fClass_imagePreview = "form-image-preview";
const inputID_task = "task-id";
const inputID_fname = "fname-id";
const inputID_lname = "lname-id";
const inputID_email = "email-id";
const inputID_image = "img-upload";
const inputID_sex = "sex-id";
const btnID_delete = "delete-btn";
const btnID_submit = "submit-btn";
const msgID_task = "task-message";
const msgID_fname = "fname-message";
const msgID_empName = "empName-message";
const msgID_lname = "lname-message";
const msgID_email = "email-message";
const msgID_sex = "sex-message";
const aria_taskInput = "Enter the task name.";
const aria_searchEmpInput = "Enter the employee name."
const aria_fnameInput = "Enter the employee's first name.";
const aria_lnameInput = "Enter the employee's last name.";
const aria_emailInput = "Enter the employee's email.";
const aria_imageUploadBtn = "add an optional employee image";
const title_emailInput = "8 to 128 characters, and must begin with a letter, and may also contain numbers, as well as periods.";

const taskInput = createInput(inputID_task, "", "text", taskName, 2, 128, aria_taskInput, "taskNameField", attr.title_textNumInput_2_128, true);
const fnameInput = createInput(inputID_fname, "", "text", fname, 2, 64, aria_fnameInput, "firstNameField", attr.title_textInput_2_64, true);
const lnameInput = createInput(inputID_lname, "", "text", lname, 2, 64, aria_lnameInput, "lastNameField", attr.title_textInput_2_64, true);
const emailInput = createInput(inputID_email, "", "text", email, 8, 128, aria_emailInput, "emailField", title_emailInput);
const imageInput = createInput(inputID_image, "", "file", "");
const imageUploadBtn = createButton("", attr.buttonClass, "Upload Image", "button", aria_imageUploadBtn, "imageUploadBtn");

const optionsArray = [
    { value: "", text: "No Selection" },
    { value: "Male", text: "Male" },
    { value: "Female", text: "Female" },
]

const sexSelect = createSelect(inputID_sex, "", optionsArray, "select employee's sex");

fnameInput.required = true;
lnameInput.required = true;
emailInput.required = true;
sexSelect.required = true;

//Create fields that include the inputs above, with a label, and status message element.
const taskField = createField(taskName, taskInput, msgID_task, attr.utlClass_noDisplay);
const fnameField = createField(fname, fnameInput, msgID_fname, attr.utlClass_noDisplay);
const lnameField = createField(lname, lnameInput, msgID_lname, attr.utlClass_noDisplay);
const emailField = createField(email, emailInput, msgID_email, attr.utlClass_noDisplay);
const sexField = createField(sex, sexSelect, msgID_sex, attr.utlClass_noDisplay);

//Inputs used for the advanced search feature.
//Seperate validation methods will be attached ot these.
const searchTaskInput = createInput(attr.fID_advSearchForm + "-task-id", "", "text", taskName, 2, 128, aria_taskInput, "searchTaskNameField", attr.title_textNumInput_2_128, false);
const searchNameInput = createInput(attr.fID_advSearchForm + "-empName-id", "", "text", empName, 2, 128, aria_searchEmpInput, "searchEmpNameField", attr.title_textInput_2_128, false);
const searchTaskField = createField(taskName, searchTaskInput, msgID_task, attr.utlClass_noDisplay);
const searchNameField = createField(empName, searchNameInput, msgID_empName, attr.utlClass_noDisplay);


['keyup', 'blur', 'focus'].forEach((action) => {

    fnameInput.addEventListener(action, () => {

        validateEmployeeForm(attr.fID_empForm, 2);
    });

    lnameInput.addEventListener(action, () => {

        validateEmployeeForm(attr.fID_empForm, 3);
    });

    emailInput.addEventListener(action, () => {

        validateEmployeeForm(attr.fID_empForm, 4);
    });

    taskInput.addEventListener(action, () => {

        validateTaskForm(attr.fID_taskForm);
    })
    searchTaskInput.addEventListener(action, () => {

        validateAdvSearch(false, attr.fID_advSearchForm);
    });
    searchNameInput.addEventListener(action, () => {

        validateAdvSearch(true, attr.fID_advSearchForm);
    });
})

sexSelect.addEventListener('change', () => {

    validateEmployeeForm(attr.fID_empForm, 5);
})

imageUploadBtn.addEventListener("click", () => {

    document.getElementById(inputID_image).click();
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
        const newButton = createButton(btnID_submit, attr.btnClass_sizing, btnName, "submit");
        const form = document.getElementById(formID);
        const dangerZone = document.querySelector('.' + formID + attr.spClass_dangerZone);

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
    const deleteBtn = createButton(btnID_delete, attr.btnClass_delete, "Delete", "button");

    const dangerZone = document.createElement('div');
    dangerZone.className = formID + attr.spClass_dangerZone;
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
    if (form.lastChild.className !== formID + attr.spClass_dangerZone) {

        form.append(dangerZone);
    }
    else {
        form.replaceChild(dangerZone, form.lastChild)
    }
}

/***************************************************************
                    FORM CONFIGURATIONS                          
***************************************************************/

//Clears the error highlight styling from all form inputs.
const unhighlightFormFields = () => {

    unhighlightField(taskInput);
    unhighlightField(fnameInput);
    unhighlightField(lnameInput);
    unhighlightField(emailInput);
    unhighlightField(sexSelect);
    unhighlightField(searchTaskInput);
    unhighlightField(searchNameInput);
}

//Data entry form configuration.
export const createDataEntryForm = (isEmpForm, formTitle, formID, cancelBtnID, submintBtnName, elementIdentifier, isUpdate = false, updateDataID = "") => {

    renderFormStructure(formTitle, formID, cancelBtnID, elementIdentifier);

    const form = document.getElementById(formID);
    const submitButton = createButton(btnID_submit, attr.btnClass_sizing, submintBtnName, "submit", submintBtnName + " button.");
    setSubmitType(isEmpForm, isUpdate, submitButton, formID, updateDataID);

    if (isEmpForm) {

        const infoDiv = document.createElement('div');
        infoDiv.className = fClass_InfoArea;
        infoDiv.append(fnameField, lnameField, emailField, sexField, submitButton);
        const imageDiv = renderImageUpload();
        form.append(imageDiv, infoDiv);
    }
    else {

        form.append(taskField, submitButton);
    }

    unhighlightFormFields();
    clearMessages(form.getElementsByTagName('p'), 0);
    form.reset();
}

//Advanced Search configuration.
export const createAdvancedSearchForm = (isEmpForm, formTitle, formID, cancelBtnID, submintBtnName, elementIdentifier) => {

    renderFormStructure(formTitle, formID, cancelBtnID, elementIdentifier);

    const form = document.getElementById(formID);
    const submitButton = createButton(btnID_submit, attr.btnClass_sizing, submintBtnName, "submit", submintBtnName + " button.");

    submitButton.addEventListener('click', () => {

        advancedSearch(isEmpForm, formID);
    })

    if (isEmpForm) {

        form.append(searchNameField, submitButton);
    }
    else {

        form.append(searchTaskField, submitButton);
    }

    unhighlightFormFields();
    clearMessages(form.getElementsByTagName('p'), form.getElementsByTagName('p').length);
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
    const cancelButton = createButton(cancelBtnID, attr.btnClass_cancel, "X", "button", "cancel button");
    const form = document.createElement('form');

    cancelButton.addEventListener('click', () => {

        clearElement("#" + attr.modal_containerID);
    })

    overlay.className = attr.modal_overlayClass;
    container.className = attr.modal_containerClass;
    customHeader.className = attr.modal_headingClass;
    title.textContent = formTitle;
    title.id = formID + "-title";
    customHeader.append(title, cancelButton);
    form.id = formID;
    form.className = fClass_content;
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

    previewArea.className = fClass_imagePreview;
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
    imageDiv.className = fClass_imageArea;
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