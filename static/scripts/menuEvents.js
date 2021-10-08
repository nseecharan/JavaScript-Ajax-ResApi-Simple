import { clearElement } from './render/renderTools.js';
import { preloadFormData, createForm, changeForm } from './render/renderForm.js';
import { deleteEmployee, deleteTask } from './dataManager.js';
import * as s from './elementAttributes.js';

//MENU CONTROL EVENTS
//******************************************/

//This funciton will open the creat task form.
export const openTaskForm = () => {

    let taskForm = document.getElementById(s.taskFormID);

    if (!taskForm) {

        createForm(false, false, "Create Task", s.taskFormID, "Create", s.taskFormParentID);

        document.getElementById(s.taskCancelBtnID).addEventListener('click', () => {

            closeTaskForm();
        })
    }
    else {

        changeForm(false, false, s.taskFormTitleID, "Create Task", s.taskFormID, "Create");
        taskForm.reset();
    }
}

//This funciton will open the update task form.
export const openTaskUpdateForm = (_id, data) => {

    let taskForm = document.getElementById(s.taskFormID);

    if (!taskForm) {

        createForm(false, true, "View Task", s.taskFormID, "Update", s.taskFormParentID, _id);

        document.getElementById(s.taskCancelBtnID).addEventListener('click', () => {

            closeTaskForm();
        })
    }
    else {

        changeForm(false, true, s.taskFormTitleID, "View Task", s.taskFormID, "Update", _id);
    }

    preloadFormData(s.taskFormID, data);
}

//This funciton will prompt for confirmation on deleting a task from the database.
export const confirmDeleteTask = (data) => {

    let confirmDel = confirm("Delete this " + data.task + "? This action can not be undone.");

    if (confirmDel == true) {

        deleteTask(data._id);
    }
}

//This function will open the create employee form.
export const openEmpForm = () => {

    let empForm = document.getElementById(s.empFormID);

    if (!empForm) {

        createForm(true, false, "Create Employee", s.empFormID, "Create", s.empFormParentID);

        document.getElementById(s.empCancelBtnID).addEventListener('click', () => {

            closeEmpForm();
        })
    }
    else {

        changeForm(true, false, s.empFormTitleID, "Create Employee", s.empFormID, "Create");
        empForm.reset();
        empForm.getElementsByTagName('img')[0].src = "";
    }
}

//This will open the update employee form.
export const openEmpUpdateForm = (_id, data) => {

    let empForm = document.getElementById(s.empFormID);

    if (!empForm) {

        createForm(true, true, "View Employee", s.empFormID, "Update", s.empFormParentID, _id);

        document.getElementById(s.empCancelBtnID).addEventListener('click', () => {

            closeEmpForm();
        })
    }
    else {

        changeForm(true, true, s.empFormTitleID, "View Employee", s.empFormID, "Update", _id);
    }

    preloadFormData(s.empFormID, data);
}

//This funciton will prompt for confirmation on deleting a employee from the database.
export const confirmDeleteEmp = (data) => {

    let confirmDel = confirm("Delete this " + data.first_name + " " + data.last_name + "? This action can not be undone.");

    if (confirmDel == true) {

        deleteEmployee(data._id);
    }
}

//This function will close the task form.
export const closeTaskForm = () => {

    clearElement("#submit-task");
}

//This function will close the employee form.
export const closeEmpForm = () => {

    clearElement("#submit-emp");
}

