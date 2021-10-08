import { closeEmpForm, closeTaskForm } from './menuEvents.js';
import { renderData, renderRawData } from './render/renderData.js';
import { classToggle, readImage, clearElement, renderMessage, scrollToElement } from './render/renderTools.js';
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

let token;//consider storing in cookie so that you can make this a multi page application

let dbData = [];//and empty array that will contain the json data
let searchResults = [];//contains only the results fron the search

/***************************************************************
                        AJAX FUNCTIONS                           
***************************************************************/

//Method that manages ajax request to server.
const makeAjaxRequest = async (method, url, data) => {

    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'jwt ' + token
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

        token = json.token;

        classToggle(s.createBtnOptionsID, true);
    }

    dbData = json;
    renderData(dbData, s.renderDataClass);
    renderRawData(dbData);

    if (!dbData.message) {

        document.getElementById(s.renderDataClass).className = s.dataDisplayBGClass;
    }



    //add this to create update, delete
    //if (dbData.message) {

    //    renderMessage(dbData.message, "general-msg");
    //}
}

/***************************************************************
                        MAIN FUNCTIONS                          
***************************************************************/

//Will check to see if the characters entered in the search exist in the loaded table, 
//and will re-render the table to show the matching results. It checks the data in the
//name, and task columns respectively.
export const searchData = (e) => {

    let query = e.target.value;

    if (query.length !== 0 || query !== undefined) {

        searchResults = [];
        dbData.map((data) => {

            if (data.first_name) {

                if (String(data.first_name + " " + data.last_name).toLocaleLowerCase().includes(query.toLocaleLowerCase())) {

                    searchResults.push(data);
                }
            }
            else {

                if (String(data.task).toLocaleLowerCase().includes(query.toLocaleLowerCase())) {

                    searchResults.push(data);
                }
            }
        });

        renderData(searchResults, s.renderDataClass);
        renderRawData(searchResults);
    }
}

//Will reload the employee data. This may be used to reflect updates if the data has changed, and
//requires re-rendering.
const refreshEmpData = (delay, close = false) => {

    if (dbData.message !== "Please log in") {

        if (close) {
            closeEmpForm();
        }

        setTimeout(() => {
            getAllEmployees();
        }, delay)
    }
}

//Will reload the task data. This may be used to reflect updates if the data has changed, and
//requires re-rendering.
const refreshTaskData = (delay, close = false) => {

    if (dbData.message !== "Please log in") {

        if (close) {
            closeTaskForm();
        }

        setTimeout(() => {
            getAllTasks();
        }, delay)
    }
}

//LOGIN
/*******************************************************/

export const login = async () => {

    let form = document.forms[0];

    let formdata = {

        username: form.elements[0].value,
        password: form.elements[1].value
    }

    const makeReq = await makeAjaxRequest("POST", "/api/login", formdata);
    parseJsonData(makeReq);

    if (token) {

        form.reset();
        clearElement("#" + s.loginAreaID)
        renderMessage(dbData.message, s.loginMsgID, s.noDisplayClass, s.errorClass);
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

    if (makeReq) {

        refreshEmpData(100, true);
        scrollToElement(s.tableBodyID, 500, true, true);
    }
}

export const createTask = async (formId) => {

    const form = document.getElementById(formId);

    const formdata = {

        task: form.elements[0].value,
    }

    const makeReq = await makeAjaxRequest("POST", task_add, formdata);
    parseJsonData(makeReq);

    if (makeReq) {

        refreshTaskData(100, true);
        scrollToElement(s.tableBodyID, 500, true, true);
    }
}

//READ
/*******************************************************/
//The read functions will load the data, and display the search field.

export const getAllEmployees = async () => {

    const makeReq = await makeAjaxRequest("GET", emp_route);
    parseJsonData(makeReq);
    classToggle(s.searchID, true);

}

export const getAllTasks = async () => {

    const makeReq = await makeAjaxRequest("GET", task_route);
    parseJsonData(makeReq);
    classToggle(s.searchID, true);

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
    refreshEmpData(100, true);
}

export const updateTask = async (id, formId) => {

    const form = document.getElementById(formId);

    const formdata = {

        task: form.elements[0].value,
    }

    const makeReq = await makeAjaxRequest("PUT", task_update + "?taskID=" + id + "", formdata);
    parseJsonData(makeReq);
    refreshTaskData(100, true);
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
    refreshEmpData(100, true);
}

//Permanently delete a task.
export const deleteTask = async (id) => {

    const makeReq = await makeAjaxRequest("DELETE", task_delete + "?taskID=" + id + "");
    parseJsonData(makeReq);
    refreshTaskData(100, true);
}
