import { clearElement } from './render/renderTools.js';
import { preloadFormData, createForm, changeForm } from './render/renderForm.js';
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
const empCancelBtnID = "emp-cancel-btn";


//MENU CONTROL EVENTS
//******************************************/

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

        document.getElementById(empCancelBtnID).addEventListener('click', () => {

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

        document.getElementById(empCancelBtnID).addEventListener('click', () => {

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

