import { renderData } from './render/renderData.js';
import { openEmpForm, openTaskForm } from './menuEvents.js';
import { classToggle, readImage, clearElement, renderMessage, scrollToElement, scrollEndAnimation, loading } from './render/renderTools.js';
import { createButton } from './render/renderInputs.js';
import * as attr from './elementAttributes.js';
import { pageNavigation } from './render/renderPageNavigation.js';
import { DataManager } from './dataManager.js';

const emp_route = "/api/employees";//optional name as param
const emp_paging = emp_route + "/page/";
const emp_find = emp_route + "/find";
const emp_register = emp_route + "/register";
const emp_update = emp_route + "/update";//id as param
const emp_delete = emp_route + "/delete";//id as param

const task_route = "/api/tasks";//optional name as param
const task_paging = task_route + "/page/";
const task_find = task_route + "/find";
const task_add = task_route + "/add";
const task_update = task_route + "/update";//id as param
const task_delete = task_route + "/delete";//id as param

const dataRefreshDelay = 100;
const scrollDelay = 500;

const aria_newEmpBtn = "Button to open the create employee form.";
const aria_newTaskBtn = "Button to opent the create task form.";

const dm = DataManager();

/***************************************************************
                        AJAX FUNCTIONS                           
***************************************************************/

//Method that manages ajax request to server.
const makeAjaxRequest = async (method, url, data) => {

    loading(attr.modal_containerID);

    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'jwt ' + dm.getToken()
        }
    })
        .then((response) => {

            return response.json()
        });
}

/***************************************************************
                        MAIN FUNCTIONS                          
***************************************************************/

//This method will call the functions to update the data in memory, 
//with the new data retireved from the API.
const displayApiResponse = (makeReq) => {

    parseJsonData(makeReq);
    statusMessage(attr.msgID_general);
}

//Extracts relevant information from the json data, and then renderes it.
//What gets rendered depends on what is contained in the json data.
//In some cases it can be a status message, or an array of data to be rendered
//in the table.
const parseJsonData = (json) => {

    if (json.token) {

        dm.setToken(json.token);
    }
    if (json.message) {

        dm.setResponse(json);
    }
    if (json.data) {

        dm.setData(json.data);
        renderMessage("", attr.msgID_general, attr.utlClass_noDisplay, attr.gfxClass_confirmed);
    }
    if (json.pages) {

        dm.setLastPage(json.pages);
        dm.setCurrentPage(json.currentPage)
        pageNavigation("page-buttons", dm.getLastPage(), (dm.getCurrentPage() + 1));
    }

    renderData(dm.getData(), attr.spClass_renderData, dm.getRenderStyle());
    clearElement("#" + attr.modal_containerID);
}

//This funciton will load the appropriate create button for the related data set,
//and append it to the parent elemet with the ID specified in the second argument.
const dataBtnManager = (data, parentID) => {

    const btnParent = document.getElementById(parentID);
    btnParent.textContent = "";

    if (data[0].first_name) {

        const newButton = createButton("", attr.btnClass_sizing, "New Employee", "button", aria_newEmpBtn, "", "")
        newButton.addEventListener('click', () => {

            openEmpForm();
        });
        btnParent.appendChild(newButton);
    }
    else {

        const newButton = createButton("", attr.btnClass_sizing, "New Task", "button", aria_newTaskBtn, "", "")
        newButton.addEventListener('click', () => {

            openTaskForm();
        });
        btnParent.appendChild(newButton);
    }
}

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

        renderData(dm.getSearchResults(), attr.spClass_renderData, dm.getRenderStyle());
    }
}

//Will increament the page index, and then get the data at that index.
export const nextPage = () => {

    if (dm.getCurrentPage() < dm.getLastPage() - 1) {

        dm.incrementPage();
        getPage(dm.getCurrentPage());
    }

    return dm.getCurrentPage();
}

//Will decrement the page index, and then get the data at that index.
export const prevPage = () => {

    if ((dm.getCurrentPage() - 1) > -1) {

        dm.decrementPage();
        getPage(dm.getCurrentPage());
    }

    return dm.getCurrentPage();
}

export const toggleDataStyle = async () => {

    if (dm.getData().length > 0) {

        dm.toggleRenderStyle();
        classToggle(attr.spClass_renderData, false, attr.gfxClass_dimWindow, attr.gfxClass_dosScreen);
        getPage(dm.getCurrentPage());
    }
}

const statusMessage = (messageElementID) => {

    const message = dm.getResponse().message;

    if (message) {

        renderMessage(message, messageElementID, attr.utlClass_noDisplay, attr.gfxClass_message);
    }
}

const scrollList = async () => {

    await scrollToElement(attr.tID_body, scrollDelay);
    const lastElm = document.getElementById(attr.tID_body).lastChild;
    scrollEndAnimation(lastElm, attr.spClass_renderData, attr.animClass_flash, attr.tClass_trStyle);
}

