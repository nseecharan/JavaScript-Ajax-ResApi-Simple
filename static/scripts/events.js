import { createButton } from './render/renderInputs.js';
import { clearElement } from './render/renderTools.js';
import { renderTaskForm, renderEmployeeForm, preloadFormData } from './render/renderForm.js';
import {
    createEmployee, createTask,
    getAllEmployees, getAllTasks,
    updateEmployee, updateTask,
    deleteEmployee, deleteTask,
} from './dataManager.js';

const taskFormParentID = "submit-task";
const taskFormTitleID = "task-form-title";
const taskFormID = "task-form";
const taskCancelBtnID = "task-cancel-btn";

const empFormParentID = "submit-emp";
const empFormTitleID = "emp-form-title";
const empFormID = "emp-form";
const EmpCancelBtnID = "emp-cancel-btn";

export function openTaskForm() {

    let taskForm = document.getElementById(taskFormID);

    if (!taskForm) {

        createForm(false, false, "Create Task", taskFormID, "Create", taskFormParentID);

        document.getElementById(taskCancelBtnID).addEventListener('click', () => {

            closeTaskForm();
        })
    }
    else {

        changeForm(false, false, taskFormTitleID, "Create Task", taskFormID, "Create");
        taskForm.reset();
    }
}

export function openTaskUpdateForm(_id, data) {

    let taskForm = document.getElementById(taskFormID);

    if (!taskForm) {

        createForm(false, true, "View Task", taskFormID, "Update", taskFormParentID, _id);

        document.getElementById(taskCancelBtnID).addEventListener('click', () => {

            closeTaskForm();
        })
    }
    else {

        changeForm(false, true, taskFormTitleID, "View Task", taskFormID, "Update", _id);
    }

    preloadFormData(taskFormID, data);
}

export function confirmDeleteTask(data) {

    let confirmDel = confirm("Delete this " + data.task + "? This action can not be undone.");

    if (confirmDel == true) {

        deleteTask(data._id);
    }
}

export function openEmpForm() {

    let empForm = document.getElementById(empFormID);

    if (!empForm) {

        createForm(true, false, "Create Employee", empFormID, "Create", empFormParentID);

        document.getElementById(EmpCancelBtnID).addEventListener('click', () => {

            closeEmpForm();
        })
    }
    else {

        changeForm(true, false, empFormTitleID, "Create Employee", empFormID, "Create");
        empForm.reset();
        empForm.getElementsByTagName('img')[0].src = "";
    }
}

export function openEmpUpdateForm(_id, data) {

    let empForm = document.getElementById(empFormID);

    if (!empForm) {

        createForm(true, true, "View Employee", empFormID, "Update", empFormParentID, _id);

        document.getElementById(EmpCancelBtnID).addEventListener('click', () => {

            closeEmpForm();
        })
    }
    else {

        changeForm(true, true, empFormTitleID, "View Employee", empFormID, "Update", _id);
    }

    preloadFormData(empFormID, data);
}

export function confirmDeleteEmp(data) {

    let confirmDel = confirm("Delete this " + data.first_name + " " + data.last_name + "? This action can not be undone.");

    if (confirmDel == true) {

        deleteEmployee(data._id);
    }
}

export function closeTaskForm() {

    clearElement("#submit-task");
}

export function closeEmpForm() {

    clearElement("#submit-emp");
}

//FORM METHODS
//******************************************/

function createForm(isEmpForm, isUpdate, title, formID, btnName, parentID, updateDataID = "") {

    if (isEmpForm) {

        renderEmployeeForm(title, formID, EmpCancelBtnID, btnName, parentID);
    }
    else {

        renderTaskForm(title, formID, taskCancelBtnID, btnName, parentID);
    }

    let form = document.getElementById(formID);
    let last = form.elements.length - 1;
    let button = form.elements[last];

    setSubmitType(isEmpForm, isUpdate, button, formID, updateDataID);
}

function changeForm(isEmpForm, isUpdate, titleID, titleChange, formID, btnName, updateDataID = "") {

    let title = document.getElementById(titleID);

    if (title.textContent !== titleChange) {

        title.textContent = titleChange;
        let newButton = createButton("submit-btn", "btn-sizing", btnName, "submit");
        let form = document.getElementById(formID);
        let dangerZone = document.querySelector('.' + formID + '-danger-zone');

        setSubmitType(isEmpForm, isUpdate, newButton, formID, updateDataID);

        if (dangerZone) {

            dangerZone.remove();
        }

        let last = form.elements.length - 1;
        let oldButton = form.elements[last];

        oldButton.replaceWith(newButton);
    }
}

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