import { createButton } from './renderInputs.js';
import { openEmpUpdateForm, openTaskUpdateForm } from '../menuEvents.js';
import { clearElement } from './renderTools.js';
import * as attr from '../elementAttributes.js';

const tID_table = "render-table";
const tID_header = "tableHdr";
const tClass_style = "table-styling";
const tClass_theadStyle = "thead-style";
const tClass_thStyle = "th-style";
const tClass_thAction = "th-action";
const tClass_tdStyle = "td-style";
const tClass_tdAction = "td-action";
const aria_viewEmployee ="Button to view an employee, and edit the information if logged in.";
const aria_viewTask = "Button to view a task, and edit the information if logged in.";

//Create the inital table structure to render data.
export const createTable = (headerList, parentId) => {

    clearElement("#" + parentId);
    const newTable = document.createElement('table');
    const newTblHeader = document.createElement('thead');
    const newTblBody = document.createElement('tbody');
    newTable.id =tID_table;
    newTable.className =tClass_style;
    newTblHeader.id =tID_header;
    newTblHeader.className =tClass_theadStyle;
    newTblBody.id =attr.tID_body;

    if (headerList.length) {
        const last = headerList.length - 1;
        headerList.map((header, index) => {
            const th = document.createElement('th');
            th.textContent = header;
            th.className = index === last ?tClass_thAction :tClass_thStyle;
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

            const updateBtn = createButton(attr.btnID_empUpdate, attr.btnClass_sizing, "View Employee", "button", aria_viewEmployee, "employeeUpdateBtn");

            updateBtn.addEventListener('click', () => {

                openEmpUpdateForm(data);
            })

            buttonDiv.append(updateBtn);

        }
        else {

            const updateBtn = createButton(attr.btnID_taskUpdate, attr.btnClass_sizing, "View Task", "button", aria_viewTask, "taskUpdateBtn");

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
    row.className =attr.tClass_trStyle;
    const last = detailList.length - 1;
    detailList.map((td, index) => {

        td.className = index === last ?tClass_tdAction :tClass_tdStyle;
        row.appendChild(td);
    })

    return row;
}
