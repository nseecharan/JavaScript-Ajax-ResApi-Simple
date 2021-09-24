import { createButton } from './render/renderInputs.js';
import { clearElement, elementDisplay, readImage } from './render/renderTools.js';
import { renderTaskForm, renderEmployeeForm } from './render/renderForm.js';
import {
    createEmployee, createTask,
    getAllEmployees, getAllTasks,
    updateEmployee, updateTask,
    deleteEmployee, deleteTask,
    dataRefresh
} from './dataManager.js';

const taskFormParentID = "submit-task";
const taskFormTitleID = "task-form-title";
const taskFormID = "task-form";
const taskCancelBtnID = "task-cancel-btn";

const empFormParentID = "submit-emp";
const empFormTitleID = "emp-form-title";
const empFormID = "emp-form";
const EmpCancelBtnID = "emp-cancel-btn";

export function createTaskForm() {

    let taskForm = document.getElementById(taskFormID);

    if (!taskForm) {

        createForm(false, false, "Create Task", taskFormID, "Create", taskFormParentID);

        document.getElementById(taskCancelBtnID).addEventListener('click', () => {

            closeTaskForm();
        })
    }
    else {

        changeForm(false, false, taskFormTitleID, "Create Task", taskFormID, "Create")
    }
}

export function updateTaskForm(_id) {

    let taskForm = document.getElementById(taskFormID);

    if (!taskForm) {

        createForm(false, true, "Update Task", taskFormID, "Update", taskFormParentID, _id);

        document.getElementById(taskCancelBtnID).addEventListener('click', () => {

            closeTaskForm();
        })
    }
    else {

        changeForm(false, true, taskFormTitleID, "Update Task", taskFormID, "Update", _id)
    }
}

export function createEmpForm() {

    let empForm = document.getElementById(empFormID);

    if (!empForm) {

        createForm(true, false, "Create Employee", empFormID, "Create", empFormParentID);

        document.getElementById(EmpCancelBtnID).addEventListener('click', () => {

            closeEmpForm();
        })
    }
    else {

        changeForm(true, false, empFormTitleID, "Create Employee", empFormID, "Create")
    }
}

export function updateEmpForm(_id) {

    let empForm = document.getElementById(empFormID);

    if (!empForm) {

        createForm(true, true, "Update Employee", empFormID, "Update", empFormParentID, _id);

        document.getElementById(EmpCancelBtnID).addEventListener('click', () => {

            closeEmpForm();
        })
    }
    else {

        changeForm(true, true, empFormTitleID, "Update Employee", empFormID, "Update", _id)
    }
}

function closeTaskForm() {

    clearElement("#submit-task");
    dataRefresh("tableBody");
}

function closeEmpForm() {

    clearElement("#submit-emp");
    dataRefresh("tableBody");
}

function createForm(isEmpForm, isUpdate, title, formID, btnName, parentID, updateDataID = "") {

    if (isEmpForm) {

        renderEmployeeForm(title, formID, EmpCancelBtnID, btnName, parentID);
    }
    else {

        renderTaskForm(title, formID, taskCancelBtnID, btnName, parentID);
    }

    let button = document.getElementById(formID).lastChild;

    setSubmitType(isEmpForm, isUpdate, button, formID, updateDataID);
}

function changeForm(isEmpForm, isUpdate, titleID, titleChange, formID, btnName, updateDataID = "") {

    let title = document.getElementById(titleID);

    if (title.textContent !== titleChange) {

        title.textContent = titleChange;
        let newButton = createButton("submit-btn", "", btnName, "submit");
        let form = document.getElementById(formID);

        setSubmitType(isEmpForm, isUpdate, newButton, formID, updateDataID);

        form.replaceChild(newButton, form.lastChild);
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