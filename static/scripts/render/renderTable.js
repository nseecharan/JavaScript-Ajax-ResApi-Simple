import { createButton } from './renderInputs.js';
import { openEmpUpdateForm, openTaskUpdateForm } from '../menuEvents.js';
import { clearElement } from './renderTools.js';
import * as s from '../elementAttributes.js';//import styles

//Create the inital table structure to render data.
export const createTable = (headerList, parentId) => {

    clearElement("#" + parentId);
    const newTable = document.createElement('table');
    const newTblHeader = document.createElement('thead');
    const newTblBody = document.createElement('tbody');
    newTable.id = s.tableID;
    newTable.className = s.tableClass;
    newTblHeader.id = s.tableHeaderID;
    newTblHeader.className = s.tableHeaderClass;
    newTblBody.id = s.tableBodyID;

    if (headerList.length) {
        const last = headerList.length - 1;
        headerList.map((header, index) => {
            const th = document.createElement('th');
            th.textContent = header;
            th.className = index === last ? s.thActionClass : s.thClass;
            newTblHeader.appendChild(th);
        })
        newTable.append(newTblHeader, newTblBody);
    }
    else {
        newTable.append(newTblBody);
    }

    document.getElementById(parentId).appendChild(newTable);
}

//Renders a table row based on the type of data passed.
//This function will be broken up into smaller functions in future iterations.
export const renderRow = (data, parentId) => {

    if (!data) {

        return;
    }

    const _id = data._id;

    //row buttons
    const buttonDiv = document.createElement('div');
    buttonDiv.style = "margin:auto;width:max-content;";

    if (data.status == "editable") {

        if (data.first_name) {

            const updateBtn = createButton(s.empUpdateBtnID, s.buttonClass, "View Employee", "button", s.empUpdateBtnAria, "employeeUpdateBtn");

            updateBtn.addEventListener('click', () => {

                openEmpUpdateForm(data);
            })

            buttonDiv.append(updateBtn);

        }
        else {

            const updateBtn = createButton(s.taskUpdateBtnID, s.buttonClass, "View Task", "button", s.taskUpdateBtnAria, "taskUpdateBtn");

            updateBtn.addEventListener('click', () => {

                openTaskUpdateForm(data);
            })

            buttonDiv.append(updateBtn);
        }
    }

    const actionTd = document.createElement('td');
    actionTd.appendChild(buttonDiv);

    //create cloumns
    if (data.first_name) {

        const td1 = document.createElement('td');
        const p1 = document.createElement('p');
        const name = data.first_name + " " + data.last_name;
        p1.innerText = name;
        td1.append(p1);

        const td2 = document.createElement('td');
        const p2 = document.createElement('p');
        const email = data.email;
        p2.innerText = email;
        td2.append(p2);

        /*
        const td3 = document.createElement('td');
        const p3 = document.createElement('p');
        const sex = (data.sex === "Male") ? "M" : (data.sex === "Female") ? "F" : "";
        p3.innerText = sex;
        td3.append(p3);
        */

        const imageTd = document.createElement('td');
        const img = new Image();
        img.src = data.image;
        img.alt = "Image of employee";
        imageTd.appendChild(img);

        const row = addRowDetails([imageTd, td1, td2, actionTd], _id)
        document.getElementById(parentId).appendChild(row);
    }
    else {

        const td1 = document.createElement('td');
        const p1 = document.createElement('p');
        p1.innerText = data.task;
        td1.append(p1);
        const row = addRowDetails([td1, actionTd], _id)
        document.getElementById(parentId).appendChild(row);
    }
}

//This will add details to a row from an array of row details.
const addRowDetails = (detailList, _id) => {

    const row = document.createElement('tr');
    row.id = _id;
    row.className = s.trClass;
    const last = detailList.length - 1;
    detailList.map((td, index) => {

        td.className = index === last ? s.tdActionClass : s.tdClass;
        row.appendChild(td);
    })

    return row;
}
