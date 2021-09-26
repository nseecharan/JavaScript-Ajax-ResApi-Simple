import { closeEmpForm, closeTaskForm } from './events.js';
import { renderData } from './render/renderData.js';
import { elementDisplay, readImage, clearElement } from './render/renderTools.js';

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

            //this will need to authorize for all routes except login
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
        })
        .catch((err) => {

            renderData(err, "tableBody", token);
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

export function dataRefresh(tableId) {

    renderData(dbData, tableId, token);
}

//LOGIN
/*******************************************************/
export function login() {

    let form = document.forms[0];

    //code sanitization here

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

    //code sanitization here

    let formdata = {

        first_name: form.elements[0].value,
        last_name: form.elements[1].value,
        email: form.elements[2].value,
        sex: form.elements[3].value,
        image: ""
    }

    let imageSrc = form.elements[4].files[0];

    if (imageSrc) {

        formdata.image = await readImage(imageSrc);
    }
    else {

    }

    makeAjaxRequest("POST", emp_register, formdata);

    form.reset();
}

export function createTask(formId) {

    let form = document.getElementById(formId);

    //code sanitization here
    let formdata = {

        task: form.elements[0].value,
    }

    makeAjaxRequest("POST", task_add, formdata);
    form.reset();
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

    //code sanitization here

    let formdata = {

        first_name: form.elements[0].value,
        last_name: form.elements[1].value,
        email: form.elements[2].value,
        sex: form.elements[3].value,
        image: ""
    }

    let imageSrc = form.elements[4].files[0];

    if (imageSrc) {

        formdata.image = await readImage(imageSrc);
    }
    else {

        formdata.image = form.getElementsByTagName('img')[0].src;
    }

    makeAjaxRequest("PUT", emp_update + "?empID=" + id + "", formdata);
    closeEmpForm();

}

export function updateTask(id, formId) {

    let form = document.getElementById(formId);

    //code sanitization here
    let formdata = {

        task: form.elements[0].value,
    }

    makeAjaxRequest("PUT", task_update + "?taskID=" + id + "", formdata);
    closeTaskForm();
}

//DELETE
/*******************************************************/
export function deleteEmployee(id) {

    makeAjaxRequest("DELETE", "/api/employees/delete?empID=" + id + "");
}

export function deleteTask(id) {

    makeAjaxRequest("DELETE", "/api/tasks/delete?taskID=" + id + "");
}
