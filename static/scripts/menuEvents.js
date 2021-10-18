import { preloadFormData, createDataEntryForm, createAdvancedSearchForm, changeForm } from './render/renderForm.js';
import { deleteEmployee, deleteTask } from './routes.js';
import * as attr from './elementAttributes.js';

const btnID_cancel = "cancel-btn";
const advSearchTitle = "Advanced Search";
const taskCreateTitle = "Create Task";
const taskViewTitle = "View Task";
const empCreateTitle = "Create Employee";
const empViewTitle = "View Employee";

//MENU CONTROL EVENTS
//******************************************/

export const advancedSearchForm = (dataSetType) => {

    createAdvancedSearchForm(dataSetType, advSearchTitle, attr.fID_advSearchForm, btnID_cancel, "Search", attr.modal_containerID);
}

//This funciton will open the creat task form.
export const openTaskForm = () => {

    const taskForm = document.getElementById(attr.fID_taskForm);

    if (!taskForm) {

        createDataEntryForm(false, taskCreateTitle, attr.fID_taskForm, btnID_cancel, "Create", attr.modal_containerID);
    }
    else {

        changeForm(false, false, attr.fID_taskTitle, taskCreateTitle, attr.fID_taskForm, "Create");
        taskForm.reset();
    }
}

//This funciton will open the update task form.
export const openTaskUpdateForm = (data) => {

    const taskForm = document.getElementById(attr.fID_taskForm);

    if (!taskForm) {

        createDataEntryForm(false, taskViewTitle, attr.fID_taskForm, btnID_cancel, "Update", attr.modal_containerID, true, data._id);
    }
    else {

        changeForm(false, true, attr.fID_taskTitle, taskViewTitle, attr.fID_taskForm, "Update", data._id);
    }

    preloadFormData(attr.fID_taskForm, data);
}

//This funciton will prompt for confirmation on deleting a task from the database.
export const confirmDeleteTask = (data) => {

    const confirmDel = confirm("Delete this " + data.task + "? This action can not be undone.");

    if (confirmDel == true) {

        deleteTask(data._id);
    }
}

//This function will open the create employee form.
export const openEmpForm = () => {

    const empForm = document.getElementById(attr.fID_empForm);

    if (!empForm) {

        createDataEntryForm(true, empCreateTitle, attr.fID_empForm, btnID_cancel, "Create", attr.modal_containerID);
    }
    else {

        changeForm(true, false, attr.fID_empTitle, empCreateTitle, attr.fID_empForm, "Create");
        empForm.reset();
        empForm.getElementsByTagName('img')[0].src = "";
    }
}

//This will open the update employee form.
export const openEmpUpdateForm = (data) => {

    const empForm = document.getElementById(attr.fID_empForm);

    if (!empForm) {

        createDataEntryForm(true, empViewTitle, attr.fID_empForm, btnID_cancel, "Update", attr.modal_containerID, true, data._id);
    }
    else {

        changeForm(true, true, attr.fID_empTitle, empViewTitle, attr.fID_empForm, "Update", data._id);
    }

    preloadFormData(attr.fID_empForm, data);
}

//This funciton will prompt for confirmation on deleting a employee from the database.
export const confirmDeleteEmp = (data) => {

    const confirmDel = confirm("Delete this " + data.first_name + " " + data.last_name + "? This action can not be undone.");

    if (confirmDel == true) {

        deleteEmployee(data._id);
    }
}
