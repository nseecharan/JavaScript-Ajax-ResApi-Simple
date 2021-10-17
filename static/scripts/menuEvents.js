import { preloadFormData, createDataEntryForm, createAdvancedSearchForm, changeForm } from './render/renderForm.js';
import { deleteEmployee, deleteTask } from './routes.js';
import * as s from './elementAttributes.js';

//MENU CONTROL EVENTS
//******************************************/

export const advancedSearchForm = (dataSetType) => {

    createAdvancedSearchForm(dataSetType, "Advanced Search", "adv-search", "cancel-btn", "Search", s.modal_containerID);
}

//This funciton will open the creat task form.
export const openTaskForm = () => {

    const taskForm = document.getElementById(s.taskFormID);

    if (!taskForm) {

        createDataEntryForm(false, "Create Task", s.taskFormID, "cancel-btn", "Create", s.modal_containerID);
    }
    else {

        changeForm(false, false, s.taskFormTitleID, "Create Task", s.taskFormID, "Create");
        taskForm.reset();
    }
}

//This funciton will open the update task form.
export const openTaskUpdateForm = (data) => {

    const taskForm = document.getElementById(s.taskFormID);

    if (!taskForm) {

        createDataEntryForm(false, "View Task", s.taskFormID, "cancel-btn", "Update", s.modal_containerID, true, data._id);
    }
    else {

        changeForm(false, true, s.taskFormTitleID, "View Task", s.taskFormID, "Update", data._id);
    }

    preloadFormData(s.taskFormID, data);
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

    const empForm = document.getElementById(s.empFormID);

    if (!empForm) {

        createDataEntryForm(true, "Create Employee", s.empFormID, "cancel-btn", "Create", s.modal_containerID);
    }
    else {

        changeForm(true, false, s.empFormTitleID, "Create Employee", s.empFormID, "Create");
        empForm.reset();
        empForm.getElementsByTagName('img')[0].src = "";
    }
}

//This will open the update employee form.
export const openEmpUpdateForm = (data) => {

    const empForm = document.getElementById(s.empFormID);

    if (!empForm) {

        createDataEntryForm(true, "View Employee", s.empFormID, "cancel-btn", "Update", s.modal_containerID, true, data._id);
    }
    else {

        changeForm(true, true, s.empFormTitleID, "View Employee", s.empFormID, "Update", data._id);
    }

    preloadFormData(s.empFormID, data);
}

//This funciton will prompt for confirmation on deleting a employee from the database.
export const confirmDeleteEmp = (data) => {

    const confirmDel = confirm("Delete this " + data.first_name + " " + data.last_name + "? This action can not be undone.");

    if (confirmDel == true) {

        deleteEmployee(data._id);
    }
}
