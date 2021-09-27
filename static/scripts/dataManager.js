import { closeEmpForm, closeTaskForm } from './events.js';
import { renderData } from './render/renderData.js';
import { elementDisplay, readImage, clearElement, renderError } from './render/renderTools.js';

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

function makeAjaxRequest(method, url, data) {

    fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'jwt ' + token
        }
    })
        .then((response) => response.json())
        .then((json) => {

            //consider making a cookie session instead
            if (json.token) {
                token = json.token;
            }

            dbData = json;
            renderData(dbData, "tableBody", token);

            if (dbData.message) {

                //renderError(dbData.message, "error-msg");
            }
            else {

                //renderError(dbData.loginMessage, "login-error-msg");
            }
        })
        .catch((err) => {

            renderData(err, "tableBody", token);
            console.log(err);
        });
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
export function login() {

    let form = document.forms[0];

    //TODO:code sanitization here
    let formdata = {

        username: form.elements[0].value,
        password: form.elements[1].value
    }

    makeAjaxRequest("POST", "/api/login", formdata);
    form.reset();
    clearElement("#tableHdr");
    clearElement("#tableBody");
}

//CREATE
/*******************************************************/
export async function createEmployee(formId) {

    let form = document.getElementById(formId);

    //TODO:code sanitization here

    let formdata = {

        first_name: form.elements[1].value,
        last_name: form.elements[2].value,
        email: form.elements[3].value,
        sex: form.elements[4].value,
        image: ""
    }

    let imageSrc = form.elements[0].files[0];

    if (imageSrc) {

        formdata.image = await readImage(imageSrc);
    }

    makeAjaxRequest("POST", emp_register, formdata);
    //form.reset();
    //Make it so that the create button gets disabled until the table refreshes again.
    //This will avoid too many asynchronous calls to db/race conditions, while still
    //allowing the user to create data over and over without needing to keep clicking
    //the new task or employee button.
    refreshEmpData(500, true);
}

export function createTask(formId) {

    let form = document.getElementById(formId);

    //TODO:code sanitization here
    let formdata = {

        task: form.elements[0].value,
    }

    makeAjaxRequest("POST", task_add, formdata);
    //form.reset();
    //Make it so that the create button gets disabled until the table refreshes again.
    //This will avoid too many asynchronous calls to db/race conditions, while still
    //allowing the user to create data over and over without needing to keep clicking
    //the new task or employee button.
    refreshTaskData(500, true);
}

//READ
/*******************************************************/
export function getAllEmployees() {

    makeAjaxRequest("GET", emp_route);

    if (!document.querySelector("#search").style.display) {
        elementDisplay("#search");
    }
}

export function getAllTasks() {

    makeAjaxRequest("GET", task_route);

    if (!document.querySelector("#search").style.display) {
        elementDisplay("#search");
    }
}

//UPDATE
/*******************************************************/
export async function updateEmployee(id, formId) {

    let form = document.getElementById(formId);

    //TODO:code sanitization here

    let formdata = {

        first_name: form.elements[1].value,
        last_name: form.elements[2].value,
        email: form.elements[3].value,
        sex: form.elements[4].value,
        image: ""
    }

    let imageSrc = form.elements[0].files[0];

    if (imageSrc) {

        formdata.image = await readImage(imageSrc);
    }
    else {

        formdata.image = form.getElementsByTagName('img')[0].src;
    }

    makeAjaxRequest("PUT", emp_update + "?empID=" + id + "", formdata);
    refreshEmpData(500, true);
}

export function updateTask(id, formId) {

    let form = document.getElementById(formId);

    //TODO:code sanitization here
    let formdata = {

        task: form.elements[0].value,
    }

    makeAjaxRequest("PUT", task_update + "?taskID=" + id + "", formdata);
    refreshTaskData(500, true);
}

//DELETE
/*******************************************************/
export function deleteEmployee(id) {

    makeAjaxRequest("DELETE", emp_delete + "?empID=" + id + "");
    refreshEmpData(500, true);
}

export function deleteTask(id) {

    makeAjaxRequest("DELETE", task_delete + "?taskID=" + id + "");
    refreshTaskData(500, true);
}