const dataIsEmp = () => {

    if(dm.getData())
    if (dm.getData()[0].first_name) {

        return true;
    }
    else {

        return false;
    }
}

/***************************************************************
                        API CALLS                          
***************************************************************/

//Will make a request to the API to get the data at the indicated page index.
export const getPage = async (page) => {

    if (page <= dm.getLastPage() && page > -1) {

        const pageRoute = dataIsEmp() ? emp_paging : task_paging;
        const makeReq = await makeAjaxRequest("GET", pageRoute + page + "");
        displayApiResponse(makeReq);
    }

    return dm.getCurrentPage();
}

export const advancedSearch = async (type, formID) => {

    const form = document.getElementById(formID);
    const fieldValue = form.elements[0].value;

    if (type === true) {

        const makeReq = await makeAjaxRequest("GET", emp_find + "/name/" + fieldValue);

        if (makeReq.data) {

            dm.setCurrentPage(0);
        }
        parseJsonData(makeReq);
    }
    else {

        const makeReq = await makeAjaxRequest("GET", task_find + "/name/" + fieldValue);

        if (makeReq.data) {

            dm.setCurrentPage(0);
        }
        parseJsonData(makeReq);
    }

    statusMessage(attr.msgID_general);
}

const refreshEmpData = async (mostCurrentPage = false) => {


    if (mostCurrentPage) {

        getPage(dm.getCurrentPage());
    }
    else {
        setTimeout(() => {

            getPage(dm.getLastPage());
            scrollList();

        }, dataRefreshDelay * 5)
    }
}

const refreshTaskData = async (mostCurrentPage = false) => {


    if (mostCurrentPage) {

        getPage(dm.getCurrentPage());
    }
    else {
        setTimeout(() => {

            getPage(dm.getLastPage());
            scrollList();

        }, dataRefreshDelay * 2)
    }
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
        clearElement("#" + attr.spID_loginArea)
        classToggle(attr.spID_createBtnOptions, true);
        renderMessage(dm.getResponse().message, attr.msgID_login, attr.utlClass_noDisplay, attr.gfxClass_confirmed);

        dm.setResponse({ message: "", status: "success" });
        renderMessage("", attr.msgID_general, attr.utlClass_noDisplay, attr.gfxClass_confirmed);

        if (dm.getData().length) {

            dataBtnManager(dm.getData(), attr.spID_createBtnOptions);
        }
    }
    else {

        statusMessage(attr.msgID_login);
    }
}

//CREATE
/*******************************************************/
//The create functions will add new data, and then scroll to the new entry once the
//table has been re-rendered.

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
    displayApiResponse(makeReq);

    if (dm.getResponse().status !== "error") {

        await refreshEmpData();
    }
}

export const createTask = async (formId) => {

    const form = document.getElementById(formId);

    const formdata = {

        task: form.elements[0].value,
    }

    const makeReq = await makeAjaxRequest("POST", task_add, formdata);
    displayApiResponse(makeReq);

    if (dm.getResponse().status !== "error") {

        await refreshTaskData();
    }
}

//READ
/*******************************************************/
//The read functions will load the data, and display the search field.

export const getAllEmployees = async () => {

    dm.setCurrentPage(0);
    const makeReq = await makeAjaxRequest("GET", emp_paging + dm.getCurrentPage());
    displayApiResponse(makeReq);
    classToggle(attr.spID_search, true);
    classToggle(attr.btnID_toggle, true, attr.btnClass_toggle);

    if (dm.getToken()) {

        dataBtnManager(dm.getData(), attr.spID_createBtnOptions);
    }
}

export const getAllTasks = async () => {

    dm.setCurrentPage(0);
    const makeReq = await makeAjaxRequest("GET", task_paging + dm.getCurrentPage());
    displayApiResponse(makeReq);
    classToggle(attr.spID_search, true);
    classToggle(attr.btnID_toggle, true, attr.btnClass_toggle);

    if (dm.getToken()) {

        dataBtnManager(dm.getData(), attr.spID_createBtnOptions);
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
    displayApiResponse(makeReq);

    if (dm.getResponse().status !== "error") {

        await refreshEmpData(true);
    }
}

export const updateTask = async (id, formId) => {

    const form = document.getElementById(formId);

    const formdata = {

        task: form.elements[0].value,
    }

    const makeReq = await makeAjaxRequest("PUT", task_update + "?taskID=" + id + "", formdata);
    displayApiResponse(makeReq);

    if (dm.getResponse().status !== "error") {

        await refreshTaskData(true);
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
    displayApiResponse(makeReq);
    await refreshEmpData(true);
}

//Permanently delete a task.
export const deleteTask = async (id) => {

    const makeReq = await makeAjaxRequest("DELETE", task_delete + "?taskID=" + id + "");
    displayApiResponse(makeReq);
    await refreshTaskData(true);
}
