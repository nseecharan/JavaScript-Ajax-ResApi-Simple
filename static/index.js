let emp_route = "/api/employees";//optional name as param
let emp_find = emp_route + "/search"
let emp_register = emp_route + "/register";
let emp_update = emp_route + "/update";//id as param
let emp_delete = emp_route + "/delete";//id as param

let task_route = "/api/tasks";//optional name as param
let task_find = task_route + "/search";
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

           // if (dbData.length > 0) {
                dbData = json;
                renderData(dbData, "#tableBody");
           // }
        })
        .catch((err) => {

            renderData(err, "#tableBody");
        });
}

/***************************************************************
                        MAIN FUNCTIONS                          
***************************************************************/

//consider creating an event that tracks the length of the dbData
 function searchData(e) {

    let query = e.target.value;

    if (query.length !== 0 || query !== undefined) {

        clearTable("renderTable");

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

        renderData(searchResults, "#tableBody");
    }
}

//LOGIN
/*******************************************************/
 function login() {

    let form = document.forms[0];

    //code sanitization here

    let formdata = {

        username: form.elements[0].value,
        password: form.elements[1].value
    }

    makeAjaxRequest("POST", "/api/login", formdata);
    form.reset();
    clearTable("renderTable");
}

//CREATE
/*******************************************************/
 async function createEmployee(formId) {

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

    makeAjaxRequest("POST", emp_register, formdata);

    form.reset();
}

 function createTask(formId) {

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
 function getAllEmployees() {

    makeAjaxRequest("GET", emp_route);

    if (!document.querySelector("#search").style.display) {
        elementDisplay("#search");
    }
}

 function getAllTasks() {

    makeAjaxRequest("GET", task_route);

    if (!document.querySelector("#search").style.display) {
        elementDisplay("#search");
    }
}

 function loginPage() {

    window.location.href = "/login";
}

//UPDATE
/*******************************************************/
 async function updateEmployee(id, formId) {

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

    makeAjaxRequest("PUT", emp_update + "?empID=" + id + "", formdata);
    form.reset();
}
 function updateTask(id, formId) {

    let form = document.getElementById(formId);

    //code sanitization here
    let formdata = {

        task: form.elements[0].value,
    }

    makeAjaxRequest("PUT", task_update + "?taskID=" + id + "", formdata);
    form.reset();
}

//DELETE
/*******************************************************/
 function deleteEmployee(id) {

    makeAjaxRequest("DELETE", "/api/employees/delete?empID=" + id + "");
}
 function deleteTask(id) {

    makeAjaxRequest("DELETE", "/api/tasks/delete?taskID=" + id + "");
}

 function closeTaskForm() {

    clearElement("#submit-task");
    renderData(dbData, "#tableBody");
}
 function closeEmpForm() {

    clearElement("#submit-emp");
    renderData(dbData, "#tableBody");
}

//WRAPPER FUNCTIONS
/*******************************************************/
 function createTaskForm() {

    let taskForm = document.querySelector("#task-form");

    if (!taskForm) {

        renderTaskForm("Create Task", "task-form", "createTask('task-form')", "Create", "closeTaskForm()", "#submit-task");
    }
    else {

        document.querySelector("#task-form-title").textContent = "Create Task";
        let newButton = createButton("submit-btn", "", "Create", "submit", "createTask('task-form')");
        taskForm.replaceChild(newButton, taskForm.lastChild);
    }
}

 function updateTaskForm(_id) {

    let taskForm = document.querySelector("#task-form");

    if (!taskForm) {

        renderTaskForm("Update Task", "task-form", `updateTask('` + _id + `','task-form')`, "Update", "closeTaskForm()", "#submit-task");
    }
    else {

        document.querySelector("#task-form-title").textContent = "Update Task";
        let newButton = createButton("submit-btn", "", "Update", "submit", `updateTask('` + _id + `','task-form')`);
        taskForm.replaceChild(newButton, taskForm.lastChild);
    }
}

 function createEmpForm() {

    let empForm = document.querySelector("#emp-form");

    if (!empForm) {

        renderEmployeeForm("Create Employee", "emp-form", "createEmployee('emp-form')", "Create", "closeEmpForm()", "#submit-emp");
    }
    else {

        document.querySelector("#emp-form-title").textContent = "Create Employee";
        let newButton = createButton("submit-btn", "", "Create", "submit", "createEmployee('emp-form')");
        empForm.replaceChild(newButton, empForm.lastChild);
    }
}

 function updateEmpForm(_id) {

    let empForm = document.querySelector("#emp-form");

    if (!empForm) {

        renderEmployeeForm("Update Employee", "emp-form", `updateEmployee('` + _id + `','emp-form')`, "Update", "closeEmpForm()", "#submit-emp");
    }
    else {

        document.querySelector("#emp-form-title").textContent = "Update Employee";
        let newButton = createButton("submit-btn", "", "Update", "submit", `updateEmployee('` + _id + `','emp-form')`);
        empForm.replaceChild(newButton, empForm.lastChild);
    }
}

/***************************************************************
                        RENDER DATA                           
***************************************************************/

//This function passes data to relevant functions that will configure the table
//and render data in the table body. You must pass the ID (or Class) of the table
//body you want to add the data to.
 function renderData(data, tableBodyId) {

    if (!document.querySelector(tableBodyId)) {

        return;
    }
    //check to see if its just a message and to see if there is an exclusive error message section of the html to display the error
    if (data.message) {

        renderError(data.message)
    }

    if (token && !document.querySelector("#create-options").style.display) {

        elementDisplay("#create-options");
    }

    document.getElementById("raw-data").innerHTML = JSON.stringify(data, null, '\t');

    if (data[0] != undefined) {

        clearTable("renderTable");

        if (data[0].first_name) {

            createTableHeader(["Image", "Name", "Email", "Action"], "tableHdr")
        }
        else {

            createTableHeader(["Task", "Action"], "tableHdr")
        }

        data.map((obj, index) => {

            renderRow(obj, index, tableBodyId);
        })
    }
}

//Renders an error message in any element that has "error-msg" as it's ID.
function renderError(message) {

    let error_msg = document.getElementById("error-msg");

    if (error_msg) {

        error_msg.innerHTML = message;

        if (message.length == 0) {

            error_msg.className = "no-background";
        }
        else {

            error_msg.className = "error-background";
        }
    }
}

/***************************************************************
                        RENDER TABLE                           
***************************************************************/

 function clearTable(tableId) {

    if (document.getElementById(tableId)) {

        document.getElementById(tableId).childNodes[2].textContent = "";
        document.getElementById(tableId).childNodes[4].textContent = "";
    }
}

 function createTableHeader(headerList, parentId) {

    let tHead = document.getElementById(parentId);
    tHead.textContent = "";
    let last = headerList.length - 1;

    headerList.map((header, index) => {
        let th = document.createElement('th');
        th.innerHTML = header;
        th.className = index === last ? "th-action" : "th-style";
        tHead.appendChild(th);
    })

    document.querySelector("#renderTable").appendChild(tHead);
}

 function renderRow(data, index, parentId) {

    if (!data) {

        return;
    }

    let name = data.first_name + " " + data.last_name;
    let email = data.email;
    let _id = data._id;
    //let sex = data.sex;

    //row elements
    let row;
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    td2.innerHTML = name;
    let td3 = document.createElement('td');
    td3.innerHTML = email;
    let td4 = document.createElement('td');

    //row buttons
    let buttonDiv = document.createElement('div');
    buttonDiv.style = "margin:auto;width:max-content;";

    if (data.status == "editable") {

        if (data.first_name) {

            let updateBtn = createButton("emp-update-btn", "btn-sizing", "Update", "button", `updateEmpForm('` + _id + `')`);
            let deleteBtn = createButton("emp-delete-btn", "btn-sizing btn-red", "Delete", "button", `deleteEmployee('` + _id + `')`);
            buttonDiv.append(updateBtn, deleteBtn);

        }
        else {

            let updateBtn = createButton("task-update-btn", "btn-sizing", "Update", "button", `updateTaskForm('` + _id + `')`);
            let deleteBtn = createButton("task-delete-btn", "btn-sizing btn-red", "Delete", "button", `deleteTask('` + _id + `')`);
            buttonDiv.append(updateBtn, deleteBtn);
        }
    }

    td4.appendChild(buttonDiv);

    //create cloumns
    if (data.first_name) {

        let img = new Image();
        img.src = data.image;
        img.alt = "Image of employee";
        td1.appendChild(img);
        row = addRowDetails([td1, td2, td3, td4], index, _id)
    }
    else {

        td1.innerHTML = data.task;
        row = addRowDetails([td1, td4], index, _id)
    }

    document.querySelector(parentId).appendChild(row);
}

function addRowDetails(detailList, index, _id) {

    let row_color = (index % 2 == 0) ? "background-color:white;" : "background-color:lightgrey;";
    let row = document.createElement('tr');
    row.style = row_color;
    row.id = _id;
    let last = detailList.length - 1;
    detailList.map((td, index) => {

        td.className = index === last ? "td-action" : "td-style";
        row.appendChild(td);
    })

    return row;
}

/***************************************************************
                        RENDER FORM                           
***************************************************************/

 function renderTaskForm(formTitle, formId, submitFunc, submintBtnName, cancleFunc, elementIdentifier) {

    renderFormStructure(formTitle, formId, cancleFunc, elementIdentifier);

    let form = document.getElementById(formId);

    let labelTask = document.createElement('label');
    let taskInput = createInput("", "", "text", "Task Name");
    let submitButton = createButton("submit-btn", "", submintBtnName, "submit", submitFunc);

    labelTask.innerHTML = "Task Name";

    form.append(labelTask, taskInput, submitButton)
}

 function renderEmployeeForm(formTitle, formId, submitFunc, submintBtnName, cancleFunc, elementIdentifier) {

    renderFormStructure(formTitle, formId, cancleFunc, elementIdentifier);

    let form = document.getElementById(formId);

    let labelFname = document.createElement('label');
    let labelLname = document.createElement('label');
    let labelEmail = document.createElement('label');
    let labelSex = document.createElement('label');
    let labelImage = document.createElement('label');
    let submitButton = createButton("submit-btn", "", submintBtnName, "submit", submitFunc);

    labelFname.innerHTML = "First Name";
    labelLname.innerHTML = "Last Name";
    labelEmail.innerHTML = "Email";
    labelSex.innerHTML = "Sex";
    labelImage.innerHTML = "Image"

    let fnameInput = createInput("", "", "text", "First Name");
    let lnameInput = createInput("", "", "text", "Last Name");
    let emailInput = createInput("", "", "text", "Email");
    let imageInput = createInput("", "", "file", "");

    let optionsArray = [
        { value: "", text: "Add Sex" },
        { value: "Male", text: "Male" },
        { value: "Female", text: "Female" },
    ]
    let sexSelect = createSelect("", "", optionsArray)

    form.append(
        labelFname, fnameInput, labelLname,
        lnameInput, labelEmail, emailInput,
        labelSex, sexSelect, labelImage,
        imageInput, submitButton)
}

function renderFormStructure(formTitle, formId, cancleFunc, elementIdentifier) {

    let container = document.createElement('div');
    let customHeader = document.createElement('div');
    let title = document.createElement('span');
    let cancelButton = createButton("cancel-btn", "btn-red", "X", "button", cancleFunc);
    let form = document.createElement('form');

    customHeader.className = "form-heading";
    title.innerHTML = formTitle;
    title.id = formId + "-title";

    customHeader.append(title, cancelButton);

    container.className = "option-border options";
    form.id = formId;
    form.className = "create-form";
    form.onsubmit = "event.preventDefault()";
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    })
    container.append(customHeader, form);

    document.querySelector(elementIdentifier).appendChild(container);
}

