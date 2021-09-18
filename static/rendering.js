

/***************************************************************
                        DOM FUNCTIONS                           
***************************************************************/

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
    //let gender = data.gender;

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

    if (data.status == "test") {

        if (data.first_name) {

            buttonDiv.innerHTML =
                "<button class='btn_sizing'  onclick=\"demoUpdateEmployee(\'" + _id + "\',\'Dr. Jimmy\',\'Callen\',\'j.callen@_demo.ca\',\'Male\',\'\')\">Update</button>" +
                "<button class='btn_sizing btn_delete'  onclick=\"demoDeleteEmployee(\'" + _id + "\')\">Delete</button>";
        }
        else {

            buttonDiv.innerHTML =
                "<button class='btn_sizing'  onclick=\"demoUpdateTask(\'" + _id + "\',\'Janitor Duty\')\">Update</button>" +
                "<button class='btn_sizing btn_delete'  onclick=\"demoDeleteTask(\'" + _id + "\')\">Delete</button>"
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

export default {renderData, clearTable, updateRowData}