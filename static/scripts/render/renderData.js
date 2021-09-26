import { createTableHeader, renderRow } from './renderTable.js';
import { elementDisplay, clearElement } from './renderTools.js';

//This function passes data to relevant functions that will configure the table
//and render data in the table body. You must pass the ID (or Class) of the table
//body you want to add the data to.
export function renderData(data, tableBodyId, token) {

    if (!document.getElementById(tableBodyId)) {

        return;
    }
    //check to see if its just a message and to see if there is an exclusive error message section of the html to display the error
    if (data.message) {

        renderError(data.message)
    }

    if (token && !document.getElementById("create-options").style.display) {

        elementDisplay("#create-options");
    }

    document.getElementById("raw-data").innerHTML = JSON.stringify(data, null, '\t');

    if (data[0] != undefined) {

        clearElement("#tableHdr");
        clearElement("#tableBody");

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