import { DataManager } from './DataManager.js';
import { renderData, renderRawData } from './render/renderData.js';
import { openEmpForm, openTaskForm } from './menuEvents.js';
import { classToggle, readImage, clearElement, renderMessage, scrollToElement, scrollEndAnimation, loading } from './render/renderTools.js';
import { createButton } from './render/renderInputs.js';
import * as s from './elementAttributes.js';

const emp_route = "/api/employees";//optional name as param
const emp_find = emp_route + "/search";
const emp_register = emp_route + "/register";
const emp_update = emp_route + "/update";//id as param
const emp_delete = emp_route + "/delete";//id as param

const task_route = "/api/tasks";//optional name as param
const task_find = task_route + "/search";
const task_add = task_route + "/add";
const task_update = task_route + "/update";//id as param
const task_delete = task_route + "/delete";//id as param

const dm = DataManager();

const dataRefreshDelay = 100;
const scrollDelay = 500;

/***************************************************************
                        AJAX FUNCTIONS                           
***************************************************************/

//Method that manages ajax request to server.
const makeAjaxRequest = async (method, url, data) => {

    loading(s.modal_containerID);

    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'jwt ' + dm.getToken()
        }
    })
        .then((response) => response.json())
}

//Extracts relevant information from the json data, and then renderes it.
//What gets rendered depends on what is contained in the json data.
//In some cases it can be a status message, or an array of data to be rendered
//in the table.
const parseJsonData = (json) => {

    //consider making a cookie session instead
    if (json.token) {

        dm.setToken(json.token);
    }

    dm.setData(json);
    renderData(dm.getData(), s.renderDataClass);
    renderRawData(dm.getData());
    clearElement("#" + s.modal_containerID)
}

//This funciton will load the appropriate create button for the related data set,
//and append it to the parent elemet with the ID specified in the second argument.
const dataBtnManager = (data, parentID) => {

    const btnParent = document.getElementById(parentID);
    btnParent.textContent = "";

    if (data[0].first_name) {

        const newButton = createButton("", s.buttonClass, "New Employee", "button", s.empCreateBtnAria, "", "")
        newButton.addEventListener('click', () => {

            openEmpForm();
        });
        btnParent.appendChild(newButton);
    }
    else {

        const newButton = createButton("", s.buttonClass, "New Task", "button", s.taskCreateBtnAria, "", "")
        newButton.addEventListener('click', () => {

            openTaskForm();
        });
        btnParent.appendChild(newButton);
    }
}

/***************************************************************
                        MAIN FUNCTIONS                          
***************************************************************/

//Will check to see if the characters entered in the search exist in the loaded table, 
//and will re-render the table to show the matching results. It checks the data in the
//name, and task columns respectively.
export const searchData = (e) => {

    const query = e.target.value;

    if (query.length !== 0 || query !== undefined) {

        dm.clearSearchResults();

        dm.getData().map((data) => {

            if (data.first_name) {

                if (String(data.first_name + " " + data.last_name).toLocaleLowerCase().includes(query.toLocaleLowerCase())) {

                    dm.addSearchItem(data);
                }
            }
            else {

                if (String(data.task).toLocaleLowerCase().includes(query.toLocaleLowerCase())) {

                    dm.addSearchItem(data);
                }
            }
        });

        renderData(dm.getSearchResults(), s.renderDataClass);
        renderRawData(dm.getSearchResults());
    }
}

//Will reload the employee data. This may be used to reflect updates if the data has changed, and
//requires re-rendering.
const refreshEmpData = (delay, close = false) => {

    return new Promise((resolve, reject) => {

        if (dm.getData().message !== "Please log in") {

            if (close) {

                clearElement("#" + s.modal_containerID);
            }

            setTimeout(() => {

                getAllEmployees();
                resolve();
            }, delay)
        }
    })
}

//Will reload the task data. This may be used to reflect updates if the data has changed, and
//requires re-rendering.
const refreshTaskData = (delay, close = false) => {

    return new Promise((resolve, reject) => {

        if (dm.getData().message !== "Please log in") {

            if (close) {

                clearElement("#" + s.modal_containerID);
            }

            setTimeout(() => {

                getAllTasks();
                resolve();
            }, delay)
        }
    })
}

const statusMessage = (messageElementID) => {

    const message = dm.getData().message;
    if (message) {

        renderMessage(message, messageElementID, s.noDisplayClass, s.messageClass);
    }
}

const scrollList = async () => {

    await scrollToElement(s.tableBodyID, scrollDelay);
    const lastElm = document.getElementById(s.tableBodyID).lastChild;
    scrollEndAnimation(lastElm, s.renderDataClass, s.flash, s.trClass);
}

//LOGIN
/*******************************************************/

