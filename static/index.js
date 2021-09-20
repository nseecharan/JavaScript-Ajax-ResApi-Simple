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

let demo_empId = "", demo_taskId = "";//will store the unique id of the demo items

let token;// make this a cookie instead

let dbData = [];//contains the array of objects returned from database
let searchResults = [];//contains only the results fron the search

/***************************************************************
                        AJAX FUNCTIONS                           
***************************************************************/

 function makeAjaxRequest(method, url, data) {

    // if (data) {

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

            //DELETE THIS; it is only for testing
            if (json.token) {
                token = json.token;
            }

            dbData = json;
            renderData(dbData, "#tableBody");
        })
        .catch((err) => {

            renderData(err, "#tableBody");
        });
    // }

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

//login
 function login() {

    let form = document.forms[0];

    //code sanitization here

    let formdata = {

        username: form.elements[0].value,
        password: form.elements[1].value
    }

    makeAjaxRequest("POST", "/api/login", formdata);
    form.reset();
}

//create
 async function createEmployee() {

    let form = document.forms[2];

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

 function readImage(image) {

    let reader = new FileReader();

    reader.readAsDataURL(image);
    return new Promise((resolve, reject) => {
        reader.onload = function (e) {
            resolve(e.target.result);
        }
    })
}

 function createTask() {

    let form = document.forms[1];

    //code sanitization here
    let formdata = {

        task: form.elements[0].value,
    }

    makeAjaxRequest("POST", task_add, formdata);
    form.reset();
}

//read
 function getAllEmployees() {

    makeAjaxRequest("GET", emp_route);

    if (dbData.length === 0) {
        elementDisplay("#search");
    }
}

 function getAllTasks() {

    makeAjaxRequest("GET", task_route);

    if (dbData.length === 0) {
        elementDisplay("#search");
    }
}

 function loginPage() {

    window.location.href = "/login";
}

//update
 function updateEmployee(id, fname, lname, email, sex, image) {

    let empData = {

        first_name: fname,
        last_name: lname,
        email: email,
        sex: sex,
        image: image
    }

    makeAjaxRequest("PUT", emp_update + "?empID=" + id + "", empData);
}
 function updateTask(id, taskName) {

    let taskData = {

        task: taskName,
    }

    makeAjaxRequest("PUT", task_update + "?taskID=" + id + "", taskData);
}

//delete
 function deleteEmployee(id) {

    makeAjaxRequest("DELETE", "/api/employees/delete?empID=" + id + "");
}
 function deleteTask(id) {

    makeAjaxRequest("DELETE","/api/tasks/delete?taskID=" + id + "");
}

/***************************************************************
                        DOM FUNCTIONS
***************************************************************/

 function elementDisplay(elementIdentifier) {

    let style = document.querySelector(elementIdentifier).style;

    if (!style.display || style.display === "none") {
      
        style.display = "block";
    }
    else {
      
        style.display = "none";
    }
}

 function renderError(message) {

    let error_msg = document.getElementById("error_msg");

    if (error_msg) {

        error_msg.innerHTML = message;

        if (message.length == 0) {

            error_msg.className = "no_background";
        }
        else {

            error_msg.className = "error_background";
        }
    }
}

 function renderData(data, parentId) {

    //check to see if its just a message and to see if there is an exclusive error message section of the html to display the error
    if (data.message) {

        renderError(data.message)
    }

    document.getElementById("raw_data").innerHTML = JSON.stringify(data, null, '\t');

    if (data[0] != undefined) {

        clearTable("renderTable");

        if (data[0].first_name) {

            createTableHeader(["Image", "Name", "Email", "Action"], "tableHdr")
        }
        else {

            createTableHeader(["Task", "Action"], "tableHdr")
        }

        data.map((obj, index) => {

            renderRow(obj, index, parentId);
        })
    }
}

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
        th.className = index === last ? "th_action" : "th_style";
        tHead.appendChild(th);
    })

    document.querySelector("#renderTable").appendChild(tHead);
}

 function createTableRow(detailList, index, _id) {

    let row_color = (index % 2 == 0) ? "background-color:white;" : "background-color:lightgrey;";
    let row = document.createElement('tr');
    row.style = row_color;
    row.id = _id;

    detailList.map((td) => {

        td.className = "td_style";
        row.appendChild(td);
    })

    return row;
}

 function updateRowData(data, _id) {

    let row = document.getElementById(_id);

    if (data.first_name) {

        row.childNodes[0].lastChild.src = data.image;
        row.childNodes[1].innerHTML = data.first_name + " " + data.last_name;
        row.childNodes[2].innerHTML = data.email;
    }
    else {

        row.childNodes[0].innerHTML = data.task;
    }
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
    buttonDiv.style = "float:right;width:max-content;";
    let updateBtn = document.createElement('button');
    updateBtn.className = "btn_sizing";
    updateBtn.innerHTML = "Update";
    let deleteBtn = document.createElement('button');
    deleteBtn.className = "btn_sizing btn_delete";
    deleteBtn.innerHTML = "Delete";

    if (data.status == "editable") {

        if (data.first_name) {

            buttonDiv.innerHTML =
                "<button class='btn_sizing' disabled='true'>Update</button>" +
                "<button class='btn_sizing btn_delete'  onclick=\"deleteEmployee(\'" + _id + "\')\">Delete</button>";
        }
        else {

            buttonDiv.innerHTML =
                "<button class='btn_sizing' disabled='true'>Update</button>" +
                "<button class='btn_sizing btn_delete'  onclick=\"deleteTask(\'" + _id + "\')\">Delete</button>"
        }
    }

    td4.appendChild(buttonDiv);

    //create cloumns
    if (data.first_name) {

        let img = new Image();
        img.src = data.image;
        img.alt = "Image of employee";
        td1.appendChild(img);
        row = createTableRow([td1, td2, td3, td4], index, _id)
    }
    else {

        td1.innerHTML = data.task;
        row = createTableRow([td1, td4], index, _id)
    }

    document.querySelector(parentId).appendChild(row);
}
