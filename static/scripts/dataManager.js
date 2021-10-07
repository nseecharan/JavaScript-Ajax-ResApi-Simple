import { disableForm } from './form-validation/disableForm.js';
import { closeEmpForm, closeTaskForm } from './menuEvents.js';
import { renderData } from './render/renderData.js';
import { elementDisplay, readImage, clearElement, renderMessage, scrollToElement } from './render/renderTools.js';

let emp_route = "/api/employees";//optional name as param
//let emp_find = emp_route + "/search"
let emp_register = emp_route + "/register";
let emp_update = emp_route + "/update";//id as param
let emp_delete = emp_route + "/delete";//id as param

let task_route = "/api/tasks";//optional name as param
//let task_find = task_route + "/search";
let task_add = task_route + "/add";
let task_update = task_route + "/update";//id as param
let task_delete = task_route + "/delete";//id as param

let token;//consider storing in cookie so that you can make this a multi page application

let dbData = [];//contains the array of objects returned from database
let searchResults = [];//contains only the results fron the search

/***************************************************************
                        AJAX FUNCTIONS                           
***************************************************************/

async function makeAjaxRequest(method, url, data) {

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

function parseJsonData(json) {

    //consider making a cookie session instead
    if (json.token) {

        token = json.token;

        if (document.getElementById("create-options").className == "no-display") {

            elementDisplay("#create-options", "no-display");
        }
    }

    dbData = json;
    renderData(dbData, "tableBody");


    //add this to create update, delete
    //if (dbData.message) {

    //    renderMessage(dbData.message, "general-msg");
    //}
}

/***************************************************************
                        MAIN FUNCTIONS                          
***************************************************************/

//consider creating an event that tracks the length of the dbData
export function searchData(e) {

    let query = e.target.value;

    if (query.length !== 0 || query !== undefined) {

        clearElement("#tableHdr");
        clearElement("#tableBody");

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

        renderData(searchResults, "tableBody");
    }
}

function refreshEmpData(delay, close = false) {

    if (dbData.message !== "Please log in") {

        if (close) {
            closeEmpForm();
        }

        setTimeout(() => {
            getAllEmployees();
        }, delay)
    }
}

function refreshTaskData(delay, close = false) {

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
export async function login() {

    let form = document.forms[0];

    let formdata = {

        username: form.elements[0].value,
        password: form.elements[1].value
    }

    const makeReq = await makeAjaxRequest("POST", "/api/login", formdata);
    parseJsonData(makeReq);

    if (token && form.className !== "no-display") {

        form.reset();
        disableForm(form);
        elementDisplay("#login-form", "no-display");
        renderMessage(dbData.message, "login-msg", "no-display", "error-background");
    }
}

//CREATE
/*******************************************************/
export async function createEmployee(formId) {

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
        scrollToElement("tableBody", 500, true, true);
    }
}

export async function createTask(formId) {

    const form = document.getElementById(formId);

    const formdata = {

        task: form.elements[0].value,
    }

    const makeReq = await makeAjaxRequest("POST", task_add, formdata);
    parseJsonData(makeReq);

    if (makeReq) {

        refreshTaskData(100, true);
        scrollToElement("tableBody", 500, true, true);
    }
}

//READ
/*******************************************************/
export async function getAllEmployees() {

    const makeReq = await makeAjaxRequest("GET", emp_route);
    parseJsonData(makeReq);

    if (!document.querySelector("#search").style.display) {
        elementDisplay("#search", "no-display");
    }
}

export async function getAllTasks() {

    const makeReq = await makeAjaxRequest("GET", task_route);
    parseJsonData(makeReq);

    if (!document.querySelector("#search").style.display) {
        elementDisplay("#search", "no-display");
    }
}

//UPDATE
/*******************************************************/
export async function updateEmployee(id, formId) {

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

export async function updateTask(id, formId) {

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
export async function deleteEmployee(id) {

    const makeReq = await makeAjaxRequest("DELETE", emp_delete + "?empID=" + id + "");
    parseJsonData(makeReq);
    refreshEmpData(100, true);
}

export async function deleteTask(id) {

    const makeReq = await makeAjaxRequest("DELETE", task_delete + "?taskID=" + id + "");
    parseJsonData(makeReq);
    refreshTaskData(100, true);
}