export const login = async () => {

    const form = document.forms[0];

    const formdata = {

        username: form.elements[0].value,
        password: form.elements[1].value
    }

    const makeReq = await makeAjaxRequest("POST", "/api/login", formdata);
    parseJsonData(makeReq);

    if (dm.getToken()) {

        form.reset();
        clearElement("#" + s.loginAreaID)
        classToggle(s.createBtnOptionsID, true);
        renderMessage(dm.getData().message, s.loginMsgID, s.noDisplayClass, s.confirmedClass);

        clearElement("#" + s.renderDataClass);
        classToggle(s.searchID, true, s.noDisplayClass);
    }
}

//CREATE
/*******************************************************/
//The create functions will add new data, and then scroll to the new entry once the table has been re-rendered.

export const createEmployee = async (formId) => {

    const form = document.getElementById(formId);

    const formdata = {

        first_name: form.elements[2].value,
        last_name: form.elements[3].value,
        email: form.elements[4].value,
        sex: form.elements[5].value,
        image: ""
    }

    const imageSrc = form.elements[0].files[0];

    if (imageSrc) {

        formdata.image = await readImage(imageSrc);
    }

    const makeReq = await makeAjaxRequest("POST", emp_register, formdata);
    parseJsonData(makeReq);
    statusMessage(s.generalMsgID);

    if (dm.getData().status !== "error") {

        await refreshEmpData(dataRefreshDelay, true);
        scrollList();
    }
}

export const createTask = async (formId) => {

    const form = document.getElementById(formId);

    const formdata = {

        task: form.elements[0].value,
    }

    const makeReq = await makeAjaxRequest("POST", task_add, formdata);
    parseJsonData(makeReq);
    statusMessage(s.generalMsgID);

    if (dm.getData().status !== "error") {

        await refreshTaskData(dataRefreshDelay, true);
        scrollList();
    }
}

//READ
/*******************************************************/
//The read functions will load the data, and display the search field.

export const getAllEmployees = async () => {

    const makeReq = await makeAjaxRequest("GET", emp_route);
    parseJsonData(makeReq);
    statusMessage(s.generalMsgID);
    classToggle(s.searchID, true);

    if (dm.getToken()) {

        dataBtnManager(dm.getData(), s.createBtnOptionsID);
    }
}

export const getAllTasks = async () => {

    const makeReq = await makeAjaxRequest("GET", task_route);
    parseJsonData(makeReq);
    statusMessage(s.generalMsgID);
    classToggle(s.searchID, true);

    if (dm.getToken()) {

        dataBtnManager(dm.getData(), s.createBtnOptionsID);
    }
}

//UPDATE
/*******************************************************/
//The update functions will modify existing data, and re-render the table.

export const updateEmployee = async (id, formId) => {

    const form = document.getElementById(formId);

    const formdata = {

        first_name: form.elements[2].value,
        last_name: form.elements[3].value,
        email: form.elements[4].value,
        sex: form.elements[5].value,
        image: ""
    }

    const imageSrc = form.elements[0].files[0];

    if (imageSrc) {

        formdata.image = await readImage(imageSrc);
    }
    else {

        formdata.image = form.getElementsByTagName('img')[0].src;
    }

    const makeReq = await makeAjaxRequest("PUT", emp_update + "?empID=" + id + "", formdata);
    parseJsonData(makeReq);
    statusMessage(s.generalMsgID);

    if (dm.getData().status !== "error") {

        await refreshEmpData(dataRefreshDelay, true);
    }
}

export const updateTask = async (id, formId) => {

    const form = document.getElementById(formId);

    const formdata = {

        task: form.elements[0].value,
    }

    const makeReq = await makeAjaxRequest("PUT", task_update + "?taskID=" + id + "", formdata);

    parseJsonData(makeReq);
    statusMessage(s.generalMsgID);

    if (dm.getData().status !== "error") {

        await refreshTaskData(dataRefreshDelay, true);
    }
}

//DELETE
/*******************************************************/
//The delete functions work just like update, but removes the data instead.
//For the purposes of this demo, this is a true delete operation, and will
//permanently remove the data from the database. Normally this would just
//set a "do not display flag," to make it appear as though it was removed.

//Permanently delete an employee.
export const deleteEmployee = async (id) => {

    const makeReq = await makeAjaxRequest("DELETE", emp_delete + "?empID=" + id + "");
    parseJsonData(makeReq);
    statusMessage(s.generalMsgID);
    await refreshEmpData(dataRefreshDelay, true);
}

//Permanently delete a task.
export const deleteTask = async (id) => {

    const makeReq = await makeAjaxRequest("DELETE", task_delete + "?taskID=" + id + "");
    parseJsonData(makeReq);
    statusMessage(s.generalMsgID);
    await refreshTaskData(dataRefreshDelay, true);
}