/***************************************************************
                        RENDER INPUTS                           
***************************************************************/

 function createButton(id, classes, name, type, clickEvent) {

    let parser = new DOMParser()
    let btnId = id ? `id=` + id + " " : "";
    let btnClasses = classes ? `class='` + classes + "' " : "";
    let btnType = type ? `type=` + type + " " : "";
    let btnClick = clickEvent ? `onclick=` + clickEvent + " " : "";
    let newButton = `<button ` + btnId + btnClasses + btnType + btnClick + `>` + name + `</button>`
    let result = parser.parseFromString(newButton, "text/html");

    return result.body.lastChild;
}

 function createSelect(selectId, selClass, optionsObject) {

    let selectElement = document.createElement('select');
    selectElement.id = selectId;
    selectElement.className = selClass;

    optionsObject.map((option, index) => {

        let opt = document.createElement('option');
        if (index === 0) {

            opt.selected = true;
        }
        opt.value = option.value;
        opt.text = option.text;
        selectElement.appendChild(opt);
    })

    return selectElement;
}

 function createInput(inputId, inputClass, inputType, placeholder) {

    let newInput = document.createElement('input');
    newInput.id = inputId;
    newInput.className = inputClass;
    newInput.type = inputType;
    newInput.placeholder = placeholder;

    return newInput;
}

/***************************************************************
                        RENDER TOOLS                           
***************************************************************/

//This function will clear out all the child nodes for the specified element.
 function clearElement(elementIdentifier) {

    document.querySelector(elementIdentifier).textContent = "";
}

 function elementDisplay(elementIdentifier) {

    let elm = document.querySelector(elementIdentifier);

    if (!elm.style.display || elm.style.display === "none") {

        elm.style.display = "block";
    }
    else {

        elm.style.display = "none";
    }
}

//This function will attempt to load an image into memory for file upload.
 function readImage(image) {

    let reader = new FileReader();

    reader.readAsDataURL(image);
    return new Promise((resolve, reject) => {
        reader.onload = function (e) {
            resolve(e.target.result);
        }
    })
}


