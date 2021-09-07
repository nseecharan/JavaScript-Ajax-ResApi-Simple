const th_style = "class='th_style'"
const th_action = "class='th_action'";
const thead_style = "class='thead_style'";
const td_style = "class='td_style'";

/***************************************************************
                        AJAX FUNCTIONS                           
***************************************************************/

function makeAjaxRequest(method, url, data) {

    console.log("client: ajaxreq - ", method, url, data)

    if (data) {

        fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((json) => {

                console.log("client: response from application service", JSON.stringify(json))
                renderData(json);
            })
            .catch((err) => {

                console.log(err);
            });
    }
    else {

        fetch(url, { method: method })
            .then((response) => response.json())
            .then((json) => {

                console.log("client: response from application service", json)
                renderData(json);
            })
            .catch((err) => {

                console.log(err);
            });
    }
}

/***************************************************************
                        DEMO FUNCTIONS                          
***************************************************************/

//demo_create
function demoCreateEmployee() {

    makeAjaxRequest("POST", "/api/demo/employees/create");
}

function demoCreateTask() {

    makeAjaxRequest("POST", "/api/demo/tasks/create");
}

//demo_read --find by name
function demofindEmployee() {

    makeAjaxRequest("GET","/api/demo/employees?fname=Jim&lname=Callen");
}

function demofindTask() {

    makeAjaxRequest("GET","/api/demo/tasks?taskName=Washroom Duty");
}

//demo_update --update by id
function demoUpdateEmployee(id, fname, lname, email, gender, image) {

    let empData = {

        first_name: fname,
        last_name: lname,
        email: email,
        gender: gender,
        image: image
    }

    makeAjaxRequest("PUT", "/api/demo/employees/update?empID=" + id + "", empData);
}

function demoUpdateTask(id, taskName) {

    let taskData = {

        task: taskName,
    }

    makeAjaxRequest("PUT", "/api/demo/tasks/update?taskID=" + id + "", taskData);
}

//demo_delete --delete by id
function demoDeleteEmployee(id) {

    console.log("client delete emp id", id)
    makeAjaxRequest("DELETE", "/api/demo/employees/delete?empID=" + id + "");
}

function demoDeleteTask(id) {

    makeAjaxRequest("DELETE","/api/demo/tasks/delete?taskID=" + id + "");
}


/***************************************************************
                        MAIN FUNCTIONS                          
***************************************************************/

//login
function login() {

    let form = document.forms[0];

    console.log(form.elements[1].value)

    let formdata = {

        username: form.elements[0].value,
        password: form.elements[1].value
    }
    makeAjaxRequest("POST", "/api/login", formdata);

    //window.location.href = "/";

}

/***************************************************************
                        DOM FUNCTIONS                           
***************************************************************/

function renderData(json) {

    //console.log("client: render to DOM", json)

    //check to see if its just a message and to see if there is an exclusive error message section of the html to display the error
    if (json.message) {

        let error_msg = document.getElementById("error_msg");

        if (error_msg) {

            error_msg.innerHTML = json.message;

            if (json.message.length == 0) {

                error_msg.className = "no_background";
            }
            else {

                error_msg.className = "error_background";
            }
        }
    }

    document.getElementById("raw_data").innerHTML = JSON.stringify(json, null, '\t');

    if (json[0] != undefined) {

        if (json[0].first_name) {

            empMockup(json);
        }
        else {

            taskMockup(json);
        }
    }
}


//MEMO convert all hard coded css to classes in styles.css
function empMockup(data) {

    if (!data) {

        //console.log("client: mockup had bad data")
        return;
    }

    let table = "<table class='table_styling'>";
    let updateBtn = "<button class='btn_sizing'  onclick='loadUpdate()'>Update</button>";
    let deleteBtn = "";
    let count = 0;
    let row_color = "";

    table += "<thead " + thead_style + "><th " + th_style + ">Image</th><th " + th_style + ">Name</th><th " + th_style + ">Email</th><th " + th_action + ">Action</th></thead>";
    table += "<tbody>";

    while (count < data.length) {

        let name = data[count].first_name + " " + data[count].last_name;
        let email = data[count].email;
        let image = data[count].image;
        let _id = data[count]._id;
        //let gender = data[count].gender;

        deleteBtn = "<button class='btn_sizing btn_delete'  onclick=\"demoDeleteEmployee(\'" + _id + "\')\">Delete</button>";
        row_color = (count % 2 == 0) ? "background-color:white;" : "background-color:lightgrey;";
        table += "<tr style='" + row_color + "'>";
        table += "<td " + td_style + "'><img src='" + image + "' alt='Image of employee'></td>";
        table += "<td " + td_style + "'>" + name + "</td>";
        table += "<td " + td_style + "'>" + email + "</td>";

        if (data[count].status != "demo") {

            if (data[count].status == "test") {

                updateBtn = "<button class='btn_sizing'  onclick=\"demoUpdateEmployee(\'" +
                    _id + "\',\'Dr. Jimmy\',\'Callen\',\'j.callen@_demo.ca\',\'Male\',\'\')\">Update</button>"
            }

            table += "<td " + td_style + "'>" + "<div style='float:right;width:max-content;'>" + updateBtn + deleteBtn + "</div>" + "</td>";
        }
        else {

            table += "<td " + td_style + "'></td>";
        }

        table += "</tr>";

        count++;
    }

    table += "</tbody></table>";

    document.getElementById("mock_data").innerHTML = table;
}

function taskMockup(data) {

    if (!data) {

        console.log("client: mockup had bad data")
        return;
    }

    let table = "<table class='table_styling'>";
    let updateBtn = "<button class='btn_sizing' onclick='loadUpdate()'>Update</button>";
    let deleteBtn = "";
    let count = 0;
    let row_color = "";

    table += "<thead " + thead_style + "><th " + th_style + ">Task</th><th " + th_action + ">Action</th></thead>";
    table += "<tbody>";

    while (count < data.length) {

        let name = data[count].task;
        let _id = data[count]._id;

        deleteBtn = "<button class='btn_sizing btn_delete'  onclick=\"demoDeleteTask(\'" + _id + "\')\">Delete</button>";
        row_color = (count % 2 == 0) ? "background-color:white;" : "background-color:lightgrey;";
        table += "<tr style='" + row_color + "'>";
        table += "<td " + td_style + "'>" + name + "</td>";

        if (data[count].status != "demo") {

            if (data[count].status == "test") {

                updateBtn = "<button class='btn_sizing'  onclick=\"demoUpdateTask(\'" +
                    _id + "\',\'Janitor Duty\')\">Update</button>"
            }

            table += "<td " + td_style + "'>" + "<div style='float:right;width:max-content;'>" + updateBtn + deleteBtn + "</div>" + "</td>";
        }
        else {

            table += "<td " + td_style + "'></td>";
        }

        table += "</tr>";

        count++;
    }

    table += "</tbody></table>";

    document.getElementById("mock_data").innerHTML = table;
}

function loadUpdate() {

    console.log("does nothing yet")
    //window.location.href='will contain relevant route';

}

//load image from database
function loadDBImage(files) {

    if (!files) {

        return "";
    }

    //console.log("file data ", files.data)
    let array = new Uint8Array(files.data);
    let b = new Blob([array], { type: "image/jpeg" })
    let reader = new FileReader();
    reader.readAsDataURL(b);

    if (reader) {

        reader.onload = (data) => {

            return data.target.result;
        }
    }
    else {

        return "";
    }
}
