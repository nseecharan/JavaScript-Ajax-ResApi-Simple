import { createButton } from './renderInputs.js';
import { updateEmpForm, updateTaskForm } from '../events.js';
import { deleteEmployee, deleteTask } from '../requests.js';

export function clearTable(tableId) {

    if (document.getElementById(tableId)) {

        document.getElementById(tableId).childNodes[2].textContent = "";
        document.getElementById(tableId).childNodes[4].textContent = "";
    }
}

export function createTableHeader(headerList, parentId) {

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

export function renderRow(data, index, parentId) {

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

            let updateBtn = createButton("emp-update-btn", "btn-sizing", "Update", "button");
            let deleteBtn = createButton("emp-delete-btn", "btn-sizing btn-red", "Delete", "button");

            updateBtn.addEventListener('click', () => {

                updateEmpForm(_id);
            })

            deleteBtn.addEventListener('click', () => {

                deleteEmployee(_id);
            })

            buttonDiv.append(updateBtn, deleteBtn);

        }
        else {

            let updateBtn = createButton("task-update-btn", "btn-sizing", "Update", "button");
            let deleteBtn = createButton("task-delete-btn", "btn-sizing btn-red", "Delete", "button");

            updateBtn.addEventListener('click', () => {

                updateTaskForm(_id);
            })

            deleteBtn.addEventListener('click', () => {

                deleteTask(_id);
            })

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

    document.getElementById(parentId).appendChild(row);
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